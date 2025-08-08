import os

class Config:
	"""Configuration class for the application."""
	UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
	ALLOWED_EXTENSIONS = {'.cpp', '.txt'}
	MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB max upload size
	
	# AI Service API Keys
	GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', '')  # API key for Gemini
	OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')  # API key for OpenAI
	GROQ_API_KEY = os.getenv('GROQ_API_KEY', '')  # API key for Groq
	
	# Default AI service to use
	DEFAULT_AI_SERVICE = os.getenv('DEFAULT_AI_SERVICE', 'gemini')  # 'gemini', 'openai', or 'groq' 