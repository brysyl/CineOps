import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing from environment variables.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are CineOps AI, an autonomous multi-agent studio control room and render cluster manager. Respond to the operator's query with technical authority, referencing nodes, thermal limits, and VRAM optimization: ${prompt}`,
    });

    return NextResponse.json({ result: response.text });
  } catch (error: any) {
    console.error('Gemini Agent Error:', error);
    return NextResponse.json({ error: error.message || 'Agent reasoning stream interrupted.' }, { status: 500 });
  }
}
