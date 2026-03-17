/* ==========================================================================
   NEWPORT CORNUCOPIA: WIKI LOGIC (wiki.js)
   ========================================================================== */

function addImage(building, type, filename, caption) {
    const container = document.getElementById(`${type}-gallery`);
    if (!container) return;

    // Path assumes wiki pages are in /properties/ folder
    const src = `../images/properties/${building}/${type}/${filename}`;

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