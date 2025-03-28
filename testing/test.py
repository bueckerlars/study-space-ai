import requests
import sys

with open("./1029aae8-14d7-4af5-b55b-a582d5c4667c_ocr.txt", "r", encoding="utf-8") as file:
    text = file.read()

api_url = "http://localhost:11434/api/embed"

prompt = "Angesichts der folgenden Themen: Maschinelles Lernen, KI, Deep Learning, Computer Vision, Natürliche Sprachverarbeitung generiere einen beschreibenden Titel auf Deutsch. Der Titel darf maxiaml 200 Zeichen lang sein."

payload = {
    "model": 'nomic-embed-text',
    "input": text,
}

try:
    response = requests.post(api_url, json=payload)
    response.raise_for_status()
    print(response.json()) 
except requests.exceptions.RequestException as e:
    print(f"Error communicating with Ollama API: {e}", file=sys.stderr)