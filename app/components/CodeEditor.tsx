"use client"

import { useCallback, useState } from "react"
import { useCodeMirror } from "../hooks/useCodeMirror"
import CodeOutput from "./CodeOutput"

interface CodeEditorProps {
  initialCode: string
  onCodeChange: (code: string) => void
  onRunCode: () => void
}

export default function CodeEditor({ initialCode, onCodeChange, onRunCode }: CodeEditorProps) {
  const [localCode, setLocalCode] = useState(initialCode)
  const [output, setOutput] = useState("")

  const handleChange = useCallback(
    (code: string) => {
      setLocalCode(code)
      onCodeChange(code)
    },
    [onCodeChange],
  )

  const editorRef = useCodeMirror(localCode, handleChange)

  const runCode = async () => {
    try {
      setOutput("Running code...")
      const response = await fetch("http://127.0.0.1:5000/api/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: localCode }),
        mode: "cors", // Explicitly set CORS mode
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Code execution result:", result)

      if (result.error) {
        setOutput(`Error: ${result.error}`)
      } else {
        setOutput(result.output || "No output")
      }
    } catch (error) {
      console.error("Error running code:", error)
      if (error instanceof Error) {
        setOutput(`Error running code: ${error.message}`)
      } else {
        setOutput("Error running code")
      }
    }
  }

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-bold mb-2">Code Editor</h2>
      <div ref={editorRef} className="w-full h-64 border rounded mb-4" />
      <button onClick={runCode} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Run Code
      </button>
      <CodeOutput output={output} />
    </div>
  )
}

