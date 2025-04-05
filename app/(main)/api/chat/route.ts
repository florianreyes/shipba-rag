import { findRelevantContent } from "@/lib/ai/embedding";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, workspaceId } = await req.json();

  // Extract the user's last message
  const lastMessage = messages[messages.length - 1];
  const userQuery = lastMessage.content;

  try {
    // Generate similar questions based on user query 
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      system: "Eres un asistente de busqueda de personas a partir de una consulta sobre intereses. Analiza la consulta del usuario y genera preguntas/frases similares. Las preguntas deben ser simples y directas, sin agregar calificativos o condiciones que no estén en la consulta original. Por ejemplo, si alguien busca personas que juegan tenis, no agregues términos como 'profesional' o 'famoso'.",
      schema: z.object({
        questions: z
          .array(z.string())
          .max(2)
          .describe("preguntas similares a la consulta del usuario. sé conciso."),
      }),
      prompt: `Analiza esta consulta: "${userQuery}". Proporciona lo siguiente:
              3 preguntas similares que podrían ayudar a responder la consulta del usuario. Hacer preguntas que sean en tercera persona, por ejemplo: "¿A quién le gusta viajar?", "¿Quien le gusta el fútbol?", "¿Quien le gusta el ajedrez?", etc.`,
    });

    // Get relevant content using the generated questions
    const similarQuestions = object.questions;
    const results = await Promise.all(
      similarQuestions.map(async (question) => 
        await findRelevantContent(question, workspaceId)
      )
    );

    // Flatten the array of arrays and remove duplicates based on 'name'
    // Filter out any potential undefined or null items before flattening
    const uniqueResults = Array.from(
      new Map(
        results
          .flat()
          .filter(item => item !== null && item !== undefined)
          .map((item) => [item.name, item])
      ).values()
    );

    // Return the unique results
    return Response.json({ persons: uniqueResults });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return Response.json(
      { error: "No se pudo procesar tu solicitud" },
      { status: 500 }
    );
  }
}
