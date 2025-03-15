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

  const isInitialState = feedback === "Click 'Run Code' to get feedback on your code." && codeInsights.length === 0

  return (
    <div className="border rounded p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Feedback</h2>

      {isLoading ? (
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <span>Analyzing your code...</span>
        </div>
      ) : isInitialState ? (
        <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
          <svg
            className="w-12 h-12 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <p className="text-lg font-medium">Get AI Feedback on Your Code</p>
          <p className="mt-2">
            Write some code and click "Run Code & Analyze" to receive detailed feedback and code tracing.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 prose prose-sm max-w-none">{feedback}</div>

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
