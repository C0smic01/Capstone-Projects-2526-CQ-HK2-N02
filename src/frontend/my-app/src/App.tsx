import './index.css'
import { Code, CheckCircle, Brain } from 'lucide-react';
import { Header } from './presentation/components/Header';
import { InputSection } from './presentation/components/InputSection';
import CompilationStatusCard from './presentation/components/CompilationCard';
import LLMReviewCard from './presentation/components/LLMReviewCard';
import { useCppAnalyzer } from './business/hooks/CppAnalyzer';

// Import theme configuration
import { themes, getThemeColors } from './assets/theme';

// ===== THEME CONFIGURATION =====
// Thay đổi theme ở đây - chỉ cần đổi tên theme
const SELECTED_THEME = 'blue'; // emerald, blue, purple, rose, orange, red, yellow, teal, sky, slate

// Get theme configuration
const theme = themes[SELECTED_THEME];
const themeColors = getThemeColors(SELECTED_THEME);


const CppAnalyzerApp: React.FC = () => {

   const {
    file, fileContent, problemDescription, setProblemDescription,
    handleFileUpload, analyzeCode, isAnalyzing, analysisResult, error
  } = useCppAnalyzer();

  return (
    <div className={`min-h-screen ${themeColors.classes.bgGradient} text-white`}>

      {/* Header */}
      <Header theme={theme} themeColors={themeColors} />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-1 gap-8">

          {/* Banner */}
          {!analysisResult && (
            <div className={`bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-${theme.primary}-500/10 text-center`}>
              <Brain className={`w-16 h-16 mx-auto mb-4 text-${theme.primary}-400/50`} />
              <p className={`text-${theme.primary}-300/60`}>
                Tải lên file C++ và nhập mô tả bài toán để bắt đầu phân tích
              </p>
            </div>
          )}

          {/* Input Section */}
          <InputSection
            theme={theme}
            themeColors={themeColors}
            problemDescription={problemDescription}
            setProblemDescription={setProblemDescription}
            file={file}
            fileContent={fileContent}
            handleFileUpload={handleFileUpload}
            analyzeCode={analyzeCode}
            isAnalyzing={isAnalyzing}
          />

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResult && (
              <>
                {/* Problem Understanding
                <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Hiểu đề bài</span>
                  </h3>
                  <p className="text-green-300">{analysisResult.problemUnderstanding}</p>
                </div> */}

                {/* Code Analysis */}
                {/* <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                  <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                    <Code className="w-5 h-5 text-blue-400" />
                    <span>Đọc mã nguồn</span>
                  </h3>
                  <p className="text-blue-300">{analysisResult.codeAnalysis}</p>
                </div> */}

                {/* Compilation Status */}
                <CompilationStatusCard
                  status={analysisResult.compilationStatus}
                  errors={analysisResult.compilationErrors}
                />

                {/* LLM Review */}
                {analysisResult.llmReview && (
                  <LLMReviewCard review={analysisResult.llmReview} themeColors={themeColors} />
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