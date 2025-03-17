import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { code } = await req.json()

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    console.log("Executing code:", code)

    // For now, let's execute the code using the Flask backend
    const response = await fetch("http://127.0.0.1:5000/api/run-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })

    if (!response.ok) {
      throw new Error(`Flask server responded with status: ${response.status}`)
    }

    const result = await response.json()
    console.log("Execution result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error executing code:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to execute code: " + errorMessage },
      { status: 500 },
    )
  }
}

