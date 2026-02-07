import pandas as pd

INPUT_FILE = 'source_docs/AP INFO.xlsx'

def check_421():
    try:
        df = pd.read_excel(INPUT_FILE, header=2)
        df['WTP_ID'] = df['WTP_ID'].astype(str)
        
        # Filter 421-E
        df_421 = df[df['WTP_ID'].str.startswith('FP421E')]
        
        print(f"Found {len(df_421)} APs with model 421-E")
        print("Names:")
        for n in sorted(df_421['Name'].dropna().unique()):
            print(n)
            
    except Exception as e:
        print(f"Error: {e}")

check_421()
