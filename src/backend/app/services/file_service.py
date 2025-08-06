import os
from werkzeug.utils import secure_filename
from app.config import Config


def allowed_file(filename):
    return os.path.splitext(filename)[1] in Config.ALLOWED_EXTENSIONS


def save_file(file_obj, filename):
    """Save the uploaded file to the upload folder."""
    try:
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        path = os.path.join(Config.UPLOAD_FOLDER, secure_filename(filename))
        file_obj.save(path)
        return True, path
    except Exception as e:
        print(f"Error saving file: {e}")
        return False, None


def read_file(filename):
    """Read the content of a file."""
    try:
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        if not os.path.isfile(filepath):
            return False, "File not found"
        with open(filepath, "r", encoding="utf-8") as f:
            return True, f.read()
    except Exception as e:
        return False, str(e)
