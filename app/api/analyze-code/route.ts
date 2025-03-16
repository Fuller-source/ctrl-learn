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

    const prompt = `
    Analyze the following Python code and provide:
    1. A short summary of what the code does (2-3 sentences).
    2. If there are any syntax errors, specify where they occur and describe them briefly.
    3. Suggest any improvements if applicable. Be concise.
    
    Avoid using overly formatted headings or unnecessary detail. Focus on a clear and readable explanation.
    
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
          text, // THIS IS THE FALLBACK RESPONSE
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


      