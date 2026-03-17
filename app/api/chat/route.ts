// app/api/chat/route.ts
import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set in .env.local")
}

const genAI = new GoogleGenerativeAI(apiKey || "")

// Types must match what we use in the frontend
type Role = "user" | "assistant" | "system"

interface ChatMessage {
  role: Role
  content: string
}

// Map our roles to Gemini roles
function mapRole(role: Role): "user" | "model" {
  if (role === "assistant") return "model"
  return "user" // treat both user + system as user prompts
}

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    // or "gemini-1.5-pro" if you need more power

    const chatHistory = messages
      // Gemini doesn’t support "system" directly, so we fold it into user prompts
      .map((m) => ({
        role: mapRole(m.role),
        parts: [{ text: m.content }],
      }))

    const result = await model.generateContent({
      contents: chatHistory,
    })

    const reply =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't think of a reply."

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Gemini Chat API error", error)
    return NextResponse.json(
      { error: "Something went wrong talking to Gemini." },
      { status: 500 },
    )
  }
}
