import { GoogleGenAI } from '@google/genai';
import { injectable } from 'tsyringe';

import { ILlmProvider } from '@shared/gateways/llm-provider.port';

@injectable()
export class GeminiProvider implements ILlmProvider {
  private readonly ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }

  async execute<T>(prompt: string): Promise<T> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    console.log(response.text);

    return JSON.parse(response.text as string) as T;
  }
}
