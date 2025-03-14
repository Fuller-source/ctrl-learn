from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/run-code', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code', '')

    if not code:
        return jsonify({'error': 'No code provided'}), 400

    try:
        # Create a local scope to execute the code
        local_scope = {}
        # Redirect stdout to capture print statements
        import sys
        from io import StringIO
        
        old_stdout = sys.stdout
        redirected_output = StringIO()
        sys.stdout = redirected_output
        
        try:
            # Execute the code
            exec(code, {}, local_scope)
            output = redirected_output.getvalue()
        finally:
            sys.stdout = old_stdout
            
        return jsonify({'output': output})
    except Exception as e:
        return jsonify({'error': str(e), 'output': f"Error: {str(e)}"}), 200  # Return 200 to handle errors in the frontend

if __name__ == '__main__':
    app.run(debug=True, port=5000)
