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
    
    Format your response with each numbered point on a separate line, with a blank line between points.
    Avoid using overly formatted headings or unnecessary detail. Focus on a clear and readable explanation.
    
    Here's the code:
    \`\`\`python
    ${code}
    \`\`\`
    `

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: prompt,
        temperature: 0.3,
        maxTokens: 1500,
      })

      // Format the response to ensure numbered points are on separate lines
      const formattedText = text.replace(/(\d+)\.\s+/g, "\n\n$1. ").trim()

      return NextResponse.json({
        feedback: formattedText,
        codeInsights: [],
      })
    } catch (apiError) {
      console.error("Error calling OpenAI API:", apiError)
      return NextResponse.json(
        {
          feedback: "Unable to analyze code due to an API error. Please try again later.",
          codeInsights: [],
        },
        { status: 500 },
      )
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

      