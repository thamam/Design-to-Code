import { GoogleGenAI } from "@google/genai";
import { CodeMode, Language } from '../types';
import { buildPrompt } from './promptBuilder';

// Initialize the Gemini client
// Note: In a real production app, we might want to handle API key rotation or user input if missing.
// For this environment, we assume process.env.GEMINI_API_KEY is available.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. LLM calls will fail unless provided.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export async function generateCode(
  currentText: string,
  previousText: string,
  existingCode: string,
  mode: CodeMode,
  language: Language
): Promise<string> {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please configure it in the environment.");
  }

  const prompt = buildPrompt(currentText, previousText, existingCode, mode, language);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    
    const text = response.text;
    if (!text) {
      throw new Error("No code generated.");
    }

    // Clean up markdown fences if the model ignores the instruction
    let cleanText = text.trim();
    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```[a-z]*\n/, "").replace(/\n```$/, "");
    }
    
    return cleanText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
