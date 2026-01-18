import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateApologyMessage = async (scenario: string, senderName: string): Promise<string> => {
  try {
    const modelId = 'gemini-3-flash-preview';
    
    const prompt = `
      Write a very short, cute, kawaii, and slightly funny apology note for the following scenario: "${scenario}".
      The sender's name is ${senderName}.
      Keep it under 30 words.
      Use emojis.
      Tone: Humble but playful.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "I'm really sorry! Please forgive me! 🥺";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return `I'm super sorry about ${scenario}! Please forgive me! 🥺`;
  }
};
