import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Helper function to parse Python code and create a description for DALL-E
function parseCodeForVisualization(code: string): string {
  // Remove comments and empty lines
  const cleanedCode = code
    .split("\n")
    .filter((line) => !line.trim().startsWith("#") && line.trim() !== "")
    .join("\n")

  // Identify key elements
  const hasLoops = cleanedCode.includes("for ") || cleanedCode.includes("while ")
  const hasConditionals = cleanedCode.includes("if ") || cleanedCode.includes("else:")
  const hasFunctions = cleanedCode.includes("def ")
  const hasClasses = cleanedCode.includes("class ")

  // Create a description for DALL-E
  let description = "Create a professional, clear flowchart diagram showing the execution flow of this Python code:\n\n"
  description += cleanedCode

  description += "\n\nThe flowchart should:"
  description += "\n- Use standard flowchart symbols (rectangles for processes, diamonds for decisions, etc.)"
  description += "\n- Show the logical flow with directional arrows"

  if (hasLoops) {
    description += "\n- Clearly illustrate loop structures with iteration paths"
  }

  if (hasConditionals) {
    description += "\n- Show branching paths for conditional statements"
  }

  if (hasFunctions) {
    description += "\n- Represent function calls and returns"
  }

  if (hasClasses) {
    description += "\n- Indicate class structures and methods"
  }

  description +=
    "\n\nUse a clean, minimalist design with a black background, white text, and red arrows. Include variable values where relevant."

  return description
}

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    if (!code || code.trim() === "") {
      return NextResponse.json(
        {
          error: "No code provided for visualization",
        },
        { status: 400 },
      )
    }

    // Check if the code is too short or simple
    if (code.trim().length < 10) {
      return NextResponse.json(
        {
          error: "Code is too short for meaningful visualization",
        },
        { status: 400 },
      )
    }

    // Parse code and create prompt for DALL-E
    const prompt = parseCodeForVisualization(code)

    // Generate image with DALL-E
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      })

      const imageUrl = response.data[0]?.url

      if (!imageUrl) {
        throw new Error("Failed to generate image")
      }

      return NextResponse.json({
        imageUrl,
        message: "Visualization generated successfully",
      })
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)

      // Check if it's an API key issue
      if (openaiError instanceof Error && openaiError.message.includes("API key")) {
        return NextResponse.json(
          {
            error: "OpenAI API key issue. Please check your API key configuration.",
          },
          { status: 500 },
        )
      }

      return NextResponse.json(
        {
          error: "Failed to generate visualization with DALL-E",
          details: openaiError instanceof Error ? openaiError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error generating visualization:", error)
    return NextResponse.json(
      {
        error: "Failed to generate visualization",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
