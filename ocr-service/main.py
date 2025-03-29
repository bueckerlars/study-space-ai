import os
import tempfile
from typing import Optional, List
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import uuid
from ocr import extract_text_from_pdf
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get configuration from environment variables
PORT = int(os.getenv("OCR_SERVICE_PORT", "8000"))
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app = FastAPI(
    title="OCR Service API",
    description="API for OCR processing of PDF documents",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Use allowed origins from environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "OCR Service is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/ocr")
async def perform_ocr(
    file: UploadFile = File(...),
    language: str = Form("en"),
    use_multithreading: bool = Form(True),
    allow_ocr: bool = Form(True)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Create temporary file to store the upload
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            # Write file to temporary file
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Apply OCR to the temporary file
        extracted_text = extract_text_from_pdf(
            temp_file_path,
            language=language,
            show_progress=True,
            use_multithreading=use_multithreading,
            allow_ocr=allow_ocr
        )
        
        # Delete temporary file
        os.unlink(temp_file_path)
        
        if not extracted_text or extracted_text.startswith("Error:"):
            return JSONResponse(
                status_code=422,
                content={"success": False, "error": extracted_text or "OCR could not extract any text"}
            )
        
        # Successful response
        return {
            "success": True,
            "filename": file.filename,
            "language": language,
            "text": extracted_text
        }
    
    except Exception as e:
        # Try to clean up temporary file if it exists
        try:
            if 'temp_file_path' in locals():
                os.unlink(temp_file_path)
        except:
            pass
        
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": f"Error during OCR processing: {str(e)}"}
        )

@app.post("/ocr/save")
async def perform_ocr_and_save(
    file: UploadFile = File(...),
    language: str = Form("en"),
    use_multithreading: bool = Form(True),
    allow_ocr: bool = Form(True)
):
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Create temporary file to store the upload
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            # Write file to temporary file
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Generate output file
        file_id = str(uuid.uuid4())
        output_filename = f"{file_id}_ocr.txt"
        output_dir = os.path.join(os.getcwd(), "output")
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, output_filename)
        
        # Apply OCR to the temporary file
        extracted_text = extract_text_from_pdf(
            temp_file_path,
            language=language,
            show_progress=True,
            use_multithreading=use_multithreading,
            allow_ocr=allow_ocr
        )
        
        # Delete temporary file
        os.unlink(temp_file_path)
        
        if not extracted_text or extracted_text.startswith("Error:"):
            return JSONResponse(
                status_code=422,
                content={"success": False, "error": extracted_text or "OCR could not extract any text"}
            )
        
        # Save text to output file
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(extracted_text)
        
        # Successful response
        return {
            "success": True,
            "filename": file.filename,
            "language": language,
            "file_id": file_id,
            "output_path": output_path
        }
    
    except Exception as e:
        # Try to clean up temporary file if it exists
        try:
            if 'temp_file_path' in locals():
                os.unlink(temp_file_path)
        except:
            pass
        
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": f"Error during OCR processing: {str(e)}"}
        )

if __name__ == "__main__":
    # Start the server with Uvicorn using port from environment
    uvicorn.run(app, host="0.0.0.0", port=PORT)