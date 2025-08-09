import React from 'react';
import { CheckCircle, XCircle, Zap } from 'lucide-react';

interface CompilationStatusCardProps {
  status: 'success' | 'error' | 'pending';
  errors?: string;
}

const CompilationStatusCard: React.FC<CompilationStatusCardProps> = ({ status, errors }) => {
  const borderColor =
    status === 'success'
      ? 'border-green-500/20'
      : status === 'error'
      ? 'border-red-500/20'
      : 'border-yellow-500/20';

  return (
    <div className={`bg-black/30 backdrop-blur-sm rounded-2xl p-6 border ${borderColor}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
        {status === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : status === 'error' ? (
          <XCircle className="w-5 h-5 text-red-400" />
        ) : (
          <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
        )}
        <span>Biên dịch</span>
      </h3>

      {status === 'success' ? (
        <p className="text-green-300">✅ Biên dịch thành công!</p>
      ) : status === 'error' ? (
        <div>
          <p className="text-red-300">❌ Có lỗi biên dịch:</p>
          <p className="text-red-200 mt-2 bg-red-900/20 p-3 rounded-lg">
            {errors}
          </p>
        </div>
      ) : (
        <p className="text-yellow-300">🔄 Đang kiểm tra...</p>
      )}
    </div>
  );
};

export default CompilationStatusCard;
