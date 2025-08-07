from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from app.config import Config
from app.models.analysis_result import AnalysisResult
import os

class GeminiService:
    """Service for interacting with Google Gemini AI using LangChain."""
    
    def __init__(self):
        """Initialize the Gemini service with API key."""
        if not Config.GOOGLE_API_KEY:
            raise ValueError("GOOGLE_API_KEY is not set in environment variables")
        
        # Initialize Gemini LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
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
    
    def analyze_code(self, problem_text, solution_code):
        """
        Analyze problem and solution code using Gemini AI.
        
        Args:
            problem_text (str): The problem statement
            solution_code (str): The solution code
            
        Returns:
            AnalysisResult: Structured analysis result
        """
        try:
            # Use invoke instead of deprecated run method
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
            
            # If parsing fails, create a basic result with fallback values
            if not analysis_result.improvements and not analysis_result.complexity:
                # Simple fallback parsing
                analysis_result.is_correct = "sai" not in analysis_text.lower() and "error" not in analysis_text.lower()
                analysis_result.improvements = "Cần phân tích thêm để đưa ra đề xuất cải thiện"
                analysis_result.errors = "Chưa phát hiện lỗi rõ ràng" if analysis_result.is_correct else "Có thể có lỗi trong logic"
                analysis_result.complexity = "Cần phân tích thêm"
                analysis_result.execution_time = "Chưa đánh giá"
            
            return analysis_result
                
        except Exception as e:
            raise Exception(f"Gemini AI analysis failed: {str(e)}")
    
    def read_file_content(self, file_path):
        """
        Read content from file.
        
        Args:
            file_path (str): Path to the file
            
        Returns:
            str: File content
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except UnicodeDecodeError:
            # Try with different encoding if utf-8 fails
            with open(file_path, 'r', encoding='latin-1') as file:
                return file.read()
        except Exception as e:
            raise Exception(f"Error reading file {file_path}: {str(e)}")

# Global instance - initialize only when needed
gemini_service = None

def get_gemini_service():
    """Get or create Gemini service instance."""
    global gemini_service
    if gemini_service is None:
        gemini_service = GeminiService()
    return gemini_service
