"use client"

import { useCallback, useState } from "react"
import { useCodeMirror } from "../hooks/useCodeMirror"

interface CodeEditorProps {
  initialCode: string
  onCodeChange: (code: string) => void
  onRunCode: () => void
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

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-bold mb-2">Code Editor</h2>
      <div ref={editorRef} className="w-full h-64 border rounded mb-4" />
      <button onClick={onRunCode} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Run Code
      </button>
    </div>
  )
}
