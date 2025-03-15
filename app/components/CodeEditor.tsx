"use client"

import { useCallback, useState } from "react"
import { useCodeMirror } from "../hooks/useCodeMirror"
import CodeOutput from "./CodeOutput"

interface CodeEditorProps {
  initialCode: string
  onCodeChange: (code: string) => void
  onRunCode: (output: string) => void
}

export default function CodeEditor({ initialCode, onCodeChange, onRunCode }: CodeEditorProps) {
  const [localCode, setLocalCode] = useState(initialCode)

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
      onRunCode("Running code...")

      // You can either use the Flask backend directly:
      const response = await fetch("http://127.0.0.1:5000/api/run-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: localCode }),
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Code execution result:", result)

      if (result.error) {
        onRunCode(`Error: ${result.error}`)
      } else {
        onRunCode(result.output || "No output")
      }

      /* Or you can use your existing API endpoint:
      const executeResponse = await fetch("/api/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: localCode }),
      });
      
      const executeData = await executeResponse.json();
      if (executeData.output) {
        onRunCode(executeData.output);
      } else if (executeData.error) {
        onRunCode(`Error: ${executeData.error}`);
      } else {
        onRunCode("No output or an error occurred.");
      }
      */
    } catch (error) {
      console.error("Error running code:", error)
      if (error instanceof Error) {
        onRunCode(`Error running code: ${error.message}`)
      } else {
        onRunCode("Error running code")
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
    </div>
  )
}

