FROM python:3.9-slim

WORKDIR /app

# Installieren von System-Abhängigkeiten für OCR
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    # Install Vulkan drivers for GPU acceleration
    vulkan-tools \
    libvulkan1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Kopieren und Installieren der Anwendungsabhängigkeiten
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopieren der Anwendungsdateien
COPY . .

# Erstellen eines Output-Verzeichnisses für gespeicherte OCR-Ergebnisse
RUN mkdir -p /app/output

# Environment variables with defaults
ENV OCR_SERVICE_PORT=8000
ENV ALLOWED_ORIGINS="*"

# Port exponieren (kann überschrieben werden)
EXPOSE ${OCR_SERVICE_PORT}

# Starten des FastAPI-Servers
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${OCR_SERVICE_PORT}"]