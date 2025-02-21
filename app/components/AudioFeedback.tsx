"use client"

import { useEffect, useRef, useState } from "react"

interface AudioFeedbackProps {
  feedback: string
}

export default function AudioFeedback({ feedback }: AudioFeedbackProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (feedback) {
      // Here we would normally call a text-to-speech API
      // For now, we'll use a dummy audio file
      setAudioUrl("/path/to/audio/file.mp3")
    }
  }, [feedback])

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
      {audioUrl ? (
        <>
          <audio ref={audioRef} src={audioUrl} />
          <button onClick={handlePlay} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Play Feedback
          </button>
        </>
      ) : (
        <p>No audio feedback available</p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}

