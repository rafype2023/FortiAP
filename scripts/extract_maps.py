import pymupdf
import os
import re

PDF_PATH = 'source_docs/2025 FortiAP Refresh Proposal rev0821.pdf'
OUTPUT_DIR = 'public/maps'

# Mapping adjustments based on inspection
SITE_MAP = {
    'MR1130': 'MR1130',
    'MR876': 'MR876',
    'Santurce': 'Santurce',
    'SANTURCE': 'Santurce'
}

def extract_maps():
    if not os.path.exists(PDF_PATH):
        print(f"Error: PDF not found at {PDF_PATH}")
        return

    doc = pymupdf.open(PDF_PATH)
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print(f"Opened PDF with {len(doc)} pages.")

    count = 0
    for i, page in enumerate(doc):
        text = page.get_text()
        
        # Identify Site
        site = None
        if 'MR1130' in text: site = 'MR1130'
        elif 'MR876' in text: site = 'MR876'
        elif 'Santurce' in text or 'SANTURCE' in text: site = 'Santurce'
        
        # Identify Floor
        floor_id = None
        
        # MR1130 Patterns
        if site == 'MR1130':
            if 'Floor 1' in text or '1st Floor' in text: floor_id = 'mr1130-floor-1'
            elif 'Floor 2' in text or '2nd Floor' in text: floor_id = 'mr1130-floor-2'
            elif 'Floor 3' in text or '3rd Floor' in text: floor_id = 'mr1130-floor-3'
            elif 'Floor 4' in text or '4th Floor' in text: floor_id = 'mr1130-floor-4'
            elif 'Penthouse' in text: floor_id = 'mr1130-ph'

        # MR876 Patterns
        elif site == 'MR876':
            if 'Floor 2' in text or '2nd Floor' in text: floor_id = 'mr876-floor-2'
            elif 'Floor 3' in text or '3rd Floor' in text: floor_id = 'mr876-floor-3'

        # Santurce Patterns
        elif site == 'Santurce':
            if 'Floor 1' in text or '1st Floor' in text: floor_id = 'santurce-floor-1'
            elif 'Floor 2' in text or '2nd Floor' in text: floor_id = 'santurce-floor-2'
            elif 'Floor 9' in text or '9th Floor' in text: floor_id = 'santurce-floor-9' # Common Santurce floors? checking...
            elif 'Floor 10' in text or '10th Floor' in text: floor_id = 'santurce-floor-10'
            elif 'Penthouse' in text: floor_id = 'santurce-ph'
            
        if not floor_id:
            # Try generic pattern if specific failed
            match = re.search(r'Floor\s+(\d+)', text)
            if match and site:
                floor_id = f"{site.lower()}-floor-{match.group(1)}"
        
        # Extract Images for ALL pages
        images = page.get_images()
        if images:
            # Find largest image (assume it's the map)
            best_img = None
            max_size = 0
            
            for img in images:
                xref = img[0]
                base_image = doc.extract_image(xref)
                size = base_image['width'] * base_image['height']
                
                # Filter out small icons/logos
                if size > 50000: 
                    if size > max_size:
                        max_size = size
                        best_img = base_image
            
            if best_img:
                image_bytes = best_img["image"]
                ext = best_img["ext"]
                
                if floor_id:
                    filename = f"{floor_id}.{ext}"
                else:
                    filename = f"unknown_page_{i+1}.{ext}"
                    
                filepath = os.path.join(OUTPUT_DIR, filename)
                
                with open(filepath, "wb") as f:
                    f.write(image_bytes)
                    
                print(f"Saved {filepath}")
                count += 1
            else:
                print(f"Page {i+1}: No suitable image found (>50kb).")
        else:
             print(f"Page {i+1}: No images.")

    print(f"Extraction complete. {count} images saved.")

if __name__ == "__main__":
    extract_maps()
