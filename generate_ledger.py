import os
import json
import re
from collections import Counter

content_dir = "content"
image_root = "assets/images/properties"
output_file = "research_ledger.json"

def get_meta(text, key):
    match = re.search(f"^{key}\\s*:\\s*(.*)", text, re.IGNORECASE | re.MULTILINE)
    return match.group(1).strip() if match else "TBC"

def get_intro(text):
    match = re.search(r'<p class="wiki-intro-text">([\s\S]*?)</p>', text, re.IGNORECASE)
    return match.group(1).strip() if match else "No intro written yet."

def get_images(building_id, category):
    """Scans the image folders automatically for adverts or present-day photos."""
    path = os.path.join(image_root, building_id, category)
    if os.path.exists(path):
        # Grabs .jpg, .png, .webp etc.
        valid_ext = ('.jpg', '.jpeg', '.png', '.webp', '.gif')
        return [f for f in os.listdir(path) if f.lower().endswith(valid_ext)]
    return []

def natural_sort_key(s):
    match = re.search(r'no(\d+)([a-z]*)', s.lower())
    if match:
        return (int(match.group(1)), match.group(2))
    return (0, s)

def generate_ledger():
    ledger = []
    status_counts = Counter()

    if not os.path.exists(content_dir):
        print(f"Error: Folder '{content_dir}' not found.")
        return

    # Updated to be case-insensitive (.md or .MD) to ensure no files are missed
    files = [f for f in os.listdir(content_dir) if f.lower().endswith(".md")]
    files.sort(key=natural_sort_key)

    for filename in files:
        building_id = filename.replace(".md", "").replace(".MD", "")
        with open(os.path.join(content_dir, filename), "r", encoding="utf-8") as f:
            content = f.read()
            
            status = get_meta(content, "status")
            status_counts[status] += 1

            property_data = {
                "id": building_id,
                "status": status,
                "intro": get_intro(content),
                "key_use": get_meta(content, "key use"),
                "year": get_meta(content, "year"),
                "has_photo": "Yes" if "placeholder.jpg" not in get_meta(content, "photo") else "No",
                # NEW: Automated image lists
                "adverts": get_images(building_id, "adverts"),
                "photos": get_images(building_id, "present")
            }
            ledger.append(property_data)

    # Save the ledger
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(ledger, f, indent=4)

    # --- THE RESEARCH TALLY ---
    print("\n" + "="*30)
    print(" NEWPORT CORNUCOPIA LEDGER ")
    print("="*30)
    print(f"Total properties scanned: {len(ledger)}")
    print("-" * 30)
    
    for stat, count in sorted(status_counts.items()):
        print(f"{stat.ljust(20)}: {count}")
    
    print("="*30)
    print(f"✔ '{output_file}' updated with automated gallery data.\n")

if __name__ == "__main__":
    generate_ledger()