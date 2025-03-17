"use client"

import { useState, useCallback, useEffect } from "react"
import Header from "./components/Header"
import CodeEditor from "./components/CodeEditor"
import Feedback from "./components/Feedback"
import Visualization from "./components/Visualization"
import AudioFeedback from "./components/AudioFeedback"
import CodeOutput from "./components/CodeOutput"
import { debounce } from "./utils/debounce"

export default function CtrlLearn() {
  const [code, setCode] = useState("")
  const [feedback, setFeedback] = useState("Enter some code to get feedback.")
  const [codeInsights, setCodeInsights] = useState([])
  const [visualization, setVisualization] = useState<string>("")
  const [output, setOutput] = useState<string | string[]>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isVisualizing, setIsVisualizing] = useState(false)
  const [visualizationUrl, setVisualizationUrl] = useState<string | null>(null)

  const analyzeCode = useCallback(async (codeToAnalyze: string) => {
    if (!codeToAnalyze || codeToAnalyze.trim() === "") {
      setFeedback("Enter some code to get feedback.")
      setCodeInsights([])
      return
    }

    setIsAnalyzing(true)
    try {
      const analyzeResponse = await fetch("/api/analyze-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeToAnalyze }),
      })

      const analyzeData = await analyzeResponse.json()
      setFeedback(analyzeData.feedback || "No feedback available.")
      setCodeInsights(analyzeData.codeInsights || [])
    } catch (error) {
      console.error("Error analyzing code:", error)
      setFeedback("Unable to provide feedback due to an error.")
      setCodeInsights([])
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  // Function to generate visualization
  const generateVisualization = useCallback(async (codeToVisualize: string) => {
    if (!codeToVisualize || codeToVisualize.trim() === "") {
      setVisualization("Enter some code to visualize.")
      setVisualizationUrl(null)
      return
    }

    setIsVisualizing(true)
    try {
      const visualizeResponse = await fetch("/api/generate-visualization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeToVisualize }),
      })

      const visualizeData = await visualizeResponse.json()

      if (visualizeData.imageUrl) {
        setVisualizationUrl(visualizeData.imageUrl)
        setVisualization("Visualization generated successfully.")
      } else if (visualizeData.error) {
        setVisualization(`Error: ${visualizeData.error}`)
        setVisualizationUrl(null)
      } else {
        setVisualization("No visualization available.")
        setVisualizationUrl(null)
      }
    } catch (error) {
      console.error("Error generating visualization:", error)
      setVisualization("Unable to generate visualization due to an error.")
      setVisualizationUrl(null)
    } finally {
      setIsVisualizing(false)
    }
  }, [])

  // Create debounced versions of analyzeCode and generateVisualization
  const debouncedAnalyzeCode = useCallback(
    debounce((code: string) => analyzeCode(code), 1000),
    [analyzeCode],
  )

  const debouncedGenerateVisualization = useCallback(
    debounce((code: string) => generateVisualization(code), 1000),
    [generateVisualization],
  )

  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode)
      debouncedAnalyzeCode(newCode)
      debouncedGenerateVisualization(newCode)
    },
    [debouncedAnalyzeCode, debouncedGenerateVisualization],
  )

  const handleRunCode = useCallback(async () => {
    try {
      setOutput("Running code...")

      // Execute code using Flask backend
      try {
        const response = await fetch("http://127.0.0.1:5000/api/run-code", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
          mode: "cors",
        })

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        const result = await response.json()
        console.log("Code execution result:", result)

        if (result.error) {
          setOutput(`Error: ${result.error}`)
        } else {
          setOutput(result.output || "No output")
        }
      } catch (error) {
        console.error("Error executing code:", error)
        setOutput(`Error running code: ${error instanceof Error ? error.message : "Unknown error"}`)
      }

      // Force a fresh analysis when code is run
      analyzeCode(code)
      generateVisualization(code)
    } catch (error) {
      console.error("Error running code:", error)
      setOutput("An error occurred while running the code.")
    }
  }, [code, analyzeCode, generateVisualization])

  // Initial analysis when component mounts
  useEffect(() => {
    if (code) {
      analyzeCode(code)
      generateVisualization(code)
    }
  }, [])

  // This function will be passed to the CodeEditor to handle direct output updates
  const handleDirectOutput = useCallback((result: string) => {
    setOutput(result)
  }, [])

  return (
    <div className="container mx-auto px-4">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <CodeEditor initialCode={code} onCodeChange={handleCodeChange} onRunCode={handleRunCode} />
          <CodeOutput output={typeof output === "string" ? output : output.join("\n")} />
        </div>
        <div>
          <Feedback feedback={feedback} codeInsights={codeInsights} isLoading={isAnalyzing} />
          <Visualization data={visualization} imageUrl={visualizationUrl} isLoading={isVisualizing} />
          <AudioFeedback feedback={feedback} />
        </div>
      </div>
    </div>
  )
}
