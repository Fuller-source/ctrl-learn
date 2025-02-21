interface CodeOutputProps {
  output: string | string[]
}

export default function CodeOutput({ output }: CodeOutputProps) {
  const formattedOutput = Array.isArray(output) ? output.join("\n") : output

  return (
    <div className="border rounded p-4 mt-4">
      <h2 className="text-xl font-bold mb-2">Output</h2>
      <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{formattedOutput}</pre>
    </div>
  )
}

