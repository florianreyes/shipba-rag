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
No mencionar "esta persona bla bla" todo el tiempo, sino utilizar "Tiene", "Es", "Le gusta" o la estructura que mejor se adapte.
Esta mejora de la descripción tiene como objetivo ser utilizada para generar embeddings después de fragmentarla en oraciones separadas por punto. Por lo tanto, debes aprovechar cada oración para describir un aspecto diferente del interés. Cada aspecto debe tener su propia oracion.`,
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

/**
 * Summarizes a description to create a concise version
 * @param description The description to summarize
 * @param maxLength Optional maximum length for the summary (in characters)
 * @returns A summarized version of the description
 */
export async function summarizeDescription(description: string, maxLength: number = 200): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: `Eres un experto en resumir texto manteniendo los puntos clave y la esencia del contenido original.
Tu tarea es crear un resumen conciso pero informativo del texto proporcionado.
Debes preservar los detalles más importantes sin exceder el límite de caracteres especificado.
No agregues información que no esté presente en el texto original.
Evita frases introductorias como "Este es un resumen de..." o "El texto trata sobre...".`,
      prompt: `Texto original: "${description}"
Por favor, resume este texto en ${maxLength} caracteres o menos:`,
    });

    // Ensure the summary is within the maxLength
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
  } catch (error) {
    console.error('Error summarizing description:', error);
    // Fallback to a truncated version of the original if generation fails
    if (description.length > maxLength) {
      return description.substring(0, maxLength - 3) + '...';
    }
    return description;
  }
}

/**
 * Extracts up to 4 relevant keywords from a description
 * @param description The description to extract keywords from
 * @returns An array of up to 4 keywords
 */
export async function extractKeywords(description: string): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: `Eres un experto en análisis de texto y extracción de palabras clave.
Tu tarea es identificar hasta 4 palabras clave individuales que mejor representen los temas principales del texto proporcionado.
Cada palabra clave debe ser UNA SOLA PALABRA (un sustantivo), nunca frases de múltiples palabras.
Debes elegir términos que sean específicos y representativos del contenido, evitando palabras demasiado generales.
Devuelve las palabras clave separadas por comas, sin numerarlas ni añadir explicaciones adicionales.`,
      prompt: `Texto: "${description}"
Extrae hasta 4 palabras clave (una sola palabra por keyword) que mejor representen este texto:`,
    });

    // Split by commas and clean up each keyword
    const keywords = text.split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0)
      // Ensure each keyword is only one word (no spaces)
      .filter(keyword => !keyword.includes(' '))
      .slice(0, 4); // Ensure no more than 4 keywords

    return keywords;
  } catch (error) {
    console.error('Error extracting keywords:', error);
    // Fallback to a simple extraction of nouns from the description
    const words = description.split(/\s+/);
    const uniqueWords = [...new Set(words)];
    return uniqueWords
      .filter(word => word.length > 3) // Filter out short words
      .slice(0, 4); // Take up to 4 words
  }
}