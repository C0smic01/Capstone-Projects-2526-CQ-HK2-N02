from flask import jsonify

def register_routes(app):
    """Register all routes for the application."""
    
    @app.route('/')
    def hello():
        return jsonify({"message": "Welcome to the Flask API!"})
    
    @app.route('/health')
    def health_check():
        return jsonify({"status": "healthy"})