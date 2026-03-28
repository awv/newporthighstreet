async function loadPropertyHistory() {
    const params = new URLSearchParams(window.location.search);
    let rawId = params.get('id');
    const contentArea = document.getElementById('property-content');
    const statusBadge = document.getElementById('bldg-status');
    const numberHeader = document.getElementById('bldg-number');

    if (!rawId || !contentArea) return;

    // --- NORMALISATION ---
    // Turns "No. 1a" or "no 1a" into "no1a" for file fetching
    const propertyId = rawId.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

    // Set the Big Header (e.g., "1A")
    if (numberHeader) { 
        numberHeader.innerText = propertyId.replace('no', '').toUpperCase(); 
    }

    try {
        const response = await fetch(`/content/${propertyId}.md`);
        if (!response.ok) throw new Error("File not found");
        let text = await response.text();

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

            // 1. Status
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
                    photoContainer.innerHTML = `<img src="/assets/images/properties/${propertyId}/present/${photoValue}" alt="View of ${propertyId}">`;
                } else {
                    photoContainer.innerHTML = `<div class="photo-placeholder">No Photo Available</div>`;
                }
            }

            // 3. Fast Facts Table
            const table = document.getElementById('infobox-table');
            const infobox = document.getElementById('property-infobox');

            if (table && infobox) {
                let tableHTML = '';
                let characterHTML = '';
                const ignoredKeys = ['status', 'photo', 'title', 'id', 'tenants', 'address'];

                // Clear existing description if any exists from a previous load
                const existingDesc = infobox.querySelector('.infobox-description');
                if (existingDesc) existingDesc.remove();

                lines.forEach(line => {
                    const parts = line.split(':');
                    if (parts.length >= 2) {
                        const key = parts[0].trim();
                        const value = parts.slice(1).join(':').trim();
                        const keyLower = key.toLowerCase();

                        if (!ignoredKeys.includes(keyLower) && value && value.toLowerCase() !== 'unknown') {
                            if (keyLower === 'character' || keyLower === 'description') {
                                characterHTML = `<div class="infobox-description"><h4>${key}</h4><p>${value}</p></div>`;
                            } else {
                                tableHTML += `<tr><th>${key}</th><td>${value}</td></tr>`;
                            }
                        }
                    }
                });

                table.innerHTML = tableHTML;
                if (characterHTML) infobox.insertAdjacentHTML('beforeend', characterHTML);
                infobox.style.display = (tableHTML || characterHTML) ? 'block' : 'none';
            }

            // 4. Merchants & Residents
            const tenantsValue = getMetaValue('tenants');
            const tenantsSection = document.getElementById('tenants-section');
            const tenantsList = document.getElementById('tenants-list');

            if (tenantsValue && tenantsList) {
                tenantsSection.style.display = 'block';
                const entries = tenantsValue.split(',');
                let listHTML = '';
                entries.forEach(entry => {
                    const parts = entry.split('|');
                    if (parts.length >= 2) {
                        const date = parts[0].trim();
                        const name = parts[1].trim();
                        const trade = parts[2] ? parts[2].trim() : '';
                        listHTML += `
                            <li>
                                <span class="ledger-date">${date}</span>
                                <div class="ledger-detail">
                                    <strong>${name}</strong>
                                    ${trade ? `<p>${trade}</p>` : ''}
                                </div>
                            </li>`;
                    }
                });
                tenantsList.innerHTML = listHTML;
            } else if (tenantsSection) {
                tenantsSection.style.display = 'none';
            }

            text = text.replace(frontmatterRegex, '');
        }

        // Render Markdown
        contentArea.innerHTML = marked.parse(text);

        // TRIGGER JUMP AFTER RENDER
        handleAnchorJump();

        // --- AUTOMATED GALLERIES ---
        const ledgerResponse = await fetch('/research_ledger.json');
        const ledgerData = await ledgerResponse.json();
        const propertyData = ledgerData.find(p => p.id === propertyId);

        if (propertyData) {
            // Adverts
            const advertSection = document.getElementById('adverts-section');
            const hasAdverts = (propertyData.adverts && propertyData.adverts.length > 0) || propertyId === 'no32';
            if (hasAdverts) {
                advertSection.style.display = 'block';
                const gallery = document.getElementById('adverts-gallery');
                gallery.innerHTML = '';
                if (propertyData.adverts) {
                    propertyData.adverts.forEach(f => addImage(propertyId, 'adverts', f, f.replace(/\.[^/.]+$/, "").replace(/-/g, " ")));
                }
                if (propertyId === 'no32') addImage('no32', 'adverts', '28-RichardShops-SWA-04051949.jpg', 'South Wales Argus, May 1949');
            } else { advertSection.style.display = 'none'; }

            // Photos
            const presentSection = document.getElementById('present-section');
            if (propertyData.photos && propertyData.photos.length > 0) {
                presentSection.style.display = 'block';
                const gallery = document.getElementById('present-gallery');
                gallery.innerHTML = '';
                propertyData.photos.forEach(f => addImage(propertyId, 'present', f, f.replace(/\.[^/.]+$/, "").replace(/-/g, " ")));
            } else { presentSection.style.display = 'none'; }
        }
    } catch (err) { console.error(err); }
}

// Ensure the scroll happens after images and content are likely settled
function handleAnchorJump() {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Optional highlight
                target.style.backgroundColor = '#fff9e6';
                setTimeout(() => target.style.backgroundColor = 'transparent', 2000);
            }
        }, 300);
    }
}

document.addEventListener("DOMContentLoaded", loadPropertyHistory);

function addImage(building, type, filename, caption) {
    const container = document.getElementById(`${type === 'present' ? 'present' : 'adverts'}-gallery`);
    if (!container) return;
    container.innerHTML += `<div class="gallery-item"><img src="/assets/images/properties/${building}/${type}/${filename}" alt="${caption}" onclick="openWikiLightbox(this.src, '${caption}')"><p class="gallery-caption">${caption}</p></div>`;
}

function openWikiLightbox(src, caption) {
    const img = document.getElementById('wiki-lightbox-img');
    const cap = document.getElementById('wiki-lightbox-caption');
    const lb = document.getElementById('wiki-lightbox');
    if (img && cap && lb) {
        img.src = src;
        cap.innerText = caption;
        lb.style.display = 'flex';
    }
}

function closeWikiLightbox() { 
    const lb = document.getElementById('wiki-lightbox');
    if (lb) lb.style.display = 'none'; 
}

// --- LIGHTBOX CLICKS ---
document.addEventListener('click', function(e) {
    if (e.target.closest('.wiki-image img')) {
        const clickedImg = e.target;
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        if (lightbox && lightboxImg) {
            lightboxImg.src = clickedImg.src;
            lightbox.style.display = 'flex';
        }
    }

    const lightbox = document.getElementById('lightbox');
    if (lightbox && (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox-close'))) {
        lightbox.style.display = 'none';
    }
});