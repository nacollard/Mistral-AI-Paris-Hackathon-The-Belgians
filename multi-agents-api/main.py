from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
cors = CORS(app)

@app.route('/run_python', methods=['POST'])
def run_python():
    data = request.json
    result = process_data(data)
    time.sleep(10)
    
    return jsonify(result)

def process_data(data):
    return {"response": "Processed data"}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
