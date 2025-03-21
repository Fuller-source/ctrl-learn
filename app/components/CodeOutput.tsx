import type React from "react"

interface CodeOutputProps {
  output: string
}

const CodeOutput: React.FC<CodeOutputProps> = ({ output }) => {
  return (
    <div className="border rounded p-4 mt-4">
      <h2 className="text-xl font-bold mb-2">Output</h2>
      <div className="relative w-full">
        <pre
          className="whitespace-pre-wrap bg-gray-900 text-gray-100 p-4 rounded overflow-auto resize-y min-h-[100px] max-h-[300px] font-mono"
          style={{
            overflowWrap: "break-word",
            wordWrap: "break-word",
          }}
        >
          {output || "No output yet. Run your code to see results."}
        </pre>
      </div>
    </div>
  )
}

export default CodeOutput
