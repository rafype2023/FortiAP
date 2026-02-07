import pandas as pd
import re
import os

INPUT_FILE = 'source_docs/AP INFO.xlsx'

def inspect_excel():
    print("--- EXCEL PATTERNS ---")
    try:
        df = pd.read_excel(INPUT_FILE, header=2)
        
        # Analyze Name patterns
        names = df['Name'].dropna().astype(str).tolist()
        prefixes = set()
        for n in names:
            # Extract potential prefix (e.g. "MR1130-...", "FIS-...")
            parts = n.split('-')
            if len(parts) > 1:
                prefixes.add(parts[0])
        print("Unique Name Prefixes:", sorted(list(prefixes)))
        
        # Analyze WTP_ID prefixes
        ids = df['WTP_ID'].dropna().astype(str).tolist()
        id_prefixes = set([i[:6] for i in ids])
        print("Unique WTP_ID Prefixes:", id_prefixes)
        
    except Exception as e:
        print(f"Error reading Excel: {e}")

inspect_excel()
