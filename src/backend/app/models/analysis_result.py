from dataclasses import dataclass
from typing import Optional, Dict, Any
import json

@dataclass
class AnalysisResult:
    """Simple model for code analysis result."""
    
    # Basic fields
    is_correct: bool = False  # True/False for correctness
    improvements: str = ""    # Improvement suggestions
    errors: str = ""         # Error descriptions
    complexity: str = ""     # Algorithm complexity
    execution_time: str = "" # Expected execution time
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON response."""
        return {
            "complexity": self.complexity,
            "performance": self.execution_time,
            "improvements": self.improvements if self.improvements != "Không có đề xuất cải thiện" else None
        }
    
    @classmethod
    def from_text(cls, analysis_text: str) -> 'AnalysisResult':
        """Parse analysis text and create simple AnalysisResult object."""
        result = cls()
        
        text_lower = analysis_text.lower()
        
        # Determine correctness
        if any(word in text_lower for word in ["đúng", "correct", "chính xác", "hoạt động tốt", "giải quyết được"]):
            result.is_correct = True
        elif any(word in text_lower for word in ["sai", "incorrect", "lỗi", "không đúng", "bug"]):
            result.is_correct = False
        else:
            # Default to True if not explicitly mentioned as wrong
            result.is_correct = True
        
        # Extract sections
        sections = analysis_text.split("##")
        
        for section in sections:
            section = section.strip()
            if not section:
                continue
                
            lines = section.split("\n", 1)
            if len(lines) < 2:
                continue
                
            title = lines[0].strip().upper()
            content = lines[1].strip()
            
            # Parse different sections - focus on key metrics
            if any(keyword in title for keyword in ["PHỨC TẠP", "COMPLEXITY", "ĐỘ PHỨC TẠP"]):
                result._parse_complexity(content)
            elif any(keyword in title for keyword in ["CẢI TIẾN", "IMPROVEMENT", "CẢI THIỆN", "TỐI ƯU"]):
                result.improvements = content
            elif any(keyword in title for keyword in ["THỜI GIAN", "TIME", "HIỆU SUẤT", "PERFORMANCE", "HIỆU NĂNG"]):
                result.execution_time = content
        
        # Fallback: extract from full text if sections are not found
        if not result.improvements:
            result.improvements = result._extract_improvements(analysis_text)
        if not result.complexity:
            result.complexity = result._extract_complexity(analysis_text)
        if not result.execution_time:
            result.execution_time = result._extract_time(analysis_text)
            
        return result
    
    def _parse_complexity(self, content: str):
        """Parse complexity from content."""
        lines = content.split("\n")
        complexity_parts = []
        
        for line in lines:
            line = line.strip()
            if any(keyword in line.lower() for keyword in ["o(", "thời gian", "time", "space", "không gian"]):
                complexity_parts.append(line)
        
        self.complexity = "; ".join(complexity_parts) if complexity_parts else content
    
    def _extract_improvements(self, text: str) -> str:
        """Extract improvement suggestions from text."""
        improvements = []
        lines = text.split("\n")
        
        for line in lines:
            if any(keyword in line.lower() for keyword in ["cải thiện", "tối ưu", "nên", "có thể", "improvement", "optimize"]):
                improvements.append(line.strip())
        
        return ". ".join(improvements[:3]) if improvements else "Không có đề xuất cải thiện"
    
    def _extract_errors(self, text: str) -> str:
        """Extract error descriptions from text."""
        errors = []
        lines = text.split("\n")
        
        for line in lines:
            if any(keyword in line.lower() for keyword in ["lỗi", "sai", "thiếu", "không", "error", "bug", "issue"]):
                errors.append(line.strip())
        
        return ". ".join(errors[:3]) if errors else "Không phát hiện lỗi rõ ràng"
    
    def _extract_complexity(self, text: str) -> str:
        """Extract complexity information from text."""
        import re
        
        # Look for O() notation
        o_notation = re.findall(r'O\([^)]+\)', text, re.IGNORECASE)
        if o_notation:
            return ", ".join(o_notation[:2])
        
        # Look for complexity mentions
        lines = text.split("\n")
        for line in lines:
            if any(keyword in line.lower() for keyword in ["độ phức tạp", "complexity", "thời gian", "time"]):
                return line.strip()
        
        return "Chưa xác định được độ phức tạp"
    
    def _extract_time(self, text: str) -> str:
        """Extract performance information from text."""
        lines = text.split("\n")
        
        for line in lines:
            if any(keyword in line.lower() for keyword in ["thời gian", "time", "nhanh", "chậm", "hiệu suất", "performance", "hiệu năng", "tốt", "kém"]):
                return line.strip()
        
        return "Chưa có thông tin về hiệu năng"
