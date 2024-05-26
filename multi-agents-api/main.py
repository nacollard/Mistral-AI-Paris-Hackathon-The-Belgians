from flask import Flask, jsonify, request
from flask_cors import CORS
import time
from agents import *

app = Flask(__name__)
cors = CORS(app)

@app.route('/run_python', methods=['POST'])
def run_python():
    data = request.json
    
    news_article1 = data[0] + " " + data[1]
    employees_to_inform, priority_level, main_topic, context, justification, type, strategy = routing_agent(news_article1, data[2])
    
    return jsonify({
        "employees_to_inform": employees_to_inform,
        "priority_level": priority_level,
        "main_topic": main_topic,
        "context": context,
        "justification": justification,
        "type": type,
        "strategy": strategy
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
