import fitz
import easyocr
import os
from typing import List, Optional, Tuple
import sys
import argparse
import concurrent.futures

def convert_pdf_to_images(pdf_file: str, show_progress: bool = True) -> Tuple[bool, List[str], Optional[str]]:
    generated_images = []
    if not os.path.exists(pdf_file):
        return False, [], f"The file '{pdf_file}' does not exist."
    try:
        with fitz.open(pdf_file) as doc:
            zoom = 1.5  # further reduced zoom factor to mitigate segmentation fault issues
            mat = fitz.Matrix(zoom, zoom)
            base_name = os.path.splitext(os.path.basename(pdf_file))[0]
            output_dir = os.path.dirname(os.path.abspath(pdf_file))
            os.makedirs(output_dir, exist_ok=True)
            page_count = len(doc)
            for i in range(page_count):
                try:
                    val = f"{base_name}_page_{i+1}.png"
                    output_path = os.path.join(output_dir, val)
                    page = doc.load_page(i)
                    pix = page.get_pixmap(matrix=mat)
                    pix.save(output_path)
                    generated_images.append(output_path)
                except Exception as e:
                    continue
        return True, generated_images, None
    except Exception as e:
        return False, generated_images, f"Error processing PDF file: {str(e)}"

def ocr_images(image_files: List[str], language: str, show_progress: bool = True, use_multithreading: bool = True) -> Tuple[bool, List[str], Optional[str]]:
    all_results = []
    if not image_files:
        return False, [], "No image files provided."
    missing_files = [img for img in image_files if not os.path.exists(img)]
    if missing_files:
        return False, [], f"The following image files do not exist: {', '.join(missing_files)}"
    try:
        reader = easyocr.Reader([language])
        def process_image(image_file):
            try:
                return reader.readtext(image_file, detail=0)
            except Exception:
                return []
        if use_multithreading:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                results = list(executor.map(process_image, image_files))
        else:
            results = [process_image(img) for img in image_files]
        for res in results:
            all_results.extend(res)
        return True, all_results, None
    except Exception as e:
        return False, all_results, f"Error during OCR processing: {str(e)}"

def cleanup_images(image_files: List[str]) -> None:
    # Löscht alle temporären Image-Dateien
    for img_file in image_files:
        try:
            os.remove(img_file)
        except Exception:
            pass

def extract_text_from_pdf(pdf_file: str, language: str = 'en', show_progress: bool = True, use_multithreading: bool = True, allow_ocr: bool = True) -> str:
    # Direkt versuchen, Text aus dem PDF zu extrahieren
    try:
        doc = fitz.open(pdf_file)
        direct_text = ""
        for page in doc:
            direct_text += page.get_text("text")
        if direct_text.strip():
            return direct_text  # Gibt direkt extrahierten Text zurück, falls vorhanden
    except Exception:
        pass
    if not allow_ocr:
        return "Error: Kein Text im PDF gefunden und OCR ist deaktiviert."
    # Fallback: OCR-Verarbeitung
    success, image_files, error = convert_pdf_to_images(pdf_file, show_progress)
    if not success:
        return ""
    try:
        success, text_pieces, error = ocr_images(image_files, language, show_progress, use_multithreading)
        if not success:
            return ""
        return "\n".join(text_pieces)
    finally:
        cleanup_images(image_files)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Optimized OCR processing tool")
    parser.add_argument("pdf_file", help="Path to the PDF file to process")
    parser.add_argument("language", help="Language for OCR processing (e.g., 'en')")
    parser.add_argument("--output", required=True, help="Path to write output text file")
    parser.add_argument("--no-multithreading", action="store_true", help="Disable multithreading for OCR processing")
    parser.add_argument("--disable-ocr", action="store_true", help="Disable OCR fallback if kein Text extrahiert werden kann")
    args = parser.parse_args()
    
    use_multithreading = not args.no_multithreading
    allow_ocr = not args.disable_ocr
    full_text = extract_text_from_pdf(args.pdf_file, args.language, True, use_multithreading, allow_ocr)
    if not full_text or full_text.startswith("Error:"):
        sys.exit(1)
    with open(args.output, "w", encoding="utf-8") as f:
        f.write(full_text)
    print(os.path.abspath(args.output))