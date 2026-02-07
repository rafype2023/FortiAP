import pandas as pd

INPUT_FILE = 'source_docs/AP INFO.xlsx'

try:
    df = pd.read_excel(INPUT_FILE, header=2)
    print("Columns:", df.columns.tolist())
    
    # Print first few rows to see data samples
    print("\nFirst 3 rows:")
    print(df.head(3).to_string())

    # Check for "Model" or similar
    print("\nUnique values in potentially relevant columns:")
    for col in df.columns:
        col_str = str(col).lower()
        if 'model' in col_str or 'part' in col_str or 'type' in col_str:
            print(f"\n--- {col} ---")
            print(df[col].unique())
            
        if 'site' in col_str or 'loc' in col_str or 'build' in col_str:
            print(f"\n--- {col} ---")
            print(df[col].unique())
            
        if 'name' in col_str:
             print(f"\n--- {col} (First 10) ---")
             print(df[col].head(10).tolist())

except Exception as e:
    print(f"Error: {e}")
