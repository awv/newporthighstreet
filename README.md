# 🏛️ Newport Cornucopia: Design Gold Standards

This document serves as the definitive visual and technical manual for the **Newport Cornucopia** project. To maintain the project's historical integrity and "Victorian Ledger" aesthetic, all updates must adhere to these standards.

---

## 📍 High Street Map (Main View)

* **Primary Header:** Solid Black (`#000`) background with a signature Gold (`#e5a813`) bottom border (4px).
* **Address Badges:** High-contrast black badges (`#1a1a1a`) with white serif text, acting as the fixed anchor for each building column.
* **Building Cards (The "Ledger" Look):**
    * **Roof:** A black header bar (`#1a1a1a`) with two gold tabs (`#e5a813`) sitting flush on the top-left and top-right edges.
    * **Footer:** A thick, solid gold border (10px) at the base of every card.
    * **Spacing:** Internal content padding (top) must be at least `35px` to ensure the business name never overlaps the roof architecture.
* **Street Scenery:** Road dividers use a textured grey/beige (`#d6d3cb`) with dashed borders (`#bbb`) and vertical, uppercase street names.

---

## 📜 Property Wiki (Document View)

* **System Isolation:** To protect the map logic, Wiki pages must use dedicated files (`wiki.css` and `wiki.js`). **Do not load `script.js` on Wiki pages.**
* **The "Paper" Layout:** A clean white container (`#fff`) with a subtle offset shadow (`rgba(0,0,0,0.03)`).
* **Flush Architecture:** The **Gold Number Block** and **Status Badge** must be docked perfectly flush against the top edge of the white container.
* **Typography Hierarchy:**
    * **Intro Text:** High-impact lead paragraph set at `1.3em` to `1.5em` for visual distinction.
    * **Section Headings (H2):** Bold serif font with a signature `2px` gold underline (`#e5a813`).
    * **Body Text:** Clean, accessible sans-serif (`1.05em`) with a `1.7` line height for readability.
* **Navigation:** The "Back to Map" link must remain Gold (`#e5a813`) for all states (`:link`, `:visited`, `:active`) to