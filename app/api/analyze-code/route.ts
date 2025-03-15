import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    if (!code || code.trim() === "") {
      return NextResponse.json({
        feedback: "Enter some code to get feedback.",
        codeInsights: [],
      })
    }

    // Generate AI analysis of the code
    const prompt = `
      Analyze the following Python code and provide:
      1. A brief overall assessment (2-3 sentences)
      2. A detailed line-by-line explanation of what the code does
      3. Any potential issues, bugs, or improvements

      Format your response with language describing what the code does
      and include any suggestions for improvement. Be specific.
      If the code is too long, focus on the most important parts and summarize the rest.

      Here's the code:
      \`\`\`python
      ${code}
      \`\`\`
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.3,
      maxTokens: 1500,
    })

    // Parse the AI response
    try {
      const analysisData = JSON.parse(text)
      return NextResponse.json(analysisData)
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      // Fallback response if parsing fails
      return NextResponse.json({
        feedback:
          "I analyzed your code but encountered an issue formatting the response. Here's what I found:\n\n" + text,
        codeInsights: [],
      })
    }
  } catch (error) {
    console.error("Error analyzing code:", error)
    return NextResponse.json(
      {
        feedback: "An error occurred while analyzing your code.",
        codeInsights: [],
      },
      { status: 500 },
    )
  }
}


      