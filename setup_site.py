import os

# --- CONFIGURATION ---
# Adjust the range based on how many properties are on the street
# High Street Newport usually goes up to roughly 150
start_no = 1
end_no = 84

# Paths relative to the root
content_dir = "content"
assets_base = "assets/images/properties"
subfolders = ["adverts", "photos", "present"]

# The placeholder template for your Markdown files
md_template = """---
status: TBC
photo: placeholder.jpg
key use: TBC
year: TBC
architect: TBC
listing: TBC
---

# History of No. {number} High Street

Research in progress.
"""

def initialise_site():
    # Ensure base directories exist
    if not os.path.exists(content_dir):
        os.makedirs(content_dir)
        print(f"✔ Created {content_dir}")

    for i in range(start_no, end_no + 1):
        id = f"no{i}"
        
        # 1. Create the Markdown File
        md_path = os.path.join(content_dir, f"{id}.md")
        if not os.path.exists(md_path):
            with open(md_path, "w", encoding="utf-8") as f:
                f.write(md_template.format(number=i))
        
        # 2. Create the Image Folders
        property_assets = os.path.join(assets_base, id)
        for folder in subfolders:
            path = os.path.join(property_assets, folder)
            if not os.path.exists(path):
                os.makedirs(path)
                
    print(f"✔ Successfully initialised {end_no} building placeholders and folder structures.")

if __name__ == "__main__":
    initialise_site()