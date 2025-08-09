import React from 'react';
import { Brain } from 'lucide-react';

interface LLMReviewCardProps {
  review: string
}

const LLMReviewCard: React.FC<LLMReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
      <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
        <Brain className="text-cyan-400" />
        <span>Nhận xét từ AI</span>
      </h3>
      <div className="text-cyan-200 whitespace-pre-wrap">
        {review}
      </div>
    </div>
  );
};

export default LLMReviewCard;
