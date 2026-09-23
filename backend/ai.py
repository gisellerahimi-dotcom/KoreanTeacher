
from flask import Flask, jsonify, request
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv
import os

app = Flask(__name__)

#load the .env file located next to ai.py
load_dotenv(Path(__file__).parent / ".env")


#Reads OPENAI_API_KEY from the environment
#creates the API client using its default settings,
#looks for OPENAI_API_KEY and connects to openai's apu
# it won't automatically use the FOUNDRY variables
#client = OpenAI()

client = OpenAI(
    api_key = os.environ["FOUNDRY_API_KEY"],
    base_url=os.environ["FOUNDRY_ENDPOINT"]
)

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
    result = client.responses.create(
        model = "gpt-5-mini",
        instructions = (
            "You are a knowledgeable Korean language instructor"
            "Explain concepts and provide translations clearly"
        ),
        input = message,
    )
    return result.output_text