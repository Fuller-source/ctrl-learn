interface FeedbackProps {
  feedback: string
}

export default function Feedback({ feedback }: FeedbackProps) {
  return (
    <div className="border rounded p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Feedback</h2>
      <p>{feedback}</p>
    </div>
  )
}
