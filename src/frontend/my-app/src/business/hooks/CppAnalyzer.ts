import { useState } from "react";
import { callAnalysisAPI } from "../services/AnalyzeService";
import APIError from "../models/APIError";

interface AnalysisResult {
    compilationStatus: 'success' | 'error' | 'pending';
    compilationErrors?: string;
    llmReview?: string;
}

export const useCppAnalyzer = () => {
    const [solutionFile, setSolutionFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState('');
    const [problemDescription, setProblemDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile && uploadedFile.name.endsWith('.cpp')) {
            setSolutionFile(uploadedFile);
            setError(null);
            const reader = new FileReader();
            reader.onload = (e) => setFileContent(e.target?.result as string);
            reader.readAsText(uploadedFile);
        } else if (uploadedFile) {
            setError('Vui lòng chọn file .cpp');
        }
    };

    const problemTextToFile = (text: string): File => {
        const blob = new Blob([text], { type: 'text/plain' });
        return new File([blob], 'problem.txt', { type: 'text/plain' });
    };

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const analyzeCode = async () => {
        if (!solutionFile || !fileContent || !problemDescription.trim()) {
            setError('Vui lòng nhập đầy đủ mô tả và chọn file C++');
            return;
        }

        setIsAnalyzing(true);
        setAnalysisResult(null);
        setError(null);

        try {
            const problemFile = problemTextToFile(problemDescription);
            await sleep(300);
            const apiResponse = await callAnalysisAPI(solutionFile, problemFile);

            setAnalysisResult({
                compilationStatus: apiResponse.status === 'success' ? 'success' : 'error',
                compilationErrors: apiResponse.data?.compile_output || '',
                llmReview: apiResponse.data?.llm_feedback || '',
            });
        } catch (err) {
            setError(err instanceof APIError ? err.message : 'Lỗi không xác định');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return {
        file: solutionFile,
        fileContent,
        problemDescription,
        setProblemDescription,
        handleFileUpload,
        analyzeCode,
        isAnalyzing,
        analysisResult,
        error
    };
};
