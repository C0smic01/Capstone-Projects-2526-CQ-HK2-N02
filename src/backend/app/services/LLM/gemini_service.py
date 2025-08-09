from langchain.prompts import PromptTemplate
from app.config import Config
from app.models.analysis_result import AnalysisResult
from app.services.LLM.base_ai_service import BaseAIService
from app.services.LLM.llm_factory import GeminiLLMFactory

class GeminiService(BaseAIService):
    """Gemini AI service implementation."""
    
    def __init__(self):
        if not Config.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is not set in environment variables")
        
        # Create LLM factory and initialize base service
        llm_factory = GeminiLLMFactory(
            api_key=Config.GOOGLE_API_KEY,
            model_name="gemini-1.5-flash",
            temperature=0.3
        )
        super().__init__(llm_factory)
    
    def _create_prompt_template(self) -> PromptTemplate:
        """Create the prompt template for Gemini service."""
        return PromptTemplate(
            input_variables=["problem_text", "solution_code"],
            template="""
Phân tích code C++ sau và chỉ trả về 3 thông tin chính:

ĐỀ BÀI:
{problem_text}

CODE:
{solution_code}

Trả lời theo format sau:

## ĐỘ PHỨC TẠP
Độ phức tạp thời gian và không gian theo Big O notation (ví dụ: Thời gian: O(n), Không gian: O(1))

## HIỆU NĂNG
Đánh giá hiệu suất và tốc độ thực thi của thuật toán (tốt/trung bình/chậm và lý do)

## CẢI THIỆN
Đề xuất cải thiện cụ thể để tối ưu hóa code (nếu có)

Trả lời ngắn gọn, chính xác bằng tiếng Việt.
            """
        )
    
    def analyze_code(self, problem_text: str, solution_code: str) -> AnalysisResult:
        """Analyze code using Gemini AI."""
        try:
            response = self.chain.invoke({
                "problem_text": problem_text,
                "solution_code": solution_code
            })
            
            # Handle different response formats
            analysis_text = ""
            if isinstance(response, dict):
                if 'text' in response:
                    analysis_text = response['text']
                elif 'output' in response:
                    analysis_text = response['output']
                else:
                    analysis_text = str(response)
            else:
                analysis_text = str(response)
            
            # Parse the text response into structured data
            analysis_result = AnalysisResult.from_text(analysis_text)
            
            # Fallback if parsing fails
            if not analysis_result.improvements and not analysis_result.complexity:
                analysis_result.improvements = "Cần phân tích thêm để đưa ra đề xuất cải thiện"
                analysis_result.complexity = "Cần phân tích thêm"
                analysis_result.execution_time = "Chưa đánh giá"
            
            return analysis_result
                
        except Exception as e:
            raise Exception(f"Gemini AI analysis failed: {str(e)}")
