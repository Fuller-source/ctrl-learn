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

    // Use a mock response if OpenAI API is unavailable due to quota issues
    if (process.env.USE_MOCK_ANALYSIS === "true") {
      return NextResponse.json(generateMockAnalysis(code))
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
      const formattedText = formatNumberedPoints(text)

      return NextResponse.json({
        feedback: formattedText,
        codeInsights: [],
      })
    } catch (apiError) {
      console.error("Error calling OpenAI API:", apiError)
      // If API call fails due to quota, use mock analysis
      return NextResponse.json(generateMockAnalysis(code))
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

// Function to format numbered points with proper line breaks
function formatNumberedPoints(text) {
  // Replace numbered points with proper formatting
  // This regex looks for numbers followed by a period and space
  return text.replace(/(\d+)\.\s+/g, "\n\n$1. ").trim()
}

// Function to generate mock analysis when OpenAI API is unavailable
function generateMockAnalysis(code) {
  const lines = code.split("\n")
  let feedback = ""

  // Basic analysis based on code content
  if (code.includes("print(")) {
    feedback += "1. This code uses the print function to output text to the console.\n\n"
  } else {
    feedback += "1. This code appears to be a Python script.\n\n"
  }

  // Check for potential syntax errors
  let hasSyntaxError = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.includes("print") && !line.includes("(")) {
      feedback += `2. There might be a syntax error on line ${i + 1}. The print statement requires parentheses in Python 3.\n\n`
      hasSyntaxError = true
      break
    }
    if (line.includes("if") && !line.includes(":")) {
      feedback += `2. There might be a syntax error on line ${i + 1}. If statements require a colon at the end.\n\n`
      hasSyntaxError = true
      break
    }
  }

  if (!hasSyntaxError) {
    feedback += "2. No obvious syntax errors were detected in the code.\n\n"
  }

  // Suggestions for improvement
  if (!code.includes("#")) {
    feedback += "3. Consider adding comments to explain the purpose of your code for better readability."
  } else if (code.length > 200) {
    feedback +=
      "3. For longer scripts, consider breaking down the code into functions for better organization and reusability."
  } else {
    feedback += "3. The code appears to be simple and straightforward. No specific improvements needed."
  }

  return {
    feedback,
    codeInsights: [],
  }
}


      