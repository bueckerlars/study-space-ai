# StudySpace.AI

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Features](#features)
- [Future Features](#future-features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment Documentation](docs/deployment.md)
- [Environment Variables Documentation](docs/enviroment.md)
- [Contributing](#contributing)
- [License](#license)

## Overview

StudySpace.AI is a SaaS platform designed to help students process and manage their documents effectively using AI. It offers features like PDF OCR, AI-powered project summarization, title generation, and theme extraction from documents. Planning tools for modules, projects, deadlines, and tasks will be implemented in the future.

## Tech Stack

### Frontend
- React + TypeScript + Vite
- TailwindCSS
- ShadcnUI
- Axios

### Backend
- NodeJS + TypeScript
- Database: PostgreSQL / MySQL
- Multer (for file storage)
- Express (for API)
- Swagger (for API documentation)
- Python (for OCR service)
- Ollama (for AI processing)

## Features

- User Authentication (JWT)
- PDF OCR
- AI-Powered Features:
    - Project Summarization
    - Project Title Generation
    - Theme Extraction from Documents

## Future Features

- Planning:
    - Modules
    - Projects
    - Deadlines (with AI recognition and tracking)
    - Tasks (can be AI-generated and assigned to deadlines)
    - Learning Plans (composed of content and tasks)
- Pomodoro Timer (for task tracking)

## Getting Started

These instructions will guide you on how to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

Make sure you have the following installed:

- Node.js (LTS version recommended)
- npm or yarn
- PostgreSQL or MySQL
- Python 3.x
- Ollama (installation instructions can be found on the official Ollama website)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bueckerlars/study-space-ai.git
    cd StudySpace.AI
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    # or
    yarn install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    # or
    yarn install
    ```

4.  **Set up environment variables:**
    - Create `.env` files in both the `backend`, `frontend` and `root` directories based on the `.env.example` files (if provided). Configure your database connection details, API keys, etc.

5.  **Set up the database:**
    - Create the necessary database and run migrations (if applicable, refer to backend documentation for specific instructions).

6.  **Install Python OCR service dependencies:**
    ```bash
    cd ../backend/python_ocr_service
    pip install -r requirements.txt
    ```

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd ./backend
    npm run dev
    # or
    yarn dev
    ```
    (This command might vary depending on your `package.json` scripts)

2.  **Start the frontend development server:**
    ```bash
    cd ./frontend
    npm run dev
    # or
    yarn dev
    ```

The frontend application should now be running at `http://localhost:<frontend_port>` (usually `3000` or `5173`), and the backend API at `http://localhost:<backend_port>` (usually `5066`).

## API Documentation

The backend API documentation will be available at `/api-docs` endpoint once the backend server is running (e.g., `http://localhost:<backend_port>/api-docs`).

For detailed API documentation, refer to the [API Documentation](docs/api.md).

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.
