import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages, logs } = await req.json();

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a sharp, minimalist LifeQuest AI coach. 
                    Current User Context (Last 3 Logs): ${JSON.stringify(logs)}
                    Provide short, punchy, and slightly sarcastic but helpful coaching. 
                    Maximum 2-3 sentences. Be direct.`,
                },
                ...messages,
            ],
        });

        return NextResponse.json({ insight: response.choices[0].message.content });
    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ error: "AI agent is recharging..." }, { status: 500 });
    }
}
