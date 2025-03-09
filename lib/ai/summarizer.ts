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
 * Creates a simplified summary of a description
 * @param description The description to summarize
 * @param maxLength Optional maximum length for the summary in characters (default: 150)
 * @returns A concise summary of the description
 */
export async function summarizeDescription(description: string, maxLength: number = 150): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: `You are an expert at creating brief, clear summaries.
Your task is to condense the provided description into a concise summary.
Focus only on the most essential information.
Use simple, direct language and complete sentences.
The summary should be easy to understand at a glance. Generar todo en español. todo en minusculas`,
      prompt: `Description: "${description}"
Please provide a simplified summary in ${maxLength} characters or less:`,
    });

    return text.length > maxLength ? text.substring(0, maxLength) : text;
  } catch (error) {
    console.error('Error summarizing description:', error);
    // Fallback to truncating the description
    if (description.length > maxLength) {
      const truncated = description.substring(0, maxLength - 3);
      return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
    }
    return description;
  }
}
