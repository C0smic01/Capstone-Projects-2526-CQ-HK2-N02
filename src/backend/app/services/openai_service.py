from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from app.config import Config
from app.models.analysis_result import AnalysisResult
from app.services.base_ai_service import BaseAIService
import os

class OpenAIService(BaseAIService):
    """OpenAI service implementation."""
    
    def __init__(self):
        super().__init__()
        
        # Get API key from environment
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if not openai_api_key:
            raise ValueError("OPENAI_API_KEY is not set in environment variables")
        
        self.model_name = "gpt-3.5-turbo"
        
        # Initialize OpenAI LLM
        self.llm = ChatOpenAI(
            model=self.model_name,
            openai_api_key=openai_api_key,
            temperature=0.3
        )
        
        # Create prompt template for code review
        self.prompt_template = PromptTemplate(
            input_variables=["problem_text", "solution_code"],
            template="""
Analyze the following problem statement and solution code concisely:

PROBLEM STATEMENT:
{problem_text}

SOLUTION CODE:
{solution_code}

Please provide analysis in the following format:

## CORRECTNESS
Does the code solve the problem correctly? (Correct/Incorrect with brief reasoning)

## ERRORS AND ISSUES
Any logic, syntax, or other issues in the code (if any)

## IMPROVEMENTS
Suggestions to improve the code (algorithm optimization, bug fixes, additional features)

## COMPLEXITY
Time and space complexity (O notation format)

## EXECUTION TIME
Performance assessment and runtime evaluation of the algorithm

Respond concisely in Vietnamese.
            """
        )
        
        # Create LLM chain
        self.chain = LLMChain(
            llm=self.llm,
            prompt=self.prompt_template,
            verbose=False
        )
    
    def analyze_code(self, problem_text: str, solution_code: str) -> AnalysisResult:
        """Analyze code using OpenAI."""
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
            raise Exception(f"OpenAI analysis failed: {str(e)}")
    
    def get_model_name(self) -> str:
        """Get the model name."""
        return self.model_name
