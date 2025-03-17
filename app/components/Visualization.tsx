"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface VisualizationProps {
  data: string
  imageUrl: string | null
  isLoading?: boolean
  codeToVisualize?: string
}

export default function Visualization({ data, imageUrl, isLoading = false, codeToVisualize }: VisualizationProps) {
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null)

  // Update local state when props change
  useEffect(() => {
    setLocalImageUrl(imageUrl)
  }, [imageUrl])

  const generateVisualization = async () => {
    if (!codeToVisualize || isGenerating) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-visualization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeToVisualize }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to generate visualization: ${response.status}`)
      }

      const result = await response.json()
      if (result.imageUrl) {
        setLocalImageUrl(result.imageUrl)
      } else {
        setError("Failed to generate visualization")
      }
    } catch (err) {
      console.error("Error generating visualization:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="border rounded p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Visualization</h2>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Generating visualization...</p>
          </div>
        </div>
      ) : localImageUrl ? (
        <div className="flex flex-col items-center">
          <div className="relative w-full h-64 md:h-80 overflow-hidden rounded">
            <Image
              src={localImageUrl || "/placeholder.svg"}
              alt="Code visualization flowchart"
              fill
              className="object-contain"
            />
          </div>
          <button onClick={() => setLocalImageUrl(null)} className="mt-2 text-sm text-gray-500 hover:text-gray-700">
            Reset visualization
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded">
          {error ? (
            <div className="text-center p-4">
              <p className="text-red-500 mb-2">{error}</p>
              {codeToVisualize && (
                <button
                  onClick={generateVisualization}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  disabled={isGenerating}
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500">{data || "Enter some code to generate a visualization."}</p>
          )}
        </div>
      )}
    </div>
  )
}


