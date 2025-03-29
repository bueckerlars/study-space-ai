# OCR Service API

Eine FastAPI-basierte REST-API für die Texterkennung in PDF-Dokumenten mittels OCR (Optical Character Recognition).

## Features

- PDF-Texterkennung mit direkter Textextraktion und OCR-Fallback
- Mehrsprachige Unterstützung durch EasyOCR
- Optimierte Verarbeitung mit Multi-Threading-Option
- Direkte Textausgabe oder Speicherung in Datei

## Installation

### Voraussetzungen

- Python 3.9 oder höher
- pip (Python-Paketmanager)

### Lokale Installation

1. Repository klonen oder herunterladen
2. In das OCR-Service-Verzeichnis wechseln
3. Abhängigkeiten installieren:

```bash
pip install -r requirements.txt
```

### Docker-Installation

Mit Docker kann der Service einfach gebaut und gestartet werden:

```bash
# Docker-Image bauen
docker build -t ocr-service .

# Container starten
docker run -d -p 8000:8000 --name ocr-service-container ocr-service
```

## API-Verwendung

Nach dem Start ist die API unter `http://localhost:8000` erreichbar.

### Swagger-Dokumentation

Die automatisch generierte API-Dokumentation ist verfügbar unter:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Endpunkte

#### GET /
- Statusprüfung des Services
- Gibt zurück: `{"status": "OCR Service is running"}`

#### GET /health
- Health-Check-Endpunkt
- Gibt zurück: `{"status": "healthy"}`

#### POST /ocr
- OCR-Verarbeitung eines PDF-Dokuments mit direkter Textausgabe
- Parameter:
  - `file`: PDF-Datei (Formular-Upload)
  - `language`: Sprache für OCR (Standard: "en")
  - `use_multithreading`: Multi-Threading aktivieren (Standard: true)
  - `allow_ocr`: OCR-Fallback aktivieren (Standard: true)
- Gibt zurück: JSON mit extrahiertem Text

#### POST /ocr/save
- OCR-Verarbeitung mit Speicherung des Textes in einer Datei
- Parameter: wie bei /ocr
- Gibt zurück: JSON mit Datei-ID und Pfad zur gespeicherten Textdatei

## Beispiel

### cURL-Anfrage

```bash
curl -X POST "http://localhost:8000/ocr" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@dokument.pdf" \
  -F "language=de"
```

### JavaScript-Anfrage mit fetch

```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('language', 'de');

fetch('http://localhost:8000/ocr', {
  method: 'POST',
  body: formData,
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));
```

## Lizenz

MIT License