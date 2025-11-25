import { GoogleGenAI, Modality } from "@google/genai";
import { VoiceName } from "../types";

// Always use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSpeech = async (
  text: string,
  voice: VoiceName = VoiceName.Puck
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No se recibieron datos de audio del modelo.");
    }

    return base64Audio;

  } catch (error) {
    console.error("Error generating speech:", error);
    throw error;
  }
};