import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


/**
 * Generates single-word keywords (badges) from content
 * @param content The content to extract keywords from
 * @param count Optional number of keywords to generate (default: 5)
 * @returns An array of single-word keywords
 */
export async function generateKeywordBadges(content: string, count: number = 5): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: `You are an expert at identifying the most relevant keywords from text.
Your task is to extract exactly ${count} single-word keywords that best represent the content.
Each keyword must be a single word - no phrases, no multi-word terms.
Choose words that are specific, descriptive, and relevant to the main topics in the content.
The keywords should cover different aspects of the content when possible.
Return only the keywords, separated by commas, with no additional text. Generar todo en español`,
      prompt: `Content: "${content}"
Please extract exactly ${count} single-word keywords from this content. Separate each keyword with a comma:`,
    });

    // Split by comma and clean up each keyword
    return text.split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0 && !keyword.includes(' ')) // Ensure single words only
      .slice(0, count);
  } catch (error) {
    console.error('Error generating keyword badges:', error);
    // Fallback to extracting the most frequent words
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3) // Filter out short words
      .reduce((acc: {[key: string]: number}, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
    
    return Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([word]) => word);
  }
}

/**
 * Creates a simplified summary of a description and determines if it's relevant to a query
 * @param description The description to summarize
 * @param userQuery The user's search query to check relevance against
 * @param maxLength Optional maximum length for the summary in characters (default: 150)
 * @returns An object containing the summary and whether it should be rendered
 */
export async function summarizeDescription(
  description: string, 
  userQuery: string,
  maxLength: number = 150
): Promise<{ summary: string; shouldRender: boolean }> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: `Eres un experto en crear resúmenes breves y claros.
Tu tarea es analizar la descripción proporcionada y crear un resumen informativo.

Reglas importantes:
- Usa lenguaje simple y directo
- Todo en español y en minúsculas
- El resumen debe ser completo y descriptivo
- Incluye información general sobre la persona Y aspectos relacionados con la consulta
- Sé ESTRICTO con las coincidencias específicas:
  * Si buscan un deporte específico (ej: tenis), NO mostrar personas que solo juegan otros deportes
  * Si buscan una actividad específica, NO mostrar personas que hacen actividades similares pero diferentes
  * Solo indica shouldRender: true si hay una coincidencia EXACTA con lo que se busca
- Solo indica shouldRender: false si:
  * La descripción es completamente irrelevante
  * O si buscan algo específico (ej: tenis) y la persona no lo hace, aunque haga actividades similares

Formato de respuesta:
Devuelve SOLO un objeto JSON sin formato markdown. No uses \`\`\` ni otros caracteres especiales.
{
  "summary": "resumen completo de la persona, incluyendo aspectos generales y relacionados con la consulta",
  "shouldRender": true/false,
  "reason": "solo si shouldRender es false, explica por qué"
}`,
      prompt: `Descripción: "${description}"
Consulta del usuario: "${userQuery}"

Crea un resumen completo que:
1. Describa a la persona en general
2. Destaque aspectos relacionados con la consulta (si existen)
3. No exceda ${maxLength} caracteres

Responde SOLO con el objeto JSON:`,
    });

    try {
      // Limpiamos el texto de posibles backticks o caracteres markdown
      const cleanText = text.replace(/\`\`\`json|\`\`\`|\`/g, '').trim();
      const result = JSON.parse(cleanText);
      
      // Si shouldRender es false, usamos la razón como resumen
      const finalSummary = result.shouldRender ? result.summary : result.reason || result.summary;
      
      return {
        summary: finalSummary.length > maxLength ? 
          finalSummary.substring(0, maxLength) : 
          finalSummary,
        shouldRender: result.shouldRender
      };
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.log('Problematic text:', text);
      // Si no podemos parsear el JSON, asumimos que el texto es el resumen
      return {
        summary: text.length > maxLength ? text.substring(0, maxLength) : text,
        shouldRender: true // por defecto mostramos si hay error de parseo
      };
    }
  } catch (error) {
    console.error('Error summarizing description:', error);
    // Fallback a truncar la descripción
    const truncated = description.length > maxLength ? 
      description.substring(0, maxLength - 3) + '...' : 
      description;
    return {
      summary: truncated,
      shouldRender: true // por defecto mostramos en caso de error
    };
  }
}
