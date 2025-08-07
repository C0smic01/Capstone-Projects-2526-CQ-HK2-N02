from flask import jsonify, request
from app.services.file_service import allowed_file, save_file
from app.services.gemini_service import get_gemini_service
from app.utils.json_response import json_response
from app.utils.error_codes import ERROR_CODES
from app.constants.filenames import PROBLEM_FILENAME, SOLUTION_FILENAME
import os

def register_routes(app):
    """Register all routes for the application."""
    
    @app.route('/')
    def hello():
        return jsonify({"message": "Welcome to Code Mystic API"})
    
    @app.route('/api/upload', methods=['POST'])
    def upload_files():
        """Handle file upload for problem and solution files."""
        
        try:
            # Check if both problem and solution files are present
            if PROBLEM_FILENAME not in request.files or SOLUTION_FILENAME not in request.files:
                return jsonify(json_response(
                    status = "fail",
                    code = ERROR_CODES["MISSING_PARAM"],
                    message = "Both problem and solution files are required."
                )), 400

            problem_file = request.files[PROBLEM_FILENAME]
            solution_file = request.files[SOLUTION_FILENAME]

            # Check if files are actually selected
            if problem_file.filename == '' or solution_file.filename == '':
                return jsonify(json_response(
                    status = "fail",
                    code = ERROR_CODES["MISSING_PARAM"],
                    message = "Both problem and solution files are required."
                )), 400
            
            # Check file extensions
            if not allowed_file(problem_file.filename) or not allowed_file(solution_file.filename):
                return jsonify(json_response(
                    status = "fail",
                    code = ERROR_CODES["INVALID_FILE_TYPE"],
                    message = "Invalid file type. Only .txt and .cpp are accepted."
                )), 400
            
            # Save the files
            problem_saved, problem_path = save_file(problem_file, f"problem_{problem_file.filename}")
            solution_saved, solution_path = save_file(solution_file, f"solution_{solution_file.filename}")
            
            if not problem_saved or not solution_saved:
                return jsonify(json_response(
                    status = "fail",
                    code = ERROR_CODES["UPLOAD_FAILED"],
                    message = "Failed to save uploaded files to server."
                )), 500
            
            # Success response
            return jsonify(json_response(
                status = "success",
                message = "This is temp response: Files uploaded successfully.",
                data = {
                    "problem_file": problem_path,
                    "solution_file": solution_path
                }
            )), 200
            
        except Exception as e:
            return jsonify(json_response(
                status = "fail",
                code = ERROR_CODES["UPLOAD_FAILED"],
                message = "Failed to save uploaded files to server."
            )), 500
    
    @app.route('/api/analyze', methods=['POST'])
    def analyze_code():
        """Analyze uploaded problem and solution files using Gemini AI."""
        
        try:
            # Check if both problem and solution files are present
            if PROBLEM_FILENAME not in request.files or SOLUTION_FILENAME not in request.files:
                return jsonify(json_response(
                    status = "fail",
                    code = ERROR_CODES["MISSING_PARAM"],
                    message = "Both problem and solution files are required."
                )), 400

            problem_file = request.files[PROBLEM_FILENAME]
            solution_file = request.files[SOLUTION_FILENAME]

            # Check if files are actually selected
            if problem_file.filename == '' or solution_file.filename == '':
                return jsonify(json_response(
                    status = "fail",
                    code = ERROR_CODES["MISSING_PARAM"],
                    message = "Both problem and solution files are required."
                )), 400
            
            # Check file extensions
            if not allowed_file(problem_file.filename) or not allowed_file(solution_file.filename):
                return jsonify(json_response(
                    status = "fail",
                    code = ERROR_CODES["INVALID_FILE_TYPE"],
                    message = "Invalid file type. Only .txt and .cpp are accepted."
                )), 400
            
            # Save the files temporarily
            problem_saved, problem_path = save_file(problem_file, f"temp_problem_{problem_file.filename}")
            solution_saved, solution_path = save_file(solution_file, f"temp_solution_{solution_file.filename}")
            
            if not problem_saved or not solution_saved:
                return jsonify(json_response(
                    status = "fail",
                    code = ERROR_CODES["UPLOAD_FAILED"],
                    message = "Failed to save uploaded files to server."
                )), 500
            
            try:
                # Get Gemini service instance
                gemini_service = get_gemini_service()
                
                # Read file contents
                problem_content = gemini_service.read_file_content(problem_path)
                solution_content = gemini_service.read_file_content(solution_path)
                
                # Analyze with Gemini AI
                analysis_result = gemini_service.analyze_code(problem_content, solution_content)
                
                # Clean up temporary files
                try:
                    os.remove(problem_path)
                    os.remove(solution_path)
                except:
                    pass  # Ignore file cleanup errors
                
                # Success response with structured data
                return jsonify(json_response(
                    status="success",
                    message="Code analysis completed successfully.",
                    data={
                        "analysis": analysis_result.to_dict(),
                        "metadata": {
                            "problem_filename": problem_file.filename,
                            "solution_filename": solution_file.filename,
                            "analysis_timestamp": str(__import__('datetime').datetime.now()),
                            "model_used": "gemini-1.5-flash"
                        }
                    }
                )), 200
                
            except Exception as analysis_error:
                # Clean up files on error
                try:
                    os.remove(problem_path)
                    os.remove(solution_path)
                except:
                    pass
                    
                return jsonify(json_response(
                    status="fail",
                    code=ERROR_CODES["AI_ANALYSIS_FAILED"],
                    message="AI analysis failed",
                    data={
                        "error_details": str(analysis_error),
                        "problem_filename": problem_file.filename,
                        "solution_filename": solution_file.filename,
                        "timestamp": str(__import__('datetime').datetime.now())
                    }
                )), 500
            
        except Exception as e:
            return jsonify(json_response(
                status = "fail",
                code = ERROR_CODES["UNKNOWN_ERROR"],
                message = f"An unexpected error occurred: {str(e)}"
            )), 500