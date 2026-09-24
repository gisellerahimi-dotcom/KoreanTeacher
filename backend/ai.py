
from flask import Flask, jsonify, request
from openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv
import os
import requests
import xml.etree.ElementTree as ET


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
    
    level = data.get("level") or "beginner"
    focus = data.get("focus") or "vocabulary"
    
    if level not in {
        "novice", "beginner", "intermediate", "advanced", "native"

    }: return jsonify({"error:" "Invalid Korean level"}), 400
    
    if focus not in {"vocabulary", "grammar", "writing", "speaking"}:
        return jsonify({"error": "Invalid learning focus."}), 400

    response = ask_ai(message, level, focus)

    #sendomg tp react
    return jsonify({
        "response": response
    })

@app.route("/api/dictionary", methods = ["GET"])
def dictionary():
    word = request.args.get("q","").strip()
    
    if not word:
        return jsonify({"error":"Enter a Korean word."}), 400
    
    key = os.getenv("KRDICT_API_KEY")
    #adding error status (500) to missing key response
    if not key:
        return jsonify({"error": "Dictionary key is not configured."}),500
    
    try:
        result = requests.get(
            "https://krdict.korean.go.kr/api/search",
            params = {
                "key": key,
                "q" : word,
                "part" : "word",
                "num":10,
                "translated":"y",
                "trans_lang":"1",
            },
            timeout = 10,
        )
        result.raise_for_status() ###
        root = ET.fromstring(result.content)
        
        if root.tag == "error":
            return jsonify({
                "error":"dictionary service rejected the request.",
                "code": root.findtext("error_code"),
            }), 502
        entries = []
        for item in root.findall("item"):
            entries.append({
                "id":item.findtext("target_code"),
                "word": item.findtext("word"),
                "meanings" : [
                    {
                        "korean" : sense.findtext("definition",""),
                        "english":sense.findtext(
                            "translation/trans_dfn",""
                        ),
                    }
                    for sense in item.findall("sense")
                    
                ],
            })
        return jsonify({"results": entries})
    except (requests.RequestException, ET.ParseError):
        return jsonify({
            "error" : "Could not retrieve dictionary results. Try again"
        }), 502
        
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