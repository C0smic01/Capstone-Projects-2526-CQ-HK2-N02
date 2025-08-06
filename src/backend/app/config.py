import os

class Config:
   """Configuration class for the application."""
   UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
   ALLOWED_EXTENSIONS = {'.cpp', '.txt'}
   MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB max upload size
   # API_KEY = 