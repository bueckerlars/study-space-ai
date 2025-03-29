#!/bin/bash

# BuildAndPushAll.sh
# Script zum Bauen und Pushen aller Docker-Container

# Fehlgeschlagene Befehle stoppen das Skript
set -e

# Definiere Docker Hub Benutzername
# Bitte durch Ihren Docker Hub Benutzernamen ersetzen
DOCKER_USERNAME="larsbuecker"

# Optionen verarbeiten
VERSION=""

# Hilfe-Funktion
show_help() {
  echo "Verwendung: ./BuildAndPushAll.sh [OPTIONEN]"
  echo ""
  echo "Optionen:"
  echo "  -v, --version VERSION  Manuelle Versionsnummer anstatt Zeitstempel"
  echo "  -h, --help             Diese Hilfe anzeigen"
  echo ""
  echo "Beispiel: ./BuildAndPushAll.sh --version v1.0.0"
}

# Parameter verarbeiten
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -v|--version) VERSION="$2"; shift ;;
    -h|--help) show_help; exit 0 ;;
    *) echo "Unbekannte Option: $1"; show_help; exit 1 ;;
  esac
  shift
done

# Tag/Version für Images, falls nicht manuell gesetzt
if [ -z "$VERSION" ]; then
  VERSION=$(date +"%Y%m%d%H%M")
  echo "Keine Version angegeben. Verwende Zeitstempel: $VERSION"
else
  echo "Verwende manuelle Version: $VERSION"
fi

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

# Einloggen bei Docker Hub
echo "🔐 Bei Docker Hub einloggen..."
echo "Bitte geben Sie Ihre Docker Hub Anmeldedaten ein:"
docker login

# Alle Services bauen und pushen
build_and_push "frontend" "./frontend/Dockerfile" "--build-arg VITE_API_URL=/api"
build_and_push "backend" "./backend/Dockerfile"
build_and_push "ocr-service" "./ocr-service/Dockerfile"

echo "🎉 Alle Images wurden erfolgreich gebaut und zu Docker Hub gepusht!"
echo "Images:"
echo "- ${DOCKER_USERNAME}/study-space-frontend:latest (${VERSION})"
echo "- ${DOCKER_USERNAME}/study-space-backend:latest (${VERSION})"
echo "- ${DOCKER_USERNAME}/study-space-ocr-service:latest (${VERSION})"

# Ausloggen vom Docker Hub
docker logout

echo "🔚 Fertig!"