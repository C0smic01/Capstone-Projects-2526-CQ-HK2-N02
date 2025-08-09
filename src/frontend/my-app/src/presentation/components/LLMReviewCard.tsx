import React from 'react';
import { Brain } from 'lucide-react';

interface ThemeColors {
  classes: {
    border: string;
    icon: string;
    accent: string;
  };
}

interface LLMReviewCardProps {
  review: string;
  themeColors: ThemeColors;
}

const LLMReviewCard: React.FC<LLMReviewCardProps> = ({ review, themeColors }) => {
  return (
    <div className={`bg-black/30 backdrop-blur-sm rounded-2xl p-6 border ${themeColors.classes.border}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
        <Brain className={themeColors.classes.icon} />
        <span>Nhận xét từ AI</span>
      </h3>
      <div className={`${themeColors.classes.accent} whitespace-pre-wrap`}>
        {review}
      </div>
    </div>
  );
};

export default LLMReviewCard;
