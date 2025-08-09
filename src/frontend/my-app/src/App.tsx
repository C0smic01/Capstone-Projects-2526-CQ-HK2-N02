import './index.css'
import React, { useState, useRef } from 'react';
import { Upload, Code, CheckCircle, XCircle, Brain, FileText, Zap } from 'lucide-react';

// Import theme configuration
import { themes, getThemeColors } from './assets/theme';

// ===== THEME CONFIGURATION =====
// Thay đổi theme ở đây - chỉ cần đổi tên theme
const SELECTED_THEME = 'blue'; // emerald, blue, purple, rose, orange, red, yellow, teal, sky, slate

// Get theme configuration
const theme = themes[SELECTED_THEME];
const themeColors = getThemeColors(SELECTED_THEME);

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

  const mockCompilation = async (code: string): Promise<{ success: boolean; errors?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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

  const analyzeCode = async () => {
    if (!file || !fileContent || !problemDescription.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result: AnalysisResult = {
        problemUnderstanding: `Hiểu bài toán: "${problemDescription.trim()}"`,
        codeAnalysis: `Đã đọc file: ${file.name} (${fileContent.length} ký tự)`,
        compilationStatus: 'pending'
      };
      setAnalysisResult({ ...result });

      const compilationResult = await mockCompilation(fileContent);
      result.compilationStatus = compilationResult.success ? 'success' : 'error';
      if (!compilationResult.success) {
        result.compilationErrors = compilationResult.errors;
      }
      setAnalysisResult({ ...result });

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
    <div className={`min-h-screen ${themeColors.classes.bgGradient} text-white`}>
      {/* Header */}
      <div className={`bg-black/20 backdrop-blur-sm border-b ${themeColors.classes.border}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${themeColors.classes.button} rounded-lg`}>
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r from-${theme.primary}-400 to-${theme.secondary}-400 bg-clip-text text-transparent`}>
                C++ Code Analyzer
              </h1>
              <p className={`${themeColors.classes.text}/70 text-sm`}>AI Agent với Langchain - {theme.icon} {theme.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-1 gap-8">

            {!analysisResult && (
              <div className={`bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-${theme.primary}-500/10 text-center`}>
                <Brain className={`w-16 h-16 mx-auto mb-4 text-${theme.primary}-400/50`} />
                <p className={`text-${theme.primary}-300/60`}>
                  Tải lên file C++ và nhập mô tả bài toán để bắt đầu phân tích
                </p>
              </div>
            )}

          {/* Input Section */}
          <div className="space-y-6">
            <div className={`bg-black/30 backdrop-blur-sm rounded-2xl p-6 border ${themeColors.classes.border}`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <FileText className={themeColors.classes.icon} />
                <span>Mô tả bài toán</span>
              </h2>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Nhập mô tả đề bài tập cần giải..."
                className={`w-full h-32 bg-slate-800/50 border border-${theme.primary}-500/30 rounded-xl px-4 py-3 text-white placeholder-${theme.primary}-300/50 focus:outline-none focus:border-${theme.primary}-400 focus:ring-2 focus:ring-${theme.primary}-400/20 transition-all`}
              />
            </div>

            <div className={`bg-black/30 backdrop-blur-sm rounded-2xl p-6 border ${themeColors.classes.border}`}>
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Upload className={themeColors.classes.icon} />
                <span>Upload file C++</span>
              </h2>
              
              <div 
                className={`border-2 border-dashed border-${theme.primary}-500/30 rounded-xl p-8 text-center hover:border-${theme.primary}-400/50 transition-all cursor-pointer`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${themeColors.classes.icon}`} />
                <p className={themeColors.classes.text}>
                  {file ? file.name : 'Chọn file .cpp để phân tích'}
                </p>
                <p className={`text-${theme.primary}-400/60 text-sm mt-2`}>
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
                  <h3 className={`text-sm font-medium ${themeColors.classes.text} mb-2`}>Preview:</h3>
                  <div className="bg-slate-800/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <pre className={`text-xs text-${theme.primary}-100 whitespace-pre-wrap`}>
                      {fileContent.substring(0, 500)}
                      {fileContent.length > 500 && '...'}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={analyzeCode}
              // disabled={!file || !problemDescription.trim() || isAnalyzing}
              className={`w-full ${themeColors.classes.button} ${themeColors.classes.buttonHover} disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 transform hover:scale-[1.02] disabled:hover:scale-100`}
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
                <div className={`bg-black/30 backdrop-blur-sm rounded-2xl p-6 border ${
                  analysisResult.compilationStatus === 'success' ? 'border-green-500/20' : 
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
                  <div className={`bg-black/30 backdrop-blur-sm rounded-2xl p-6 border ${themeColors.classes.border}`}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                      <Brain className={themeColors.classes.icon} />
                      <span>Nhận xét từ AI</span>
                    </h3>
                    <div className={`${themeColors.classes.accent} whitespace-pre-wrap`}>
                      {analysisResult.llmReview}
                    </div>
                  </div>
                )}
              </>
            )}

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default CppAnalyzerApp;