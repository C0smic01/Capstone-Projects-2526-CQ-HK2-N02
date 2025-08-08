from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from app.config import Config
from app.models.analysis_result import AnalysisResult
from app.services.base_ai_service import BaseAIService
import os

class GroqService(BaseAIService):
    """Groq AI service implementation."""
    
    def __init__(self):
        super().__init__()
        
        # Get API key from environment
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY is not set in environment variables")
        
        self.model_name = "llama-3.1-8b-instant"  # Fast and accurate Groq model
        # Alternative models: "mixtral-8x7b-32768", "llama-3.1-70b-versatile"
        
        # Initialize Groq LLM
        self.llm = ChatGroq(
            model=self.model_name,
            groq_api_key=groq_api_key,
            temperature=0.3
        )
        
        # Create prompt template for code review
        self.prompt_template = PromptTemplate(
            input_variables=["problem_text", "solution_code"],
            template="""
Bạn là chuyên gia phân tích code C++. Hãy phân tích đề bài và code sau:

ĐỀ BÀI: {problem_text}
CODE: {solution_code}

Trả lời NGẮN GỌN theo format:

CORRECTNESS: [Đúng/Sai - 1 câu giải thích]
ERRORS: [Mô tả lỗi hoặc "Không có lỗi"]
IMPROVEMENTS: [Gợi ý cải thiện - tối đa 2 câu]
COMPLEXITY: [Thời gian: O(x), Không gian: O(y)]
EXECUTION: [Đánh giá hiệu suất - 1 câu ngắn]

Chỉ trả lời theo format trên, không thêm markdown hay ký tự đặc biệt.
            """
        )
        
        # Create LLM chain
        self.chain = LLMChain(
            llm=self.llm,
            prompt=self.prompt_template,
            verbose=False
        )
    
    def _parse_groq_response(self, text: str) -> AnalysisResult:
        """Parse Groq-specific response format."""
        result = AnalysisResult()
        
        # Clean up text
        text = text.strip()
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Parse each field
            if line.startswith('CORRECTNESS:'):
                content = line.replace('CORRECTNESS:', '').strip()
                result.is_correct = content.lower().startswith('đúng')
                
            elif line.startswith('ERRORS:'):
                content = line.replace('ERRORS:', '').strip()
                result.errors = content if content != "Không có lỗi" else "Không phát hiện lỗi"
                
            elif line.startswith('IMPROVEMENTS:'):
                content = line.replace('IMPROVEMENTS:', '').strip()
                result.improvements = content
                
            elif line.startswith('COMPLEXITY:'):
                content = line.replace('COMPLEXITY:', '').strip()
                result.complexity = content
                
            elif line.startswith('EXECUTION:'):
                content = line.replace('EXECUTION:', '').strip()
                result.execution_time = content
        
        # Set defaults if parsing failed
        if not result.errors:
            result.errors = "Không phát hiện lỗi rõ ràng"
        if not result.improvements:
            result.improvements = "Cần phân tích thêm"
        if not result.complexity:
            result.complexity = "Chưa xác định"
        if not result.execution_time:
            result.execution_time = "Chưa đánh giá"
            
        return result
    def analyze_code(self, problem_text: str, solution_code: str) -> AnalysisResult:
        """Analyze code using Groq AI."""
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
            
            # Use Groq-specific parser
            analysis_result = self._parse_groq_response(analysis_text)
            
            return analysis_result
                
        except Exception as e:
            raise Exception(f"Groq AI analysis failed: {str(e)}")
    
    def get_model_name(self) -> str:
        """Get the model name."""
        return self.model_name
