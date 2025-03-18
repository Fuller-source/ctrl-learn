import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text || text.trim() === "") {
      return NextResponse.json(
        {
          error: "No text provided for speech synthesis",
        },
        { status: 400 },
      )
    }

    // Limit text length to avoid excessive API usage
    const limitedText = text.length > 4000 ? text.substring(0, 4000) + "..." : text

    try {
      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: limitedText,
      })

      // Convert the response to an ArrayBuffer
      const buffer = await mp3.arrayBuffer()

      // Create a Response with the audio data
      const response = new Response(buffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=3600",
        },
      })

      return response
    } catch (openaiError) {
      console.error("OpenAI TTS API error:", openaiError)

      return NextResponse.json(
        {
          error: "Failed to generate speech with OpenAI TTS",
          details: openaiError instanceof Error ? openaiError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error generating speech:", error)
    return NextResponse.json(
      {
        error: "Failed to generate speech",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

