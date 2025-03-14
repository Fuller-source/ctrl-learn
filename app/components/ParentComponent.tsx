import React, { useState } from 'react';
import axios from "axios";
import CodeEditor from './CodeEditor';
import CodeOutput from './CodeOutput';

interface RunCodeResponse {
    output: string;
}

const ParentComponent = () => {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    };

    const handleRunCode = async () => {
        try {
            const response = await axios.post<RunCodeResponse>('http://localhost:3000/api/run-code', { code });
            setOutput(response.data.output);
        } catch (error) {
            console.error("Error running code:", error);
            setOutput("Error running code");
        }
    };

    return (
        <div>
            <CodeEditor initialCode={code} onCodeChange={handleCodeChange} onRunCode={handleRunCode} />
            <CodeOutput output={output} />
        </div>
    );
};

export default ParentComponent;