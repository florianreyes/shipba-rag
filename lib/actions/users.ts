"use server";

import {
  NewUserParams,
  insertUserSchema,
  users,
} from "@/lib/db/schema/users";
import { generateEmbeddings } from "../ai/embedding";
import { db } from "../db";
import { embeddings as embeddingsTable } from "../db/schema/embeddings";

export const createUser = async (input: NewUserParams) => {
  console.log("Entre. Creando User...");
  try {
    const { name, mail, content } = insertUserSchema.parse(input);

    const [user] = await db
      .insert(users)
      .values({ name, mail, content })
      .returning();

    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        userId: user.id,
        ...embedding,
      })),
    );
    return "User successfully created and embedded.";
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};
