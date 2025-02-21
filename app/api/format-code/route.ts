import { NextResponse } from "next/server"
import prettier from "prettier/standalone"
import parserPython from "prettier/parser-python"

export async function POST(req: Request) {
  const { code } = await req.json()

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }

  try {
    const formattedCode = await prettier.format(code, {
      parser: "python",
      plugins: [parserPython],
    })
    return NextResponse.json({ formattedCode })
  } catch (error) {
    console.error("Error formatting code:", error)
    return NextResponse.json({ error: `Failed to format code: ${error.message}` }, { status: 500 })
  }
}

