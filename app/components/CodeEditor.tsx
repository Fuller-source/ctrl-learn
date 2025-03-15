"use client"

import { useCallback, useState } from "react"
import { useCodeMirror } from "./../hooks/useCodeMirror"

interface CodeEditorProps {
  initialCode: string
  onCodeChange: (code: string) => void
  onRunCode: (output: string) => void
}

export default function CodeEditor({ initialCode, onCodeChange, onRunCode }: CodeEditorProps) {
  const [localCode, setLocalCode] = useState(initialCode)
  const [isRunning, setIsRunning] = useState(false)

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
      setIsRunning(true)
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
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-bold mb-2">Code Editor</h2>
      <div ref={editorRef} className="w-full h-64 border rounded mb-4" />
      <button
        onClick={runCode}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        disabled={isRunning}
      >
        {isRunning ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Running...
          </>
        ) : (
          <>Run Code & Analyze</>
        )}
      </button>
      <p className="text-xs text-gray-500 mt-2">Click "Run Code & Analyze" to execute your code and get AI feedback.</p>
    </div>
  )
}

