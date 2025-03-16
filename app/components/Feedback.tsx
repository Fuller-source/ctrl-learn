"use client"

import { useState } from "react"

interface CodeInsight {
  line: number
  code: string
  explanation: string
  type: "info" | "warning" | "error" | "tip"
}

interface FeedbackProps {
  feedback: string
  codeInsights?: CodeInsight[]
  isLoading?: boolean
}

export default function Feedback({ feedback, codeInsights = [], isLoading = false }: FeedbackProps) {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null)

  const toggleInsight = (index: number) => {
    setExpandedInsight(expandedInsight === index ? null : index)
  }

  // Format feedback to preserve line breaks
  const formattedFeedback = feedback.split("\n").map((line, index) => (
    <p key={index} className={line.trim() === "" ? "my-2" : "my-1"}>
      {line}
    </p>
  ))

  return (
    <div className="border rounded p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Feedback</h2>

      {isLoading ? (
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <span>Analyzing your code...</span>
        </div>
      ) : (
        <>
          <div className="mb-4 prose prose-sm max-w-none">{formattedFeedback}</div>

          {codeInsights.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Code Trace</h3>
              <div className="space-y-2">
                {codeInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`border rounded-md overflow-hidden ${
                      insight.type === "error"
                        ? "border-red-300 bg-red-50"
                        : insight.type === "warning"
                          ? "border-yellow-300 bg-yellow-50"
                          : insight.type === "tip"
                            ? "border-green-300 bg-green-50"
                            : "border-blue-300 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center p-2 cursor-pointer" onClick={() => toggleInsight(index)}>
                      <div className="w-8 text-center text-xs text-gray-500">{insight.line}</div>
                      <div className="flex-1 font-mono text-sm truncate">{insight.code}</div>
                      <div className="ml-2">
                        <svg
                          className={`h-4 w-4 transition-transform ${expandedInsight === index ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {expandedInsight === index && (
                      <div className="p-3 border-t bg-white">
                        <p className="text-sm">{insight.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}