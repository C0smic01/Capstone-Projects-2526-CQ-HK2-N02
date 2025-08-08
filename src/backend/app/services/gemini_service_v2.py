from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from app.config import Config
from app.models.analysis_result import AnalysisResult
from app.services.base_ai_service import BaseAIService

class GeminiService(BaseAIService):
    """Gemini AI service implementation."""
    
    def __init__(self):
        super().__init__()
        if not Config.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is not set in environment variables")
        
        self.model_name = "gemini-1.5-flash"
        
        # Initialize Gemini LLM
        self.llm = ChatGoogleGenerativeAI(
            model=self.model_name,
            google_api_key=Config.GOOGLE_API_KEY,
            temperature=0.3
        )
        
        # Create simple prompt template for code review
        self.prompt_template = PromptTemplate(
            input_variables=["problem_text", "solution_code"],
            template="""
Phân tích đề bài và code sau một cách ngắn gọn:

ĐỀ BÀI:
{problem_text}

CODE GIẢI PHÁP:
{solution_code}

Hãy đưa ra nhận xét theo format sau:

## TÍNH ĐÚNG ĐẮN
Code có giải quyết đúng bài toán không? (Đúng/Sai và lý do ngắn gọn)

## LỖI VÀ VẤN ĐỀ  
Các lỗi logic, syntax, hoặc vấn đề trong code (nếu có)

## CẢI TIẾN
Đề xuất cải thiện code (tối ưu thuật toán, sửa lỗi, thêm tính năng)

## ĐỘ PHỨC TẠP
Độ phức tạp thời gian và không gian (dạng O notation)

## THỜI GIAN THỰC THI
Đánh giá hiệu suất và thời gian chạy của thuật toán

Trả lời ngắn gọn, súc tích bằng tiếng Việt.
            """
        )
        
        # Create LLM chain
        self.chain = LLMChain(
            llm=self.llm,
            prompt=self.prompt_template,
            verbose=False
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
                analysis_result.is_correct = "sai" not in analysis_text.lower() and "error" not in analysis_text.lower()
                analysis_result.improvements = "Cần phân tích thêm để đưa ra đề xuất cải thiện"
                analysis_result.errors = "Chưa phát hiện lỗi rõ ràng" if analysis_result.is_correct else "Có thể có lỗi trong logic"
                analysis_result.complexity = "Cần phân tích thêm"
                analysis_result.execution_time = "Chưa đánh giá"
            
            return analysis_result
                
        except Exception as e:
            raise Exception(f"Gemini AI analysis failed: {str(e)}")
    
    def get_model_name(self) -> str:
        """Get the model name."""
        return self.model_name
