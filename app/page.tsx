"use client"

import { useState, useCallback } from "react"
import Header from "./components/Header"
import CodeEditor from "./components/CodeEditor"
import Feedback from "./components/Feedback"
import Visualization from "./components/Visualization"
import AudioFeedback from "./components/AudioFeedback"
import CodeOutput from "./components/CodeOutput"

export default function CtrlLearn() {
  const [code, setCode] = useState("")
  const [feedback, setFeedback] = useState("")
  const [visualization, setVisualization] = useState<string>("")
  const [output, setOutput] = useState<string | string[]>("")

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)
  }, [])

  const handleRunCode = useCallback(async () => {
    try {
      setOutput("Running code...")

      // Execute code
      const executeResponse = await fetch("/api/execute-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
      const executeData = await executeResponse.json()
      if (executeData.output) {
        setOutput(executeData.output)
      } else if (executeData.error) {
        setOutput(`Error: ${executeData.error}`)
      } else {
        setOutput("No output or an error occurred.")
      }

      // Get feedback and visualization
      const analyzeResponse = await fetch("/api/analyze-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
      const analyzeData = await analyzeResponse.json()
      setFeedback(analyzeData.feedback || "No feedback available.")
      setVisualization(analyzeData.visualization || "No visualization available.")
    } catch (error) {
      console.error("Error running code:", error)
      setOutput("An error occurred while running the code.")
      setFeedback("Unable to provide feedback due to an error.")
      setVisualization("Unable to provide visualization due to an error.")
    }
  }, [code])

  // This function will be passed to the CodeEditor to handle direct output updates
  const handleDirectOutput = useCallback((result: string) => {
    setOutput(result)
  }, [])

  return (
    <div className="container mx-auto px-4">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <CodeEditor initialCode={code} onCodeChange={handleCodeChange} onRunCode={handleDirectOutput} />
          <CodeOutput output={typeof output === "string" ? output : output.join("\n")} />
        </div>
        <div>
          <Feedback feedback={feedback} />
          <Visualization data={visualization} />
          <AudioFeedback feedback={feedback} />
        </div>
      </div>
    </div>
  )
}


