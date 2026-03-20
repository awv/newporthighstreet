/* ==========================================================================
   NEWPORT CORNUCOPIA: WIKI LOGIC
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

        // --- RESTORED METADATA EXTRACTOR ---
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
        const match = text.match(frontmatterRegex);

        if (match) {
            const metadata = match[1];
            const lines = metadata.split('\n');

            const getMetaValue = (keyName) => {
                const pattern = new RegExp(`^${keyName}\\s*:\\s*(.*)`, 'i');
                for (let line of lines) {
                    const found = line.trim().match(pattern);
                    if (found) return found[1].trim();
                }
                return null;
            };

            // 1. Status Badge
            const statusValue = getMetaValue('status');
            if (statusValue && statusBadge) {
                statusBadge.innerText = statusValue;
                statusBadge.className = 'status-badge ' + statusValue.toLowerCase().replace(/\s+/g, '-');
            }

            // 2. Infobox Photo
            const photoValue = getMetaValue('photo');
            const photoContainer = document.getElementById('infobox-photo');
            if (photoContainer) {
                if (photoValue && photoValue.toLowerCase() !== 'placeholder.jpg') {
                    const photoSrc = `/assets/images/properties/${propertyId}/present/${photoValue}`;
                    photoContainer.innerHTML = `<img src="${photoSrc}" alt="Present day view of ${propertyId}">`;
                } else {
                    photoContainer.innerHTML = `<div class="photo-placeholder">No Photo Available</div>`;
                }
            }

            // 3. Fast Facts Table
            const table = document.getElementById('infobox-table');
            if (table) {
                let tableHTML = '';
                const ignoredKeys = ['status', 'photo', 'title', 'id'];
                lines.forEach(line => {
                    const parts = line.split(':');
                    if (parts.length >= 2) {
                        const key = parts[0].trim();
                        const value = parts.slice(1).join(':').trim();
                        if (!ignoredKeys.includes(key.toLowerCase()) && value) {
                            tableHTML += `<tr><th>${key}</th><td>${value}</td></tr>`;
                        }
                    }
                });
                table.innerHTML = tableHTML;
                document.getElementById('property-infobox').style.display = 'block';
            }
            text = text.replace(frontmatterRegex, '');
        }

        contentArea.innerHTML = marked.parse(text);

        // --- AUTOMATED GALLERY LOADING ---
        const ledgerResponse = await fetch('/research_ledger.json');
        const ledgerData = await ledgerResponse.json();
        const propertyData = ledgerData.find(p => p.id === propertyId);

        if (propertyData) {
            // Adverts Section
            const advertSection = document.getElementById('adverts-section');
            const hasAdverts = (propertyData.adverts && propertyData.adverts.length > 0) || propertyId === 'no32';

            if (hasAdverts) {
                advertSection.style.display = 'block';
                const gallery = document.getElementById('adverts-gallery');
                gallery.innerHTML = ''; 
                if (propertyData.adverts) {
                    propertyData.adverts.forEach(filename => {
                        const caption = filename.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
                        addImage(propertyId, 'adverts', filename, caption);
                    });
                }
                if (propertyId === 'no32') {
                    addImage('no32', 'adverts', '28-RichardShops-SWA-04051949.jpg', 'South Wales Argus, May 1949');
                }
            } else {
                advertSection.style.display = 'none';
            }

            // Photos Section
            const presentSection = document.getElementById('present-section');
            if (propertyData.photos && propertyData.photos.length > 0) {
                presentSection.style.display = 'block';
                const gallery = document.getElementById('present-gallery');
                gallery.innerHTML = '';
                propertyData.photos.forEach(filename => {
                    const caption = filename.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
                    addImage(propertyId, 'present', filename, caption);
                });
            } else {
                presentSection.style.display = 'none';
            }
        }

    } catch (err) {
        contentArea.innerHTML = `<h2>Research in progress...</h2>`;
    }
}

document.addEventListener("DOMContentLoaded", loadPropertyHistory);

function addImage(building, type, filename, caption) {
    const targetId = type === 'present' ? 'present-gallery' : 'adverts-gallery';
    const container = document.getElementById(targetId);
    if (!container) return;
    const src = `/assets/images/properties/${building}/${type}/${filename}`;
    container.innerHTML += `
        <div class="gallery-item">
            <img src="${src}" alt="${caption}" onclick="openWikiLightbox('${src}', '${caption}')">
            <p class="gallery-caption">${caption}</p>
        </div>`;
}

function openWikiLightbox(src, caption) {
    document.getElementById('wiki-lightbox-img').src = src;
    document.getElementById('wiki-lightbox-caption').innerText = caption;
    document.getElementById('wiki-lightbox').style.display = 'flex';
}

function closeWikiLightbox() {
    document.getElementById('wiki-lightbox').style.display = 'none';
}