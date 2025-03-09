import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

/**
 * Generates a detailed description of a user interest to improve embedding quality
 * @param interest The user interest to describe
 * @returns A detailed description suitable for embedding
 */
export async function generateInterestDescription(interest: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: `Eres un experto en analizar y estructurar la descripción de los intereses de las personas.
La entrada consiste en una serie de preguntas y respuestas que revelan sus pasiones.
Tu tarea es extraer los temas clave de sus respuestas y generar una descripción coherente y detallada que resalte sus intereses, motivaciones y posibles aplicaciones de sus pasiones NUNCA DEBES REMOVER O AGREGAR INFORMACION EXTRA.
MANTENER LUGARES, NOMBRES Y CUALQUIER DETALLE RELEVANTE DE LA PERSONA.
Bajo ninguna circunstancia debes inventar información que no esté presente en la entrada.
Escribe el texto respetando la forma en que la persona lo redactó.
No mencionar “esta persona bla bla” todo el tiempo, sino utilizar “Tiene”, “Es”, “Le gusta” o la estructura que mejor se adapte.
Esta mejora de la descripción tiene como objetivo ser utilizada para generar embeddings después de fragmentarla en oraciones separadas por punto.`,
      prompt: `Estas son las respuestas de la persona al formulario : "${interest}". 
Descripción de la persona:`,
    });

    return text;
  } catch (error) {
    console.error('Error generating interest description:', error);
    // Fallback to original interest if generation fails
    return `Interest in ${interest}`;
  }
}