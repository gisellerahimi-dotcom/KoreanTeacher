
from flask import Flask, jsonify, request
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv

app = Flask(__name__)

#load the .env file located next to ai.py
load_dotenv(Path(__file__).parent / ".env")

#Reads OPENAI_API_KEY from the environment
client = OpenAI()

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()

    message = data["message"]

    response = ask_ai(message)

    #sendomg tp react
    return jsonify({
        "response": response
    })
 
#create ask_ai to take the user's message, send it to OpenAI, and return
#the reply as text   
def ask_ai(message):
    result = client.response.create(
        model = "gpt-5-mini",
        instructions = (
            "You are a knowledgeable Korean language instructor"
            "Explain concepts and provide translations clearly"
        ),
        input = message,
    )
    return result.output_text