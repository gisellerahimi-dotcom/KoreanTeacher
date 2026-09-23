
from flask import Flask, jsonify, request
from openai import OpenAI

app = Flask(__name__)

# chatbot backend -> user sends message that is sent to flask
# flask gets response back from ai and sends it to app.jsx
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()

    message = data["message"]

    response = ask_ai(message)

    return jsonify({
        "response": response
    })