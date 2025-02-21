import { NextResponse } from "next/server"
import { PythonShell } from "python-shell"

export async function POST(req: Request) {
  const { code } = await req.json()

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }

  try {
    const result = await new Promise<string[]>((resolve, reject) => {
      PythonShell.runString(code, null, (err, results) => {
        if (err) reject(err)
        resolve(results || [])
      })
    })

    return NextResponse.json({ output: result })
  } catch (error) {
    console.error("Error executing code:", error)
    return NextResponse.json({ error: "Failed to execute code" }, { status: 500 })
  }
}

