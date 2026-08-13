import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { directive } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        output: 'CINE-OPS AI ERROR: GEMINI_API_KEY is not configured in Vercel environment variables.' 
      }, { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are CineOps AI, an autonomous cluster architect and high-performance systems integrator. Provide a professional technical execution log, cluster segment status report, and telemetry breakdown for this operator directive: "${directive}"`
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ output: `Gemini API Error: ${data.error.message}` }, { status: 400 });
    }

    const modelText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Execution completed with zero payload returned.';
    return NextResponse.json({ output: modelText });
  } catch (err: any) {
    return NextResponse.json({ output: `System Exception: ${err.message}` }, { status: 500 });
  }
}
