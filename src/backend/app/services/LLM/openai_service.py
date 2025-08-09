from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from app.config import Config
from app.models.analysis_result import AnalysisResult
from app.services.LLM.base_ai_service import BaseAIService
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
Analyze the C++ code and provide only 3 key insights:

PROBLEM STATEMENT:
{problem_text}

SOLUTION CODE:
{solution_code}

Please respond in the following format:

## COMPLEXITY
Time and space complexity in Big O notation (e.g., Time: O(n), Space: O(1))

## PERFORMANCE  
Performance assessment and execution speed evaluation (good/average/slow with reasoning)

## IMPROVEMENTS
Specific optimization suggestions to improve the code (if any)

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
                analysis_result.improvements = "Cần phân tích thêm để đưa ra đề xuất cải thiện"
                analysis_result.complexity = "Cần phân tích thêm"
                analysis_result.execution_time = "Chưa đánh giá"
            
            return analysis_result
                
        except Exception as e:
            raise Exception(f"OpenAI analysis failed: {str(e)}")
    
    def get_model_name(self) -> str:
        """Get the model name."""
        return self.model_name
