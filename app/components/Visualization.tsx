interface VisualizationProps {
  data: string
}

export default function Visualization({ data }: VisualizationProps) {
  return (
    <div className="border rounded p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">Visualization</h2>
      <p>{data}</p>
    </div>
  )
}

