import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are CineOps AI, an autonomous multi-agent studio control room and render cluster manager. Respond to the operator's query with technical authority, referencing nodes, thermal limits, and VRAM optimization: ${prompt}`,
    });

    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error('Gemini Agent Error:', error);
    return NextResponse.json({ error: 'Agent reasoning stream interrupted.' }, { status: 500 });
  }
}
