from abc import ABC, abstractmethod
from typing import Any
from langchain.base_language import BaseLanguageModel
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

class LLMFactory(ABC):
    """Abstract factory for creating LLM instances."""
    
    @abstractmethod
    def create_llm(self) -> BaseLanguageModel:
        """Create and return an LLM instance."""
        pass
    
    @abstractmethod
    def get_model_name(self) -> str:
        """Get the model name."""
        pass
    
    def create_chain(self, prompt_template: PromptTemplate) -> LLMChain:
        """Create LLMChain with the LLM instance."""
        llm = self.create_llm()
        return LLMChain(
            llm=llm,
            prompt=prompt_template,
            verbose=False
        )

class GeminiLLMFactory(LLMFactory):
    """Factory for creating Gemini LLM instances."""
    
    def __init__(self, api_key: str, model_name: str = "gemini-1.5-flash", temperature: float = 0.3):
        if not api_key:
            raise ValueError("GOOGLE_API_KEY is required for Gemini LLM")
        self.api_key = api_key
        self.model_name = model_name
        self.temperature = temperature
    
    def create_llm(self) -> BaseLanguageModel:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model=self.model_name,
            google_api_key=self.api_key,
            temperature=self.temperature
        )
    
    def get_model_name(self) -> str:
        return self.model_name

class OpenAILLMFactory(LLMFactory):
    """Factory for creating OpenAI LLM instances."""
    
    def __init__(self, api_key: str, model_name: str = "gpt-3.5-turbo", temperature: float = 0.3):
        if not api_key:
            raise ValueError("OPENAI_API_KEY is required for OpenAI LLM")
        self.api_key = api_key
        self.model_name = model_name
        self.temperature = temperature
    
    def create_llm(self) -> BaseLanguageModel:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=self.model_name,
            openai_api_key=self.api_key,
            temperature=self.temperature
        )
    
    def get_model_name(self) -> str:
        return self.model_name

class GroqLLMFactory(LLMFactory):
    """Factory for creating Groq LLM instances."""
    
    def __init__(self, api_key: str, model_name: str = "llama-3.1-8b-instant", temperature: float = 0.3):
        if not api_key:
            raise ValueError("GROQ_API_KEY is required for Groq LLM")
        self.api_key = api_key
        self.model_name = model_name
        self.temperature = temperature
    
    def create_llm(self) -> BaseLanguageModel:
        from langchain_groq import ChatGroq
        return ChatGroq(
            model=self.model_name,
            groq_api_key=self.api_key,
            temperature=self.temperature
        )
    
    def get_model_name(self) -> str:
        return self.model_name
