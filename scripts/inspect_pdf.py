import pymupdf

PDF_PATH = 'source_docs/2025 FortiAP Refresh Proposal rev0821.pdf'

def inspect_pdf_text():
    doc = pymupdf.open(PDF_PATH)
    print(f"Total Pages: {len(doc)}")
    
    for i, page in enumerate(doc):
        text = page.get_text()
        first_lines = "\n".join(text.split('\n')[:5])
        print(f"\n--- Page {i+1} ---")
        print(first_lines)
        
        # Check for keywords
        if "MR1130" in text: print("[MATCH] MR1130")
        if "MR876" in text: print("[MATCH] MR876")
        if "Santurce" in text or "SANTURCE" in text: print("[MATCH] Santurce")

if __name__ == "__main__":
    inspect_pdf_text()
