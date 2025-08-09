from abc import ABC, abstractmethod
from app.models.analysis_result import AnalysisResult
from app.services.LLM.llm_factory import LLMFactory
from langchain.prompts import PromptTemplate

class BaseAIService(ABC):
    
    def __init__(self, llm_factory: LLMFactory):
        self.llm_factory = llm_factory
        self.chain = None
        self._initialize_chain()
    
    def _initialize_chain(self):
        """Initialize the LLM chain with prompt template."""
        prompt_template = self._create_prompt_template()
        self.chain = self.llm_factory.create_chain(prompt_template)
    
    @abstractmethod
    def _create_prompt_template(self) -> PromptTemplate:
        """Create the prompt template for this AI service."""
        pass
    
    @abstractmethod
    def analyze_code(self, problem_text: str, solution_code: str) -> AnalysisResult:
        """
        Args:
            problem_text (str): The problem statement
            solution_code (str): The solution code
        Returns:
            AnalysisResult: Structured analysis result
        """
        pass
    
    def get_model_name(self) -> str:
        return self.llm_factory.get_model_name()
    
    def read_file_content(self, file_path: str) -> str:
        """
        Read content from file (common implementation).
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
