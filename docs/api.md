# Backend API Documentation

## Table of Contents
- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-1)
  - [Projects](#projects)
  - [Files](#files)
  - [Sources](#sources)
  - [AI Features (Ollama)](#ai-features-ollama)

## Overview
The backend API provides endpoints for managing users, projects, files, and sources. It also integrates with AI services for summarization and OCR processing.

### Base URL
`http://localhost:<backend_port>/api`

### Authentication
All endpoints (except authentication routes) require a Bearer token for authentication.

### Endpoints

#### Authentication
- **POST /auth/register**: Register a new user.
  - **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string",
      "name": "string",
      "username": "string"
    }
    ```
  - **Responses**:
    - 201: User created successfully.
      ```json
      {
        "accessToken": "string"
      }
      ```
    - 400: Invalid input data.
    - 409: Email already exists.

- **POST /auth/login**: Login and retrieve a JWT token.
  - **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - **Responses**:
    - 200: Login successful.
      ```json
      {
        "accessToken": "string"
      }
      ```
    - 401: Invalid credentials.

- **POST /auth/refresh**: Refresh the authentication token.
  - **Responses**:
    - 200: New token generated.
      ```json
      {
        "accessToken": "string"
      }
      ```
    - 401: Invalid or expired refresh token.

- **POST /auth/logout**: Logout the user.
  - **Responses**:
    - 200: Logout successful.
      ```json
      {
        "message": "Logged out successfully"
      }
      ```
    - 401: Not authenticated.

- **GET /auth/me**: Retrieve the current user's profile.
  - **Responses**:
    - 200: User profile data.
      ```json
      {
        "user_id": "integer",
        "email": "string",
        "username": "string",
        "role": "string",
        "created_at": "string",
        "updated_at": "string"
      }
      ```
    - 401: Not authenticated.

#### Projects
- **POST /projects**: Create a new project.
  - **Request Body**:
    ```json
    {
      "name": "string",
      "description": "string"
    }
    ```
  - **Responses**:
    - 201: Project created successfully.
      ```json
      {
        "project_id": "integer",
        "name": "string",
        "description": "string",
        "user_id": "integer",
        "created_at": "string",
        "updated_at": "string"
      }
      ```
    - 401: Unauthorized.

- **GET /projects**: Retrieve all projects for the authenticated user.
  - **Responses**:
    - 200: List of projects.
      ```json
      [
        {
          "project_id": "integer",
          "name": "string",
          "description": "string",
          "user_id": "integer",
          "created_at": "string",
          "updated_at": "string"
        }
      ]
      ```
    - 401: Unauthorized.

- **GET /projects/{id}**: Retrieve a project by ID.
  - **Parameters**:
    - `id` (path): Project ID (integer).
  - **Responses**:
    - 200: Project details.
      ```json
      {
        "project_id": "integer",
        "name": "string",
        "description": "string",
        "user_id": "integer",
        "created_at": "string",
        "updated_at": "string"
      }
      ```
    - 400: Invalid project ID.
    - 401: Unauthorized.
    - 404: Project not found.

- **PUT /projects/{id}**: Update a project.
  - **Parameters**:
    - `id` (path): Project ID (integer).
  - **Request Body**:
    ```json
    {
      "name": "string",
      "description": "string"
    }
    ```
  - **Responses**:
    - 200: Updated project details.
      ```json
      {
        "project_id": "integer",
        "name": "string",
        "description": "string",
        "user_id": "integer",
        "created_at": "string",
        "updated_at": "string"
      }
      ```
    - 400: Invalid project ID.
    - 401: Unauthorized.
    - 404: Project not found.

- **DELETE /projects/{id}**: Delete a project.
  - **Parameters**:
    - `id` (path): Project ID (integer).
  - **Responses**:
    - 204: Project successfully deleted.
    - 400: Invalid project ID.
    - 401: Unauthorized.
    - 404: Project not found.

#### Files
- **POST /files/upload**: Upload a new file.
  - **Request Body** (multipart/form-data):
    - `file`: File to upload.
    - `user_id`: ID of the user uploading the file (integer).
    - `project_id`: ID of the project the file belongs to (integer).
  - **Responses**:
    - 201: File successfully uploaded.
      ```json
      {
        "file_id": "string",
        "name": "string",
        "size": "integer",
        "type": "string",
        "url": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
      ```
    - 400: Invalid request.

- **GET /files/project/{projectId}**: Retrieve all files for a specific project.
  - **Parameters**:
    - `projectId` (path): Project ID (integer).
  - **Responses**:
    - 200: List of files for the project.
      ```json
      [
        {
          "file_id": "string",
          "name": "string",
          "size": "integer",
          "type": "string",
          "url": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
      ```
    - 400: Invalid project ID.

- **GET /files/{id}**: Retrieve a file by ID.
  - **Parameters**:
    - `id` (path): File ID (string).
  - **Responses**:
    - 200: File details.
      ```json
      {
        "file_id": "string",
        "name": "string",
        "size": "integer",
        "type": "string",
        "url": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
      ```
    - 404: File not found.

- **DELETE /files/{id}**: Delete a file.
  - **Parameters**:
    - `id` (path): File ID (string).
  - **Responses**:
    - 200: File successfully deleted.
      ```json
      {
        "message": "File deleted successfully"
      }
      ```
    - 404: File not found.

#### Sources
- **POST /sources**: Create a new source.
  - **Request Body**:
    ```json
    {
      "status": "string",
      "source_file_id": "string",
      "text_file_id": "string",
      "summary_file_id": "string"
    }
    ```
  - **Responses**:
    - 201: Source successfully created.
      ```json
      {
        "source_id": "string",
        "status": "string",
        "created_at": "string",
        "updated_at": "string",
        "source_file_id": "string",
        "text_file_id": "string",
        "summary_file_id": "string"
      }
      ```
    - 500: Server error.

- **GET /sources**: Retrieve all sources.
  - **Responses**:
    - 200: List of all sources.
      ```json
      [
        {
          "source_id": "string",
          "status": "string",
          "created_at": "string",
          "updated_at": "string",
          "source_file_id": "string",
          "text_file_id": "string",
          "summary_file_id": "string"
        }
      ]
      ```
    - 500: Server error.

- **GET /sources/{id}**: Retrieve a source by ID.
  - **Parameters**:
    - `id` (path): Source ID (string).
  - **Responses**:
    - 200: Source details.
      ```json
      {
        "source_id": "string",
        "status": "string",
        "created_at": "string",
        "updated_at": "string",
        "source_file_id": "string",
        "text_file_id": "string",
        "summary_file_id": "string"
      }
      ```
    - 404: Source not found.

- **PATCH /sources/{id}/status**: Update the status of a source.
  - **Parameters**:
    - `id` (path): Source ID (string).
  - **Request Body**:
    ```json
    {
      "status": "string"
    }
    ```
  - **Responses**:
    - 200: Source status successfully updated.
      ```json
      {
        "source_id": "string",
        "status": "string",
        "created_at": "string",
        "updated_at": "string",
        "source_file_id": "string",
        "text_file_id": "string",
        "summary_file_id": "string"
      }
      ```
    - 400: Status field is required.
    - 404: Source not found.

#### AI Features (Ollama)
- **POST /ollama/summarize/{sourceId}**: Summarize a source.
  - **Parameters**:
    - `sourceId` (path): Source ID (string).
  - **Responses**:
    - 200: Summary created successfully.
    - 400: Invalid request.

- **POST /ollama/generate-project-title/{projectId}**: Generate a project title.
  - **Parameters**:
    - `projectId` (path): Project ID (string).
  - **Responses**:
    - 200: Project title created successfully.
    - 400: Invalid request.

- **GET /ollama/models**: Retrieve available AI models.
  - **Responses**:
    - 200: List of available models.
    - 500: Server error.

- **POST /ollama/summarize-project/{projectId}**: Summarize an entire project.
  - **Parameters**:
    - `projectId` (path): Project ID (string).
  - **Responses**:
    - 200: Project summary created successfully.
    - 400: Invalid request.

---

# OCR Service Documentation

## Table of Contents
- [Overview](#overview-1)
- [Base URL](#base-url-1)
- [Endpoints](#endpoints-1)
  - [General](#general)
  - [OCR Processing](#ocr-processing)
- [Swagger Documentation](#swagger-documentation)
- [Example Usage](#example-usage)
  - [cURL](#curl)
  - [JavaScript (fetch)](#javascript-fetch)

## Overview
The OCR service is a FastAPI-based REST API for extracting text from PDF documents using OCR (Optical Character Recognition).

### Base URL
`http://localhost:8000`

### Endpoints

#### General
- **GET /**: Check the service status.
- **GET /health**: Perform a health check.

#### OCR Processing
- **POST /ocr**: Perform OCR on a PDF file and return the extracted text.
  - Parameters:
    - `file`: PDF file (required).
    - `language`: Language for OCR (default: "en").
    - `use_multithreading`: Enable multithreading (default: true).
    - `allow_ocr`: Enable OCR fallback (default: true).

- **POST /ocr/save**: Perform OCR and save the extracted text to a file.
  - Parameters: Same as `/ocr`.

### Swagger Documentation
The API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Example Usage

#### cURL
```bash
curl -X POST "http://localhost:8000/ocr" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf" \
  -F "language=en"
```

#### JavaScript (fetch)
```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('language', 'en');

fetch('http://localhost:8000/ocr', {
  method: 'POST',
  body: formData,
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```