
import pandas as pd
import json
import os

INPUT_FILE = 'source_docs/AP INFO.xlsx'
OUTPUT_DIR = 'public/data'
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'aps.json')

import pandas as pd
import json
import os
import re

INPUT_FILE = 'source_docs/AP INFO.xlsx'
OUTPUT_DIR = 'public/data'
OUTPUT_APS = os.path.join(OUTPUT_DIR, 'aps.json')
OUTPUT_MAPS = os.path.join(OUTPUT_DIR, 'maps.json')

def get_site_floor(name):
    # Default
    site = 'Unknown'
    floor_name = 'Unknown'
    floor_id = 'unknown'

    # MR876
    # Pattern: AP87602... -> Floor 2
    if name.startswith('AP876'):
        site = 'MR876'
        # Extract floor digit
        match = re.search(r'AP8760?(\d)', name)
        if match:
            f_num = match.group(1)
            floor_name = f"Floor {f_num}"
            floor_id = f"mr876-floor-{f_num}"
        else:
            floor_name = "General"
            floor_id = "mr876-general"

    # Santurce
    # Pattern: APSA01... -> Floor 1
    elif name.startswith('APSA'):
        site = 'Santurce'
        if name.startswith('APSAPH'):
            floor_name = "Penthouse"
            floor_id = "santurce-ph"
        else:
            match = re.search(r'APSA0?(\d)', name)
            if match:
                f_num = match.group(1)
                floor_name = f"Floor {f_num}"
                floor_id = f"santurce-floor-{f_num}"
            else:
                floor_name = "General"
                floor_id = "santurce-general"

    # MR1130
    # Pattern: AP01... -> Floor 1, APPH -> Penthouse
    elif name.startswith('AP') and (name[2].isdigit() or name.startswith('APPH') or name.startswith('APBR')):
        site = 'MR1130'
        if name.startswith('APPH'):
            floor_name = "Penthouse"
            floor_id = "mr1130-ph"
        elif name.startswith('AP0'):
            match = re.search(r'AP0?(\d)', name)
            if match:
                f_num = match.group(1)
                floor_name = f"Floor {f_num}"
                floor_id = f"mr1130-floor-{f_num}"
        else:
             floor_name = "General"
             floor_id = "mr1130-general"
    
    return site, floor_name, floor_id

def process_data():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: Input file '{INPUT_FILE}' not found.")
        return

    try:
        df = pd.read_excel(INPUT_FILE, header=2)
        df.columns = [str(c).strip() for c in df.columns]
        
        # Filter for 421-E model (WTP_ID starts with FP421E)
        df['WTP_ID'] = df['WTP_ID'].astype(str)
        df = df[df['WTP_ID'].str.startswith('FP421E')]
        
        aps = df.to_dict(orient='records')
        
        processed_aps = []
        maps_registry = {} # Use dict to deduplicate maps

        for ap in aps:
            name = str(ap.get('Name', ''))
            wtp = str(ap.get('WTP_ID', ''))
            
            site, floor_name, floor_id = get_site_floor(name)
            
            # Skip if unknown site (e.g. APVI)
            if site == 'Unknown':
                continue

            # Register Map/Floor if new
            if floor_id not in maps_registry:
                # Try to find matching image
                image_path = '/maps/placeholder.png'
                
                # Variations to check
                # 1. Exact match (e.g. mr1130-floor-1.jpeg)
                # 2. Capitalized Site (e.g. MR876-floor1.jpeg)
                # 3. No hyphen before number (e.g. MR876-floor1.jpeg)
                
                candidates = [
                    f"{floor_id}.jpeg",
                    f"{floor_id}.jpg",
                    f"{floor_id}.png",
                ]
                
                # Special handling for user-provided formats
                if site == 'MR876':
                    # User format: MR876-floor#.jpg
                    # floor_id is mr876-floor-#
                    parts = floor_id.split('-') # ['mr876', 'floor', '2']
                    if len(parts) == 3:
                        candidates.append(f"MR876-floor{parts[2]}.jpeg")
                        candidates.append(f"MR876-floor{parts[2]}.jpg")
                        
                if site == 'Santurce':
                     # Check capital S
                     candidates.append(f"{floor_id.replace('santurce', 'Santurce')}.jpeg")

                for cand in candidates:
                    full_cand_path = os.path.join('public/maps', cand)
                    if os.path.exists(full_cand_path):
                        image_path = f"/maps/{cand}"
                        break
                
                maps_registry[floor_id] = {
                    'id': floor_id,
                    'name': floor_name,
                    'site': site,
                    'image': image_path
                }

            processed_aps.append({
                'id': wtp,
                'name': name,
                'status': str(ap.get('Connection_State', 'Unknown')),
                'ip': str(ap.get('Local_IP', '')),
                'model': '421-E',
                'serial': wtp,
                'location': {
                    'x': 0, 
                    'y': 0, 
                    'floor_id': floor_id # Pre-assign to floor
                },
                'site': site,       # Helper for frontend
                'floorName': floor_name # Helper for frontend
            })
            
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # Write APs
        with open(OUTPUT_APS, 'w') as f:
            json.dump(processed_aps, f, indent=2)
            
        # Write Maps
        maps_list = sorted(list(maps_registry.values()), key=lambda x: (x['site'], x['name']))
        with open(OUTPUT_MAPS, 'w') as f:
            json.dump(maps_list, f, indent=2)
            
        print(f"Processed {len(processed_aps)} APs.")
        print(f"Generated {len(maps_list)} floors across {len(set(m['site'] for m in maps_list))} sites.")
        
    except Exception as e:
        print(f"Error processing data: {e}")

if __name__ == "__main__":
    process_data()
