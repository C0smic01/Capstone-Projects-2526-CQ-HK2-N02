from abc import ABC, abstractmethod
from app.models.analysis_result import AnalysisResult

class BaseAIService(ABC):
    """Abstract base class for AI services."""
    
    def __init__(self):
        self.model_name = "unknown"
    
    @abstractmethod
    def analyze_code(self, problem_text: str, solution_code: str) -> AnalysisResult:
        """
        Analyze problem and solution code using AI.
        
        Args:
            problem_text (str): The problem statement
            solution_code (str): The solution code
            
        Returns:
            AnalysisResult: Structured analysis result
        """
        pass
    
    @abstractmethod
    def get_model_name(self) -> str:
        """Get the name of the AI model."""
        pass
    
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
