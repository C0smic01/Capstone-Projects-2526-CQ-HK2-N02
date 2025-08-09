import React, { useRef } from "react";
import { FileText, Upload, Zap, Brain } from "lucide-react";

interface InputFormProps {
  problemDescription: string;
  setProblemDescription: (value: string) => void;
  file: File | null;
  fileContent: string;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  analyzeCode: () => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputFormProps> = ({
  problemDescription,
  setProblemDescription,
  file,
  fileContent,
  handleFileUpload,
  analyzeCode,
  isAnalyzing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">

      {/* Mô tả bài toán */}
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <FileText className="text-cyan-400" />
          <span>Mô tả bài toán</span>
        </h2>
        <textarea
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
          placeholder="Nhập mô tả đề bài tập cần giải..."
          className="w-full h-32 bg-slate-800/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
        />
      </div>

      {/* Upload file */}
      <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Upload className="text-cyan-400" />
          <span>Upload file C++</span>
        </h2>

        <div
          className="border-2 border-dashed border-cyan-500/30 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-all cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
          <p className="text-cyan-300">
            {file ? file.name : "Chọn file .cpp để phân tích"}
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
                {fileContent.length > 500 && "..."}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Button */}
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
  );
};

export default InputSection;