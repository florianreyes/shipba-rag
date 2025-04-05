import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { cosineDistance, desc, gt, sql, inArray, and, eq } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";
import { users } from "../db/schema/users";
import { workspacesUsers } from "../db/schema/workspaces_users";
import { summarizeDescription, generateKeywordBadges } from "./summarizer";

import { db } from "../db";


const embeddingModel = openai.embedding("text-embedding-ada-002");

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  
  const chunks = generateChunks(value);
  
  try {
    const { embeddings } = await embedMany({
      model: embeddingModel,
      values: chunks,
    });
    
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
  } catch (error) {
    console.error("generateEmbeddings - Error generating embeddings:", error);
    throw error; // Re-throw to handle in the calling function
  }
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};


export const getUsersFromId = async (
  ids: string[],
  userQuery: string
): Promise<Array<{
  name: string;
  content: string;
  contentSummary: string;
  keywords: string[];
  socialHandles: {
    x?: string;
    telegram?: string;
    instagram?: string;
  }
}>> => {
  const usersList = await db
    .select({
      name: users.name,
      content: users.content,
      x_handle: users.x_handle,
      telegram_handle: users.telegram_handle,
      instagram_handle: users.instagram_handle
    })
    .from(users)
    .where(inArray(users.id, ids));

  // Process users with summarization and keyword extraction
  const processedUsers = await Promise.all(
    usersList.map(async (user) => {
      // Skip users without content
      if (!user.content) {
        return null;
      }
      
      // Use the new summarizeDescription function with userQuery
      const { summary: contentSummary, shouldRender } = await summarizeDescription(user.content, userQuery);
      
      // If shouldRender is false, return null to filter out later
      if (!shouldRender) {
        return null;
      }

      // Use the new generateKeywordBadges function for single-word keywords
      const keywords = await generateKeywordBadges(user.content, 5);

      // Collect non-null social handles
      const socialHandles: { x?: string; telegram?: string; instagram?: string } = {};
      if (user.x_handle) socialHandles.x = user.x_handle;
      if (user.telegram_handle) socialHandles.telegram = user.telegram_handle;
      if (user.instagram_handle) socialHandles.instagram = user.instagram_handle;

      return {
        name: user.name ?? "",
        content: user.content,
        contentSummary,
        keywords,
        socialHandles
      };
    })
  );

  // Filter out null results (where shouldRender was false or content was null)
  return processedUsers.filter((user): user is NonNullable<typeof user> => user !== null);
};

export const findRelevantContent = async (userQuery: string, workspaceId?: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, userQueryEmbedded)})`;
  
  // Base query
  let query = db
    .select({ 
      id: embeddings.id, 
      userId: embeddings.userId, 
      name: embeddings.content, 
      similarity 
    })
    .from(embeddings)
    .where(gt(similarity, 0.8));
  
  // If workspaceId is provided, join with workspaces_users to filter by workspace upfront
  if (workspaceId) {
    query = query
      .innerJoin(
        workspacesUsers,
        and(
          eq(embeddings.userId, workspacesUsers.userId),
          eq(workspacesUsers.workspaceId, workspaceId)
        )
      );
  }
  
  // Execute query with ordering and limit
  const similarContentFromUser = await query
    .orderBy((t) => desc(t.similarity))
    .limit(5);

  
  // If no results, return empty array
  if (similarContentFromUser.length === 0) {
    return [];
  }
  
  // Extract user IDs from results
  const userIds = similarContentFromUser
    .map((content) => content.userId)
    .filter((id): id is string => id !== null);
  
  // Get user details
  const userNamesAndContents = await getUsersFromId(userIds, userQuery);

  return userNamesAndContents;
}

