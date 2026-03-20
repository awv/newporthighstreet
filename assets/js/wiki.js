/* ==========================================================================
   NEWPORT CORNUCOPIA: WIKI LOGIC (wiki.js)
   ========================================================================== */

async function loadPropertyHistory() {
    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get('id');
    const contentArea = document.getElementById('property-content');
    const statusBadge = document.getElementById('bldg-status');
    const numberHeader = document.getElementById('bldg-number');

    if (!propertyId || !contentArea) return;

    if (numberHeader) {
        numberHeader.innerText = propertyId.replace('no', '');
    }

    try {
        const response = await fetch(`/content/${propertyId}.md`);
        if (!response.ok) throw new Error("File not found");
        let text = await response.text();

        // --- METADATA EXTRACTOR ---
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
        const match = text.match(frontmatterRegex);

        if (match) {
            console.log("✔ Metadata block found for " + propertyId);
            const metadata = match[1];
            const lines = metadata.split('\n');

            // Robust helper that uses a pattern search
            const getMetaValue = (keyName) => {
                const pattern = new RegExp(`^${keyName}\\s*:\\s*(.*)`, 'i');
                for (let line of lines) {
                    const found = line.trim().match(pattern);
                    if (found) return found[1].trim();
                }
                return null;
            };

            // 1. Update Status Badge
            const statusValue = getMetaValue('status');
            if (statusValue && statusBadge) {
                statusBadge.innerText = statusValue;
                statusBadge.className = 'status-badge ' + statusValue.toLowerCase();
            }

            // 2. Handle Infobox Photo
            const photoValue = getMetaValue('photo');
            const photoContainer = document.getElementById('infobox-photo');

            if (photoValue && photoContainer) {
                // Path assumes a 'present' subfolder for these contemporary shots
                const photoSrc = `/assets/images/properties/${propertyId}/present/${photoValue}`;
                photoContainer.innerHTML = `<img src="${photoSrc}" alt="Present day view of ${propertyId}">`;
                console.log("✔ Infobox photo added: " + photoValue);
            } else if (photoContainer) {
                photoContainer.innerHTML = ''; // Clear it if no photo is listed
            }

            // 3. Populate Fast Facts Table
            const infobox = document.getElementById('property-infobox');
            const table = document.getElementById('infobox-table');

            if (infobox && table) {
                const fields = [
                    { key: 'key use', label: 'Key Use' },
                    { key: 'year', label: 'Year Built' },
                    { key: 'architect', label: 'Architect' },
                    { key: 'listing', label: 'Listing' }
                ];

                let tableHTML = '';
                fields.forEach(field => {
                    const val = getMetaValue(field.key);
                    if (val) {
                        console.log(`+ Found field: ${field.label} = ${val}`);
                        tableHTML += `<tr><th>${field.label}</th><td>${val}</td></tr>`;
                    }
                });

                if (tableHTML !== '') {
                    table.innerHTML = tableHTML;
                    infobox.style.display = 'block'; 
                    console.log("✔ Table injected and revealed.");
                } else {
                    console.warn("⚠ No table fields (key use, year, etc.) were recognised.");
                }
            } else {
                console.error("✖ Could not find 'property-infobox' or 'infobox-table' in the HTML.");
            }

            // Remove metadata from the text
            text = text.replace(frontmatterRegex, '');
        }

        contentArea.innerHTML = marked.parse(text);

        // --- ADD IMAGES MANUALLY ---
        if (propertyId === 'no32') {
            addImage('no32', 'adverts', '28-RichardShops-SWA-04051949.jpg', 'South Wales Argus, May 1949');
        }

    } catch (err) {
        contentArea.innerHTML = `<h2>Research in progress...</h2>`;
        console.error("Wiki Load Error:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadPropertyHistory);

function addImage(building, type, filename, caption) {
    const container = document.getElementById(`${type}-gallery`);
    if (!container) return;
    const src = `/assets/images/properties/${building}/${type}/${filename}`;
    container.innerHTML += `
        <div class="gallery-item">
            <img src="${src}" alt="${caption}" onclick="openWikiLightbox('${src}', '${caption}')" style="cursor:pointer">
            <p class="gallery-caption">${caption}</p>
        </div>`;
}

function openWikiLightbox(src, caption) {
    const lb = document.getElementById('wiki-lightbox');
    if (lb) {
        document.getElementById('wiki-lightbox-img').src = src;
        document.getElementById('wiki-lightbox-caption').innerText = caption;
        lb.style.display = 'flex';
    }
}

function closeWikiLightbox() {
    const lb = document.getElementById('wiki-lightbox');
    if (lb) lb.style.display = 'none';
}