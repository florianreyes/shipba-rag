import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { cosineDistance, desc, gt, sql, inArray } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";
import { users } from "../db/schema/users";

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
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

// export const getUsersFromId = async (ids: string[]): Promise<string[]> => {
//   const usersList = await db
//     .select({ name: users.name, content: users.content })
//     .from(users)
//     .where(inArray(users.id, ids));
//   return usersList.map((user) => user.name);
// };

// export const findRelevantContent = async (userQuery: string) => {
//   const userQueryEmbedded = await generateEmbedding(userQuery);
//   const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, userQueryEmbedded)})`;
//   const similarContentFromUser = await db
//     .select({ id: embeddings.id, userId: embeddings.userId, name: embeddings.content, similarity })
//     .from(embeddings)
//     .where(gt(similarity, 0.3))
//     .orderBy((t) => desc(t.similarity))
//     .limit(8);

//   console.log(similarContentFromUser);

//   const userIds = similarContentFromUser.map((content) => content.userId).filter((id): id is string => id !== null);
//   const userNames = await getUsersFromId(userIds);

//   return { similarContentFromUser, userNames };
// };

export const getUsersFromId = async (ids: string[]): Promise<Array<{ name: string; content: string }>> => {
  const usersList = await db
    .select({ name: users.name, content: users.content })
    .from(users)
    .where(inArray(users.id, ids));
  return usersList.map((user) => ({ name: user.name, content: user.content }));
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, userQueryEmbedded)})`;
  const similarContentFromUser = await db
    .select({ id: embeddings.id, userId: embeddings.userId, name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.7))
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  console.log(similarContentFromUser);
  const userIds = similarContentFromUser.map((content) => content.userId).filter((id): id is string => id !== null);
  console.log(userIds);
  const userNamesAndContents = await getUsersFromId(userIds);

  return userNamesAndContents;
};

