import fitz
import easyocr 
import os
import logging
from typing import List, Optional, Tuple
from tqdm import tqdm

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def convert_pdf_to_images(pdf_file: str, show_progress: bool = True) -> Tuple[bool, List[str], Optional[str]]:
    """
    Converts PDF pages to image files.
    
    Args:
        pdf_file: Path to the PDF file
        show_progress: Whether to display a progress bar
        
    Returns:
        Tuple containing (success, list of generated image files, error message)
    """
    generated_images = []
    
    # Check if the file exists
    if not os.path.exists(pdf_file):
        return False, [], f"The file '{pdf_file}' does not exist."
    
    try:
        doc = fitz.open(pdf_file)
        zoom = 4
        mat = fitz.Matrix(zoom, zoom)
        base_name = os.path.splitext(os.path.basename(pdf_file))[0]
        
        # Create the output directory if it doesn't exist
        output_dir = os.path.dirname(os.path.abspath(pdf_file))
        os.makedirs(output_dir, exist_ok=True)
        
        page_count = len(doc)
        
        # Use tqdm for progress bar if requested
        page_iterator = tqdm(range(page_count), desc="Converting PDF pages", disable=not show_progress) if show_progress else range(page_count)
        
        for i in page_iterator:
            try:
                val = f"{base_name}_page_{i+1}.png"
                output_path = os.path.join(output_dir, val)
                page = doc.load_page(i)
                pix = page.get_pixmap(matrix=mat)
                pix.save(output_path)
                generated_images.append(output_path)
                logging.info(f"Page {i+1}/{page_count} converted to: {val}")
            except Exception as e:
                logging.error(f"Error converting page {i+1}: {str(e)}")
        
        doc.close()
        return True, generated_images, None
    
    except Exception as e:
        error_msg = f"Error processing PDF file: {str(e)}"
        logging.error(error_msg)
        return False, generated_images, error_msg

def ocr_images(image_files: List[str], language: str, show_progress: bool = True) -> Tuple[bool, List[str], Optional[str]]:
    """
    Performs OCR on a list of images.
    
    Args:
        image_files: List of paths to image files
        language: The OCR language to use
        show_progress: Whether to display a progress bar
        
    Returns:
        Tuple containing (success, list of extracted text pieces, error message)
    """
    all_results = []
    
    # Check if image files are provided
    if not image_files:
        return False, [], "No image files provided."
    
    # Check if all specified image files exist
    missing_files = [img for img in image_files if not os.path.exists(img)]
    if missing_files:
        return False, [], f"The following image files do not exist: {', '.join(missing_files)}"
    
    try:
        reader = easyocr.Reader([language])
        
        # Use tqdm for progress bar if requested
        image_iterator = tqdm(image_files, desc="Performing OCR on images", disable=not show_progress) if show_progress else image_files
        
        for image_file in image_iterator:
            try:
                logging.info(f"Performing OCR on {image_file}...")
                result = reader.readtext(image_file, detail=0)
                all_results.extend(result)
                logging.info(f"OCR completed for {image_file}: {len(result)} text pieces found.")
                if show_progress:
                    image_iterator.set_postfix(text_pieces=len(result))
            except Exception as e:
                logging.error(f"Error during OCR for file {image_file}: {str(e)}")
                # Continue with the next file
        
        return True, all_results, None
    
    except Exception as e:
        error_msg = f"Error during OCR processing: {str(e)}"
        logging.error(error_msg)
        return False, all_results, error_msg

def extract_text_from_pdf(pdf_file: str, language: str = 'en', show_progress: bool = True) -> str:
    """
    Extracts text from a PDF file using OCR.
    
    Args:
        pdf_file: Path to the PDF file
        language: The OCR language to use (default: 'en')
        show_progress: Whether to display a progress bar
        
    Returns:
        A string containing all extracted text
    """
    logging.info(f"Starting text extraction from PDF: {pdf_file}")
    
    # Convert PDF to images
    success, image_files, error = convert_pdf_to_images(pdf_file, show_progress)
    if not success:
        logging.error(f"Failed to convert PDF to images: {error}")
        return ""
    
    # Perform OCR on the images
    success, text_pieces, error = ocr_images(image_files, language, show_progress)
    
    # Clean up temporary image files
    for img_file in image_files:
        try:
            os.remove(img_file)
            logging.debug(f"Removed temporary file: {img_file}")
        except Exception as e:
            logging.warning(f"Failed to remove temporary file {img_file}: {e}")
    
    if not success:
        logging.error(f"OCR processing failed: {error}")
        return ""
    
    # Combine all text pieces into a single string with spacing between elements
    combined_text = "\n".join(text_pieces)
    
    logging.info(f"Successfully extracted {len(text_pieces)} text pieces from PDF")
    return combined_text

# Example usage:
if __name__ == "__main__":
    try:
        # Process command line arguments
        import sys
        import argparse
        
        parser = argparse.ArgumentParser(description="OCR processing tool")
        parser.add_argument("pdf_file", help="Path to the PDF file to process")
        parser.add_argument("language", help="Language for OCR processing (e.g., 'en' for English)")
        parser.add_argument("--no-progress", action="store_true", help="Disable progress bars")
        
        args = parser.parse_args()
        
        show_progress = not args.no_progress
        
        success, images, error = convert_pdf_to_images(args.pdf_file, show_progress)
        if not success:
            logging.error(f"PDF conversion failed: {error}")
            sys.exit(1)
            
        success, text_results, error = ocr_images(images, args.language, show_progress)
        if not success:
            logging.error(f"OCR processing failed: {error}")
            sys.exit(1)
            
        # Output the results
        print(f"Recognized text ({len(text_results)} pieces):")
        for i, text in enumerate(text_results):
            print(f"{i+1}. {text}")
            
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        sys.exit(1)