# Newport Cornucopia: High Street Research Project

A digital archive and research ledger dedicated to the architectural and social history of Newport High Street, Wales. This project uses a flat-file Markdown system to track property histories across over 150 individual plots.

---

## 📁 Project Structure

* **`/content`**: Contains individual `.md` files for every property (e.g., `no32.md`).
* **`/assets/images/properties`**: Organised by property ID.
    * `[id]/adverts/`: Historical newspaper clippings and adverts.
    * `[id]/present/`: Contemporary "as it stands" photography.
* **`generate_ledger.py`**: Python script that scans content and updates the JSON database.
* **`status.html`**: The visual research dashboard and progress tracker.
* **`template.html`**: The master layout for individual property pages.
* **`wiki.js` / `wiki.css`**: The logic and styling for individual property pages.

---

## 🏗 Workflow: Adding or Updating a Property

### 1. The Metadata Block (Frontmatter)
Every property file must start with a metadata block between `---` lines. This powers the **Fast Facts** table and the **Research Ledger**.

```markdown
---
status: Victorian Rebuild
photo: no32-main.jpg
key use: Ironmongery
year: 1892
architect: Habershon & Fawckner
listing: Grade II
---
```

*Note: The Fast Facts table is dynamic. Any custom field added here (e.g., `Basement: Vaulted stone`) will automatically appear in the sidebar table without further coding.*

### 2. The Intro Text
To ensure a summary appears on the dashboard, wrap your opening paragraph in this specific tag:

```html
<p class="wiki-intro-text">
    Your historical summary goes here...
</p>
```

### 3. Sub-divided Plots
If a historical plot has been split (e.g., 11a, 11b), create separate files. The Python script uses "natural sorting" to keep them in numerical order (11, 11a, 11b, 12).

---

## 🏷 Research Status Guide

Use these exact terms in the `status:` field. The system automatically handles the styling for both the Dashboard and the Property pages by converting spaces to hyphens.

| Status Label | Historical Context | Dashboard Colour |
| :--- | :--- | :--- |
| **Original Fabric** | Pre-1830s structures or rare survivors. | Forest Green |
| **Victorian Rebuild** | Buildings from the 1837–1901 industrial boom. | Terracotta |
| **Early 20th C** | Edwardian, Art Deco, and Interwar (1901–1939). | Gold/Ochre |
| **Modernist** | Post-war, 1960s concrete, and 1970s retail blocks. | Slate Blue |
| **Consolidated** | A modern building covering multiple historical plots. | Muted Purple |
| **Demolished** | The building no longer exists (car park, road, etc.). | Madder Red |
| **Rebuilt** | General category for buildings with multiple major phases. | Grey-Blue |
| **TBC** | Research not yet started or status unconfirmed. | Grey |

---

## ⚙️ Automation & Updates

The **`research_ledger.json`** file is the engine for the dashboard. It must be refreshed whenever you change a Markdown file:

1.  Open **VS Code**.
2.  Select **`generate_ledger.py`**.
3.  Click the **Play** button (top right triangle) to run the script.
4.  The Terminal will display a **Research Tally** showing the current breakdown of the street.

---

## 💾 Backup & Version Control

Always commit your changes at the end of a session to ensure the history of Newport Cornucopia is preserved:

1.  `git add .`
2.  `git commit -m "Update research for [building numbers]"`
3.  `git push`