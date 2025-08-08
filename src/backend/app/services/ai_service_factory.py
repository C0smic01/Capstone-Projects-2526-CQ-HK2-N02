from typing import Dict, Type
from app.services.base_ai_service import BaseAIService
from app.services.gemini_service_v2 import GeminiService
from app.services.openai_service import OpenAIService

class AIServiceFactory:
    """Factory class for creating AI service instances."""
    
    _services: Dict[str, Type[BaseAIService]] = {
        "gemini": GeminiService,
        "openai": OpenAIService
    }
    
    _instances: Dict[str, BaseAIService] = {}
    
    @classmethod
    def get_service(cls, service_name: str = "gemini") -> BaseAIService:
        """
        Get AI service instance.
        
        Args:
            service_name (str): Name of the service ('gemini' or 'openai')
            
        Returns:
            BaseAIService: AI service instance
        """
        if service_name not in cls._services:
            raise ValueError(f"Unknown AI service: {service_name}. Available: {list(cls._services.keys())}")
        
        # Use singleton pattern for each service
        if service_name not in cls._instances:
            cls._instances[service_name] = cls._services[service_name]()
        
        return cls._instances[service_name]
    
    @classmethod
    def get_available_services(cls) -> list:
        """Get list of available AI services."""
        return list(cls._services.keys())
    
    @classmethod
    def register_service(cls, name: str, service_class: Type[BaseAIService]):
        """Register a new AI service."""
        cls._services[name] = service_class
