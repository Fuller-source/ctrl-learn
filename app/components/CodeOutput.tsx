import React from 'react';

interface CodeOutputProps {
  output: string;
}

const CodeOutput: React.FC<CodeOutputProps> = ({ output }) => {
  return (
    <div className="border rounded p-4 mt-4">
      <h2 className="text-xl font-bold mb-2">Output</h2>
      <pre className="whitespace-pre-wrap">{output}</pre>
    </div>
  );
};

export default CodeOutput;

