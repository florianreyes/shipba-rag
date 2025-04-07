import { generateObject, LanguageModel } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { db } from "../db";
import { users } from "../db/schema/users";
import { workspacesUsers } from "../db/schema/workspaces_users";
import { eq } from "drizzle-orm";

// Schema for the structured output
const searchResultSchema = z.object({
  matches: z.array(
    z.object({
      userId: z.string(),
      name: z.string(),
      content: z.string(),
      contentSummary: z.string(),
      keywords: z.array(z.string()),
      matchReason: z.string()
    })
  )
});

// Interface to match the expected Person format
interface Person {
  name: string;
  content: string;
  contentSummary: string;
  keywords: string[];
  socialHandles?: {
    x?: string;
    telegram?: string;
    instagram?: string;
  };
}

/**
 * Get all users for a specific workspace
 */
export const getUsersForWorkspace = async (workspaceId: string) => {
  const usersInWorkspace = await db
    .select({
      id: users.id,
      name: users.name,
      content: users.content,
      x_handle: users.x_handle,
      telegram_handle: users.telegram_handle,
      instagram_handle: users.instagram_handle
    })
    .from(users)
    .innerJoin(
      workspacesUsers,
      eq(users.id, workspacesUsers.userId)
    )
    .where(eq(workspacesUsers.workspaceId, workspaceId));

  return usersInWorkspace;
};

/**
 * Format users into a context document
 */
export const formatUsersContext = (users: Array<{ id: string; name: string | null; content: string | null; x_handle?: string | null; telegram_handle?: string | null; instagram_handle?: string | null }>) => {
  return users
    .filter(user => user.content) // Filter out users without content
    .map(user => {
      const socialInfo = [
        user.x_handle ? `X: ${user.x_handle}` : '',
        user.telegram_handle ? `Telegram: ${user.telegram_handle}` : '',
        user.instagram_handle ? `Instagram: ${user.instagram_handle}` : ''
      ].filter(Boolean).join(', ');

      // Include social handles in the context if they exist
      const socialSection = socialInfo ? `\nSOCIAL: ${socialInfo}` : '';
      
      return `USER_ID: ${user.id}\nNAME: ${user.name || "Unknown"}\nCONTENT: ${user.content}${socialSection}\n---\n`;
    })
    .join("\n");
};

/**
 * Extract social handles from user information
 */
const extractSocialHandles = (user: { x_handle?: string | null; telegram_handle?: string | null; instagram_handle?: string | null }) => {
  const handles: { x?: string; telegram?: string; instagram?: string } = {};
  
  if (user.x_handle) handles.x = user.x_handle;
  if (user.telegram_handle) handles.telegram = user.telegram_handle;
  if (user.instagram_handle) handles.instagram = user.instagram_handle;
  
  return handles;
};

/**
 * Search users using Gemini with CAG approach
 */
export const searchUsersWithContext = async (userQuery: string, workspaceId: string) => {
  try {
    
    // Get all users for the workspace
    const workspaceUsers = await getUsersForWorkspace(workspaceId);
    
    // If no users, return empty array
    if (workspaceUsers.length === 0) {
      return [];
    }
    
    // Format users into context
    const context = formatUsersContext(workspaceUsers);
    
    // Create a map of user IDs to their full information for later use
    const userMap = new Map(workspaceUsers.map(user => [user.id, user]));
    
    // Use Gemini to find relevant users
    const geminiModel = google("gemini-2.0-flash-exp", {
      structuredOutputs: true
    });
    
    const prompt = `
      CONSULTA DE BÚSQUEDA: ${userQuery}
      
      CONTEXTO DE PERFILES DE USUARIOS:
      ${context}
      
      Basado en la consulta de búsqueda, identifica los usuarios más relevantes del contexto. Tiene que estar completamente centrado en la consulta de búsqueda. Si no hay usuarios relevantes o hay algunos que solo se parecen un poquito pero no son relevantes, devuelve un array vacío.
      Por ejemplo, si la consulta es "quien le gusta bailar", no deberías devolver alguien que le guste solo la música, sino alguien que le guste bailar. Si alguien dice alguien que juegue al tenis, no deberías devolver alguien que juegue al padel.    
      Para cada usuario relevante:
      1. Devuelve su userId, name y content
      2. Crea un contentSummary conciso (1-3 oraciones) que explique cómo se relacionan con la consulta de búsqueda
      3. Genera 5 palabras clave individuales (keywords) que mejor representen su experiencia o intereses
      4. Añade una breve razón por la que coincide con la consulta (matchReason)
      
      IMPORTANTE: Toda la información generada (contentSummary, keywords, matchReason) DEBE estar en español.
    `;
    
    const systemPrompt = `Eres un asistente de búsqueda que ayuda a encontrar los usuarios más relevantes según una consulta.
              Se te proporcionará un contexto que contiene múltiples perfiles de usuarios y una consulta de búsqueda.
              Analiza el contexto e identifica qué usuarios son más relevantes para la consulta.
              Enfócate en el significado semántico y la relevancia, no solo en la coincidencia de palabras clave.
              Devuelve los usuarios más relevantes (máximo 5) con:
              - userId: El identificador único del usuario
              - name: El nombre del usuario
              - content: El contenido original del usuario
              - contentSummary: Un breve resumen (1-3 oraciones) de cómo se relacionan con la consulta de búsqueda
              - keywords: Un array de 5 etiquetas de una sola palabra que representan su experiencia o intereses
              - matchReason (opcional): Una breve razón por la que coinciden con la consulta
              
              TODAS las respuestas generadas deben estar en ESPAÑOL.
              Si no hay usuarios relevantes, devuelve un array vacío.`;
    
    const { object } = await generateObject({
      model: geminiModel as LanguageModel,
      schema: searchResultSchema,
      system: systemPrompt,
      prompt
    });
    
    
    // Process matches to add social handles
    const processedMatches = object.matches.map(match => {
      // Get the original user data if available
      const originalUser = userMap.get(match.userId);
      
      if (!originalUser) {
        // If the user ID doesn't exist in our map, return as is
        return match as Person;
      }

      // Extract social handles
      const socialHandles = extractSocialHandles(originalUser);
      
      // Create a Person object that matches the expected format
      const person = {
        ...match,
        name: originalUser.name || match.name,
        content: originalUser.content || match.content,
        socialHandles
      } as Person;
    
      return person;
    });
    
 
    return processedMatches;
  } catch (error) {
    throw error;
  }
}; 