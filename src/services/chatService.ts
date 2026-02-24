import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export async function generateChatResponse(messages: ChatMessage[], isFastMode: boolean): Promise<string> {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing.");
  }

  const model = isFastMode ? 'gemini-2.5-flash-lite' : 'gemini-3.1-pro-preview';
  
  const contents = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: "You are a helpful AI assistant for a Design-to-Code application. You help users understand code, suggest improvements, and answer programming questions.",
    }
  });

  return response.text || '';
}

export async function generateSpeech(text: string): Promise<string | undefined> {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}
