#!/bin/bash

# BuildAndPush.sh
# Script zum Bauen und Pushen eines einzelnen Docker-Containers

# Fehlgeschlagene Befehle stoppen das Skript
set -e

# Definiere Docker Hub Benutzername
# Bitte durch Ihren Docker Hub Benutzernamen ersetzen
DOCKER_USERNAME="larsbuecker"

# Tag/Version für Images
VERSION=$(date +"%Y%m%d%H%M")

# Funktion zum Bauen und Pushen eines Images
build_and_push() {
  service_name=$1
  dockerfile_path=$2
  shift 2  # Remove the first two arguments
  build_args="$@"  # Get remaining arguments as build args
  
  echo "🚀 Baue ${service_name} image..."
  if [ -z "$build_args" ]; then
    docker build -t ${DOCKER_USERNAME}/study-space-${service_name}:latest -t ${DOCKER_USERNAME}/study-space-${service_name}:${VERSION} -f ${dockerfile_path} ${dockerfile_path%/*}
  else
    docker build $build_args -t ${DOCKER_USERNAME}/study-space-${service_name}:latest -t ${DOCKER_USERNAME}/study-space-${service_name}:${VERSION} -f ${dockerfile_path} ${dockerfile_path%/*}
  fi
  
  echo "⬆️ Pushe ${service_name} image zu Docker Hub..."
  docker push ${DOCKER_USERNAME}/study-space-${service_name}:latest
  docker push ${DOCKER_USERNAME}/study-space-${service_name}:${VERSION}
  
  echo "✅ ${service_name} image erfolgreich gebaut und gepusht!"
  echo ""
}

# Hilfe-Funktion
show_help() {
  echo "Verwendung: ./BuildAndPush.sh <service-name>"
  echo ""
  echo "Verfügbare Services:"
  echo "  frontend      - Baut und pusht nur den Frontend-Container"
  echo "  backend       - Baut und pusht nur den Backend-Container"
  echo "  ocr-service   - Baut und pusht nur den OCR-Service-Container"
  echo ""
  echo "Beispiel: ./BuildAndPush.sh frontend"
}

# Prüfen, ob ein Parameter übergeben wurde
if [ $# -eq 0 ]; then
  echo "❌ Fehler: Kein Service angegeben."
  show_help
  exit 1
fi

# Den übergebenen Service verarbeiten
SERVICE=$1

# Einloggen bei Docker Hub
echo "🔐 Bei Docker Hub einloggen..."
echo "Bitte geben Sie Ihre Docker Hub Anmeldedaten ein:"
docker login

# Je nach übergebenem Service den entsprechenden Container bauen und pushen
case $SERVICE in
  "frontend")
    build_and_push "frontend" "./frontend/Dockerfile" "--build-arg VITE_API_URL=/api"
    ;;
  "backend")
    build_and_push "backend" "./backend/Dockerfile"
    ;;
  "ocr-service")
    build_and_push "ocr-service" "./ocr-service/Dockerfile"
    ;;
  *)
    echo "❌ Fehler: Unbekannter Service '$SERVICE'"
    show_help
    exit 1
    ;;
esac

echo "🎉 Das Image wurde erfolgreich gebaut und zu Docker Hub gepusht!"
echo "Image: ${DOCKER_USERNAME}/study-space-${SERVICE}:latest (${VERSION})"

# Ausloggen vom Docker Hub
docker logout

echo "🔚 Fertig!"