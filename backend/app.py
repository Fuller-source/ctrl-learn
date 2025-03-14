from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/api/run-code', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code', '')

    if not code:
        return jsonify({'error': 'No code provided'}), 400

    try:
        # Execute the Python code
        result = subprocess.run(['python', '-c', code], capture_output=True, text=True)
        output = result.stdout if result.returncode == 0 else result.stderr
        return jsonify({'output': output})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)