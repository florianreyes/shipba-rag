"use server";

import {
  NewUserParams,
  insertUserSchema,
  users,
} from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";
import { generateEmbeddings } from "../ai/embedding";
import { db } from "../db";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";
import { generateInterestDescription } from "../ai/curator";

interface CreateBasicUserResult {
  success: boolean;
  userId?: string | number;
  existing?: boolean;
  error?: string;
}

// Basic user creation for registration - minimal fields required
export const createBasicUser = async (input: {
  name: string | null; 
  mail: string;
  auth_id: string | null;
}): Promise<CreateBasicUserResult> => {
  try {

    // Normalize email
    const normalizedEmail = input.mail.toLowerCase().trim();

    // Check if user already exists with this auth_id
    if (input.auth_id) {
      const existingAuthUsers = await db
        .select()
        .from(users)
        .where(eq(users.auth_id, input.auth_id))
        .limit(1);
      
      if (existingAuthUsers.length > 0) {
        return { 
          success: true, 
          userId: existingAuthUsers[0].id, 
          existing: true 
        };
      }
    }
    
    // Check if user exists with this email but no auth_id
    if (normalizedEmail) {
      const existingEmailUsers = await db
        .select()
        .from(users)
        .where(eq(users.mail, normalizedEmail))
        .limit(1);
      
      
      if (existingEmailUsers.length > 0) {
        // User exists with email, update with auth_id if provided
        if (input.auth_id) {
          
          // Use transaction for update
          const [updatedUser] = await db.transaction(async (tx) => {
            return await tx
              .update(users)
              .set({
                auth_id: input.auth_id,
                updatedAt: new Date()
              })
              .where(eq(users.id, existingEmailUsers[0].id))
              .returning();
          });
          
          return { 
            success: true, 
            userId: updatedUser.id, 
            existing: true 
          };
        } else {
          // Return existing user without updating if no auth_id provided
          return {
            success: true,
            userId: existingEmailUsers[0].id,
            existing: true
          };
        }
      }
    }
    
    // Create new user
    
    // Use transaction for user creation
    const [user] = await db.transaction(async (tx) => {
      return await tx
        .insert(users)
        .values({
          name: input.name,
          mail: normalizedEmail,
          auth_id: input.auth_id,
          content: "",  // Default empty content
        })
        .returning();
    });
    
    console.log('Successfully created new user:', user);
    return { success: true, userId: user.id, existing: false };
  } catch (error) {
    console.error("Error in createBasicUser:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error creating user"
    };
  }
};

// Complete user profile with detailed information
export const completeUserProfile = async (input: NewUserParams) => {
  try {
    
    var { name, mail, content, x_handle, telegram_handle, instagram_handle, auth_id } = insertUserSchema.parse(input);
    
    // Find existing user by email or auth_id
    let existingUser;
    if (auth_id) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.auth_id, auth_id));
      
      existingUser = user;
    }
    
    if (!existingUser && mail) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.mail, mail));
      
      existingUser = user;
    }
    
    if (!existingUser) {
      return "User not found. Please create an account first.";
    }
    
    // Process content with AI if provided
    if (content) {
      const processedContent = await generateInterestDescription(content);
      
      // Use transaction for multiple database operations
      await db.transaction(async (tx) => {
        // Update user profile
        const [updatedUser] = await tx
          .update(users)
          .set({ 
            name, 
            content: processedContent, 
            x_handle, 
            telegram_handle, 
            instagram_handle,
            updatedAt: new Date()
          })
          .where(eq(users.id, existingUser.id))
          .returning();

        // Delete existing embeddings for this user
        await tx
          .delete(embeddingsTable)
          .where(eq(embeddingsTable.userId, existingUser.id));

        // Generate and store new embeddings
        const embeddings = await generateEmbeddings(processedContent);
        await tx.insert(embeddingsTable).values(
          embeddings.map((embedding) => ({
            userId: updatedUser.id,
            ...embedding,
          })),
        );
      });

      return "User profile successfully updated and embedded.";
    } else {
      // Update basic user info without content/embeddings
      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ 
            name, 
            x_handle, 
            telegram_handle, 
            instagram_handle,
            updatedAt: new Date()
          })
          .where(eq(users.id, existingUser.id));
      });
      
      return "User profile successfully updated.";
    }
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error updating profile, please try again.";
  }
};

// Update user profile without AI processing of content
export const updateUserProfileWithExistingContent = async (input: Omit<NewUserParams, 'name'>) => {
  try {
    
    var { mail, content, x_handle, telegram_handle, instagram_handle, auth_id } = insertUserSchema.partial().parse(input);
    
    // Find existing user by email or auth_id
    let existingUser;
    if (auth_id) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.auth_id, auth_id));
      
      existingUser = user;
    }
    
    if (!existingUser && mail) {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.mail, mail));
      
      existingUser = user;
    }
    
    if (!existingUser) {
      return "User not found. Please create an account first.";
    }
    
    // Process content without AI processing if provided
    if (content) {
      // Check if content has changed
      const contentChanged = content !== existingUser.content;
      
      // Use transaction for multiple database operations
      await db.transaction(async (tx) => {
        // Update user profile
        const [updatedUser] = await tx
          .update(users)
          .set({ 
            content, 
            x_handle, 
            telegram_handle, 
            instagram_handle,
            updatedAt: new Date()
          })
          .where(eq(users.id, existingUser.id))
          .returning();

        // Only regenerate embeddings if content has changed
        if (contentChanged) {
          // Delete existing embeddings for this user
          await tx
            .delete(embeddingsTable)
            .where(eq(embeddingsTable.userId, existingUser.id));

          // Generate and store new embeddings
          if (content) {
            const embeddings = await generateEmbeddings(content);
            await tx.insert(embeddingsTable).values(
              embeddings.map((embedding) => ({
                userId: updatedUser.id,
                ...embedding,
              })),
            );
          }
        }
      });
      
      return contentChanged
        ? "User profile successfully updated and embeddings regenerated."
        : "User profile successfully updated with original content (embeddings unchanged).";
    } else {
      // Update basic user info without content/embeddings
      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ 
            x_handle, 
            telegram_handle, 
            instagram_handle,
            updatedAt: new Date()
          })
          .where(eq(users.id, existingUser.id));
      });
      
      return "User profile successfully updated.";
    }
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error updating profile, please try again.";
  }
};

// Function to get user by ID with content
export const getUserWithContent = async (userId: string) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    
    return user || null;
  } catch (error) {
    return null;
  }
};