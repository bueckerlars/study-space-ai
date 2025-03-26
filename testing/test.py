import requests
import sys

with open("./1029aae8-14d7-4af5-b55b-a582d5c4667c_ocr.txt", "r", encoding="utf-8") as file:
    text = file.read()

api_url = "http://localhost:11434/api/generate"

payload = {
    "model": "deepseek-r1:8b",
    "options": {
        "system": "Du bist ein hilfreicher Assistent, der Kerninformationen aus Dokumenten extrahiert.",
    },
    "stream": False,
    "prompt": "Extrahiere die Hauptthemen und Kernaussagen aus dem folgenden Text in jeweils 1 bis 3 Wörten und gib sie als JSON Array von Strings zurück.\n\nText: " + text +  "\n\nJSON Array der Themen:",
    "format": {
        "type": "object",
        "properties": {
            "themes": {
                "type": "array",
                "items": {
                    "type": "string",
                }
            }
        },
        "required": ["themes"]
    }
}

try:
    response = requests.post(api_url, json=payload)
    response.raise_for_status()
    print(response.json().get("response", "No summary generated")) 
except requests.exceptions.RequestException as e:
    print(f"Error communicating with Ollama API: {e}", file=sys.stderr)