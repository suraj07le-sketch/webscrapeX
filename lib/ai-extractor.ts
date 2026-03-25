import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function extractWithAI(html: string, prompt: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY is not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Clean HTML to save tokens
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .substring(0, 50000); // Limit to 50k characters for safety

  const fullPrompt = `
    You are an expert web scraper. Extract data from the following HTML content based on this request: "${prompt}".
    Return ONLY a valid JSON object. Do not include any markdown formatting like \`\`\`json or explanations.
    
    HTML Content:
    ${cleanHtml}
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up response if it contains markdown code blocks
    text = text.replace(/```json\n?/, '').replace(/\n?```/, '').trim();
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error('AI Extraction Error:', error);
    throw new Error(`AI Extraction failed: ${error.message}`);
  }
}
