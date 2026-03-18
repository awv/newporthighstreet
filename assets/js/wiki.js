/* ==========================================================================
   NEWPORT CORNUCOPIA: WIKI LOGIC (wiki.js)
   ========================================================================== */

// 1. THE LOADER: Fetches the Markdown file and puts it on the page
async function loadPropertyHistory() {
    const params = new URLSearchParams(window.location.search);
    const propertyId = params.get('id');
    const contentArea = document.getElementById('property-content');
    const statusBadge = document.getElementById('bldg-status');
    const numberHeader = document.getElementById('bldg-number');

    if (!propertyId || !contentArea) return;

    // Set the building number in the gold block immediately
    if (numberHeader) {
        numberHeader.innerText = propertyId.replace('no', '');
    }

    try {
        const response = await fetch(`/content/${propertyId}.md`);
        if (!response.ok) throw new Error("File not found");
        let text = await response.text();

        // --- STATUS EXTRACTOR ---
        // Looks for the --- status: text --- at the top
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
        const match = text.match(frontmatterRegex);

        if (match) {
            const metadata = match[1];
            const statusLine = metadata.split('\n').find(line => line.startsWith('status:'));
            
            if (statusLine && statusBadge) {
                const statusValue = statusLine.replace('status:', '').trim();
                statusBadge.innerText = statusValue;
            }
            // Remove the metadata block so it doesn't print on the page
            text = text.replace(frontmatterRegex, '');
        }

        // Parse the remaining Markdown into the content area
        contentArea.innerHTML = marked.parse(text);

        // --- ADD IMAGES MANUALLY ---
        if (propertyId === 'no32') {
            addImage('no32', 'adverts', '28-RichardShops-SWA-04051949.jpg', 'South Wales Argus, May 1949');
        }

    } catch (err) {
        contentArea.innerHTML = `<h2>Research in progress...</h2>`;
    }
}

// Fire the loader once when the page is ready
document.addEventListener("DOMContentLoaded", loadPropertyHistory);

// 2. GALLERY & LIGHTBOX
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