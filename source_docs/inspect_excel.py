
import pandas as pd

try:
    # Read with header at row 3 (index 2)
    df = pd.read_excel('AP INFO.xlsx', header=2)
    print("Columns:", df.columns.tolist())
    print("First 5 rows:")
    # Print the first few columns
    print(df.iloc[:, :5].head().to_string())
except Exception as e:
    print("Error reading Excel file:", e)
