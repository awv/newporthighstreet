import os
import json
import re

content_dir = "content"
output_file = "research_ledger.json"

def get_meta(text, key):
    match = re.search(f"^{key}\\s*:\\s*(.*)", text, re.IGNORECASE | re.MULTILINE)
    return match.group(1).strip() if match else "Missing"

def get_intro(text):
    # Searches for the content between the wiki-intro-text tags
    match = re.search(r'<p class="wiki-intro-text">([\s\S]*?)</p>', text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return "No intro written yet."

def natural_sort_key(s):
    # Splits 'no11a' into (11, 'a') so it sorts correctly
    match = re.search(r'no(\d+)([a-z]*)', s.lower())
    if match:
        return (int(match.group(1)), match.group(2))
    return (0, s)

def generate_ledger():
    ledger = []
    if not os.path.exists(content_dir): return

    # Get all .md files and sort them naturally (11, 11a, 11b, 12)
    files = [f for f in os.listdir(content_dir) if f.endswith(".md")]
    files.sort(key=natural_sort_key)

    for filename in files:
        with open(os.path.join(content_dir, filename), "r", encoding="utf-8") as f:
            content = f.read()
            
            property_data = {
                "id": filename.replace(".md", ""),
                "status": get_meta(content, "status"),
                "intro": get_intro(content),
                "key_use": get_meta(content, "key use"),
                "year": get_meta(content, "year"),
                "has_photo": "Yes" if "placeholder.jpg" not in get_meta(content, "photo") else "No"
            }
            ledger.append(property_data)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(ledger, f, indent=4)
    print(f"✔ Ledger updated with {len(ledger)} properties (including sub-divisions).")

if __name__ == "__main__":
    generate_ledger()