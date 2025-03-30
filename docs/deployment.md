# Deployment Documentation

## Table of Contents
- [Local Development](#local-development)
  - [Running Locally](#running-locally)
- [Building and Running Containers Locally](#building-and-running-containers-locally)
  - [Using Docker Compose](#using-docker-compose)
- [Deployment via DockerHub](#deployment-via-dockerhub)
- [Environment Variables](#environment-variables)

## Local Development

### Running Locally

To run the application locally for development purposes, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your_repository_url>
   cd StudySpace.AI
   ```

2. **Install dependencies:**
   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm install
     ```
   - OCR Service:
     ```bash
     cd ../ocr-service
     pip install -r requirements.txt
     ```

3. **Set up environment variables:**
   - Create `.env` files in the `backend`, `frontend`, and `ocr-service` directories based on the provided examples. Refer to the [Environment Variables Documentation](docs/enviroment.md) for details.

4. **Run the services:**
   - Backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm run dev
     ```
   - OCR Service:
     ```bash
     cd ../ocr-service
     python main.py
     ```

## Building and Running Containers Locally

### Using Docker Compose

To build and run the application using Docker Compose, follow these steps:

1. **Ensure Docker is installed:**
   - Install Docker Desktop from [Docker's official website](https://www.docker.com/).

2. **Navigate to the project directory:**
   ```bash
   cd StudySpace.AI
   ```

3. **Run the containers:**
   ```bash
   docker-compose -f dev-docker-compose.yml up --build
   ```
   This command will:
   - Build the Docker images for the `frontend`, `backend`, and `ocr-service`.
   - Start the services defined in [`dev-docker-compose.yml`](../dev-docker-compose.yml).

   For production deployments, you can use the [`docker-compose.yml`](../docker-compose.yml) file:
   ```bash
   docker-compose -f docker-compose.yml up --build
   ```

4. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000) 
   - Backend API: [http://localhost:5066](http://localhost:5066)
   - OCR Service: [http://localhost:8000](http://localhost:8000)

5. **Stop the containers:**
   ```bash
   docker-compose -f dev-docker-compose.yml down
   ```

## Deployment via DockerHub

To deploy the application using DockerHub, follow these steps:

1. **Pull and run the images on the target server:**
   - Backend:
     ```bash
     docker pull larsbuecker/studyspace-backend:latest
     docker run -d -p 5066:5066 --env-file .env larsbuecker/studyspace-backend:latest
     ```
   - Frontend:
     ```bash
     docker pull larsbuecker/studyspace-frontend:latest
     docker run -d -p 3000:80 larsbuecker/studyspace-frontend:latest
     ```
   - OCR Service:
     ```bash
     docker pull larsbuecker/studyspace-ocr-service:latest
     docker run -d -p 8000:8000 --env-file .env larsbuecker/studyspace-ocr-service:latest
     ```

2. **Verify the deployment:**
   - Ensure all services are running and accessible at their respective endpoints.

## Environment Variables

For a detailed explanation of all environment variables and an example configuration, refer to the [Environment Variables Documentation](docs/enviroment.md).