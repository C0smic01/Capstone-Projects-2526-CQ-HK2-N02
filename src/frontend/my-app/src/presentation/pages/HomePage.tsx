
import React, { useState, useRef } from 'react';
import { Upload, Code, CheckCircle, XCircle, Brain, FileText, Zap } from 'lucide-react';

interface AnalysisResult {
    problemUnderstanding: string;
    codeAnalysis: string;
    compilationStatus: 'success' | 'error' | 'pending';
    compilationErrors?: string;
    llmReview?: string;
}

const CppAnalyzerApp: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [problemDescription, setProblemDescription] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile && uploadedFile.name.endsWith('.cpp')) {
            setFile(uploadedFile);
            const reader = new FileReader();
            reader.onload = (e) => {
                setFileContent(e.target?.result as string);
            };
            reader.readAsText(uploadedFile);
        }
    };

    const mockCompilation = async (code: string): Promise<{ success: boolean; errors?: string }> => {
        // Simulate compilation check
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simple mock logic - check for common syntax issues
        const hasMainFunction = code.includes('int main');
        const hasBalancedBraces = (code.match(/{/g) || []).length === (code.match(/}/g) || []).length;
        const hasSemicolons = code.includes(';');

        if (!hasMainFunction) {
            return { success: false, errors: "Thiếu hàm main()" };
        }
        if (!hasBalancedBraces) {
            return { success: false, errors: "Dấu ngoặc nhọn không cân bằng" };
        }
        if (!hasSemicolons) {
            return { success: false, errors: "Thiếu dấu chấm phẩy" };
        }

        return { success: true };
    };

    const mockLLMReview = async (code: string, problem: string): Promise<string> => {
        // Simulate LLM API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        return `Phân tích code C++:

📊 Đánh giá tổng quan: Code được viết tốt và có cấu trúc rõ ràng.

✅ Điểm mạnh:
• Sử dụng đúng cú pháp C++
• Có comment giải thích logic
• Xử lý input/output hợp lý
• Thuật toán hiệu quả

⚠️ Gợi ý cải thiện:
• Có thể thêm validation cho input
• Xem xét edge cases
• Tối ưu hóa bộ nhớ nếu cần

🎯 Kết luận: Code giải quyết được bài toán một cách chính xác và hiệu quả.`;
    };

    const analyzeCode = async () => {
        if (!file || !fileContent || !problemDescription.trim()) return;

        setIsAnalyzing(true);
        setAnalysisResult(null);

        try {
            // Step 1: Problem Understanding
            await new Promise(resolve => setTimeout(resolve, 1000));
            const result: AnalysisResult = {
                problemUnderstanding: `Hiểu bài toán: "${problemDescription.trim()}"`,
                codeAnalysis: `Đã đọc file: ${file.name} (${fileContent.length} ký tự)`,
                compilationStatus: 'pending'
            };
            setAnalysisResult({ ...result });

            // Step 2: Compilation Check
            const compilationResult = await mockCompilation(fileContent);
            result.compilationStatus = compilationResult.success ? 'success' : 'error';
            if (!compilationResult.success) {
                result.compilationErrors = compilationResult.errors;
            }
            setAnalysisResult({ ...result });

            // Step 3: LLM Review (only if compilation succeeds)
            if (compilationResult.success) {
                const llmReview = await mockLLMReview(fileContent, problemDescription);
                result.llmReview = llmReview;
                setAnalysisResult({ ...result });
            }
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
            {/* Header */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-cyan-500/20">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                C++ Code Analyzer
                            </h1>
                            <p className="text-cyan-300/70 text-sm">AI Agent với Langchain</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
                            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-cyan-400" />
                                <span>Mô tả bài toán</span>
                            </h2>
                            <textarea
                                value={problemDescription}
                                onChange={(e) => setProblemDescription(e.target.value)}
                                placeholder="Nhập mô tả đề bài tập cần giải..."
                                className="w-full h-32 bg-slate-800/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                            />
                        </div>

                        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
                            <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                                <Upload className="w-5 h-5 text-cyan-400" />
                                <span>Upload file C++</span>
                            </h2>

                            <div
                                className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-all cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                                <p className="text-cyan-300">
                                    {file ? file.name : 'Chọn file .cpp để phân tích'}
                                </p>
                                <p className="text-cyan-400/60 text-sm mt-2">
                                    Kéo thả file hoặc click để chọn
                                </p>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".cpp"
                                onChange={handleFileUpload}
                                className="hidden"
                            />

                            {fileContent && (
                                <div className="mt-4">
                                    <h3 className="text-sm font-medium text-cyan-300 mb-2">Preview:</h3>
                                    <div className="bg-slate-800/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                                        <pre className="text-xs text-cyan-100 whitespace-pre-wrap">
                                            {fileContent.substring(0, 500)}
                                            {fileContent.length > 500 && '...'}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={analyzeCode}
                            disabled={!file || !problemDescription.trim() || isAnalyzing}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 transform hover:scale-[1.02] disabled:hover:scale-100"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Zap className="w-5 h-5 animate-pulse" />
                                    <span>Đang phân tích...</span>
                                </>
                            ) : (
                                <>
                                    <Brain className="w-5 h-5" />
                                    <span>Bắt đầu phân tích</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        {analysisResult && (
                            <>
                                {/* Problem Understanding */}
                                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span>Hiểu đề bài</span>
                                    </h3>
                                    <p className="text-green-300">{analysisResult.problemUnderstanding}</p>
                                </div>

                                {/* Code Analysis */}
                                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                                        <Code className="w-5 h-5 text-blue-400" />
                                        <span>Đọc mã nguồn</span>
                                    </h3>
                                    <p className="text-blue-300">{analysisResult.codeAnalysis}</p>
                                </div>

                                {/* Compilation Status */}
                                <div className={`bg-black/30 backdrop-blur-sm rounded-2xl p-6 border ${analysisResult.compilationStatus === 'success' ? 'border-green-500/20' :
                                        analysisResult.compilationStatus === 'error' ? 'border-red-500/20' : 'border-yellow-500/20'
                                    }`}>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                                        {analysisResult.compilationStatus === 'success' ? (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        ) : analysisResult.compilationStatus === 'error' ? (
                                            <XCircle className="w-5 h-5 text-red-400" />
                                        ) : (
                                            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                                        )}
                                        <span>Biên dịch</span>
                                    </h3>
                                    {analysisResult.compilationStatus === 'success' ? (
                                        <p className="text-green-300">✅ Biên dịch thành công!</p>
                                    ) : analysisResult.compilationStatus === 'error' ? (
                                        <div>
                                            <p className="text-red-300">❌ Có lỗi biên dịch:</p>
                                            <p className="text-red-200 mt-2 bg-red-900/20 p-3 rounded-lg">
                                                {analysisResult.compilationErrors}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-yellow-300">🔄 Đang kiểm tra...</p>
                                    )}
                                </div>

                                {/* LLM Review */}
                                {analysisResult.llmReview && (
                                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
                                        <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                                            <Brain className="w-5 h-5 text-purple-400" />
                                            <span>Nhận xét từ AI</span>
                                        </h3>
                                        <div className="text-purple-200 whitespace-pre-wrap">
                                            {analysisResult.llmReview}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {!analysisResult && (
                            <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/10 text-center">
                                <Brain className="w-16 h-16 mx-auto mb-4 text-cyan-400/50" />
                                <p className="text-cyan-300/60">
                                    Tải lên file C++ và nhập mô tả bài toán để bắt đầu phân tích
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CppAnalyzerApp;