"use client"

import { useEffect, useRef, useState } from "react"

interface AudioFeedbackProps {
  feedback: string
}

export default function AudioFeedback({ feedback }: AudioFeedbackProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastProcessedFeedback, setLastProcessedFeedback] = useState<string>("")

  // Generate speech when feedback changes significantly
  useEffect(() => {
    // Skip if feedback is empty or hasn't changed enough
    if (!feedback || feedback === lastProcessedFeedback) return

    // Skip if feedback is just the initial message
    if (
      feedback === "Click 'Run Code' to get feedback on your code." ||
      feedback === "Enter some code to get feedback."
    )
      return

    // Skip if feedback is a loading message
    if (feedback === "Analyzing your code...") return

    // Clear previous audio
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }

    // Set loading state
    setIsLoading(true)
    setError(null)

    // Generate new audio
    generateSpeech(feedback)
      .then(() => {
        setLastProcessedFeedback(feedback)
      })
      .catch((err) => {
        console.error("Failed to generate speech:", err)
        setError("Failed to generate audio feedback")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [feedback, lastProcessedFeedback])

  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const generateSpeech = async (text: string) => {
    try {
      // Extract the most important parts of the feedback for speech
      const processedText = processFeedbackForSpeech(text)

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: processedText }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      // Get the audio blob from the response
      const audioBlob = await response.blob()

      // Create a URL for the blob
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
    } catch (err) {
      console.error("Error generating speech:", err)
      setError("Failed to generate audio feedback")
      throw err
    }
  }

  // Process feedback to make it more suitable for speech
  const processFeedbackForSpeech = (text: string): string => {
    // Remove markdown formatting if present
    let processed = text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/```(.*?)```/gs, "Code: $1") // Replace code blocks

    // Limit length
    if (processed.length > 1000) {
      // Try to find a good breaking point
      const breakPoint = processed.lastIndexOf(".", 1000)
      processed =
        processed.substring(0, breakPoint > 0 ? breakPoint + 1 : 1000) + "... That's the summary of your code."
    }

    return processed
  }

  const handlePlay = async () => {
    setError(null)
    if (audioRef.current && audioUrl) {
      try {
        await audioRef.current.play()
      } catch (err) {
        console.error("Error playing audio:", err)
        setError("Failed to play audio. Please try again.")
      }
    }
  }

  return (
    <div className="border rounded p-4">
      <h2 className="text-xl font-bold mb-2">Audio Feedback</h2>

      {isLoading ? (
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
          <span>Generating audio feedback...</span>
        </div>
      ) : audioUrl ? (
        <div className="flex flex-col space-y-2">
          <audio ref={audioRef} src={audioUrl} />
          <div className="flex space-x-2">
            <button
              onClick={handlePlay}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
              Play Feedback
            </button>
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.pause()
                  audioRef.current.currentTime = 0
                }
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Stop
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">Audio summary of the feedback (click play to listen)</p>
        </div>
      ) : (
        <p className="text-gray-500">{error || "Run your code to get audio feedback"}</p>
      )}
    </div>
  )
}

