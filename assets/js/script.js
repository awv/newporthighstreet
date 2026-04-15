// --- 1. THE STREET BUILDER ---
const layout = [
    "No. 1|D:~1897|", "No. 1a|D|", "No. 2|D|", "|GHOST| Old Green", "No. 3|D|", "No. 4|D|", "No. 5|D|", "No. 6|D|", "No. 7", "No. 8",
    "|STREET| Carpenter's Arms Lane", "No. 9", "No. 10", "No. 10a", "No. 11", "No. 11a", "No. 11c",
    "|ARCADE| Market Arcade (once Fennell's Arcade)", "No. 12", "No. 13", "No. 14", "No. 14a", "No. 15",
    "No. 16", "No. 17", "No. 18", "No. 19", "No. 20", "No. 21", "|STREET| Market Street", "No. 22",
    "No. 22a", "No. 22b", "No. 23", "No. 23a", "No. 23b", "No. 24", "No. 24a", "No. 25", "No. 25a",
    "No. 26", "No. 26a", "|STREET| Griffin Street", "No. 27", "No. 27a", "No. 28", "No. 28a", "No. 29",
    "No. 29a", "No. 30", "No. 31", "No. 32", "No. 33", "|TURN|", "No. 34", "No. 35", "No. 35a", "No. 36",
    "No. 37", "No. 37a", "No. 37b", "No. 38", "No. 38a", "No. 39", "No. 40", "No. 40a", "No. 41", "No. 42",
    "No. 43", "No. 44", "No. 45", "No. 45a", "No. 46", "No. 47", "No. 48", "No. 49", "No. 50", "No. 51",
    "No. 52", "No. 53", "No. 54", "No. 55", "No. 56", "No. 57", "|GHOST| Station Approach", "No. 58",
    "No. 59", "No. 60", "No. 61", "No. 62", "No. 63", "No. 64", "|GHOST| Thomas Street", "No. 65",
    "No. 66", "No. 67", "No. 68", "No. 68a", "No. 69", "No. 70", "No. 70a", "No. 71", "No. 72", "No. 73", 
    "No. 74", "No. 75", "No. 76", "No. 77", "|RIVER| River Usk", "No. 78|D|", "No. 79|D|", "No. 80|D|", "No. 81|D|", 
    "No. 82|D|", "No. 83|D|", "No. 84|D|"
];

const container = document.getElementById('street-container');

layout.forEach(item => {
    if (item.startsWith("|STREET|")) {
        const name = item.replace("|STREET| ", "");
        container.innerHTML += `
            <div class="side-street-divider">
                <h2 class="street-name-vertical">${name}</h2>
            </div>`;
    } else if (item.startsWith("|GHOST|")) {
         const rawData = item.replace("|GHOST| ", "");
         const parts = rawData.split("|"); 
         const name = parts[0];
         const date = parts[1] ? parts[1] : "Unknown";
         container.innerHTML += `
            <div class="side-street-divider ghost-street">
                <div class="street-name-container">
                    <h2 class="street-name-vertical">${name}</h2>
                    <span class="closure-badge">Demolished ${date}</span>
                </div>
            </div>`;
    } else if (item.startsWith("|RIVER|")) {
        const name = item.replace("|RIVER| ", "");
        container.innerHTML += `
            <div class="side-street-divider river-divider">
                <h2 class="river-text">${name}</h2>
            </div>`;
    } else if (item.startsWith("|TURN|")) {
        container.innerHTML += `
            <div class="side-street-divider turn-divider">
                <div class="turn-sign">
                    <span class="turn-icon">↺</span>
                    <span class="turn-label">End of<br>Street</span>
                </div>
            </div>`;
    } else if (item.startsWith("|ARCADE|")) {
        const name = item.replace("|ARCADE| ", "");
        container.innerHTML += `
            <div class="side-street-divider arcade-style">
                <div class="street-name-container">
                    <h2 class="street-name-vertical">${name}</h2>
                </div>
            </div>`;
        } else {
            // 1. Updated Regex to capture ~ and any characters between : and |
            const demoMatch = item.match(/\|D(:([^|]+))?\|/);
            const isDemolished = !!demoMatch;
            const demoDate = (demoMatch && demoMatch[2]) ? demoMatch[2].trim() : null;

            // 2. Create the ID for the column (keeping "no.-" for historyData)
            const idFriendly = item.replace(/\|D(:([^|]+))?\|/, "").trim().replace(/\s+/g, '-').toLowerCase();
            
            // 3. Clean the number for visual display
            let cleanNo = item.replace(/\|D(:([^|]+))?\|/, "").replace("No. ", "").trim();
            
            const numberMatch = cleanNo.match(/^(\d+)([a-zA-Z]*)$/);
            let displayNo = cleanNo;
            
            if (numberMatch) {
                const digits = numberMatch[1];
                const alpha = numberMatch[2];
                displayNo = alpha ? `${digits}<span class="number-suffix">${alpha}</span>` : digits;
            }

            // 4. Prepare the Demolished Card HTML
            let demoCardHTML = '';
            if (isDemolished) {
                // Only show the demo-year span if a date actually exists
                const dateSpan = demoDate ? `<span class="demo-year">${demoDate}</span>` : '';
                demoCardHTML = `
                    <div class="demolished-card">
                        <div class="demo-symbol">†</div>
                        <span class="demo-label">Demolished</span>
                        ${dateSpan}
                    </div>`;
            }

            const statusClass = isDemolished ? 'status-demolished' : '';

            container.innerHTML += `
                <div class="building-column">
                    <div class="building-number-modern ${statusClass}">${displayNo}</div>
                    
                    <div class="column-content" id="col-${idFriendly}">
                        </div>

                    ${demoCardHTML} 
                </div>`;
        }
});

// --- 2. THE DATA POPULATOR (LOCAL MODE) ---
historyData.forEach(entry => {
    const targetId = "col-" + entry.Address.trim().replace(/\s+/g, '-').toLowerCase();
    const targetColumn = document.getElementById(targetId);
    const status = entry.Status ? entry.Status.toLowerCase() : '';
    
    // UPDATED: entry.Proprietor changed to entry.Business_Type
    const hasData = (entry.Business_Name && entry.Business_Name.toLowerCase() !== "unknown") || 
                    entry.Business_Type || status === 'void' || status === 'researching';

    if (targetColumn && hasData) {
        const yearDisplay = (entry.Start_Year == entry.End_Year) ? entry.Start_Year : `${entry.Start_Year}–${entry.End_Year}`;
        let cardHTML = '';

    if (status === 'void') {
            cardHTML = `
                <div class="year-box void-card" data-start="${entry.Start_Year}" data-end="${entry.End_Year}">
                    <div class="card-content">
                        <p class="year-range">${yearDisplay}</p>
                        <h3 class="business-name" style="color: #999;">To Let</h3>
                        <p class="business-type">Vacant Premises</p>
                        <p class="description">No recorded occupant for this period.</p>
                    </div>
                </div>`;
        } else if (status === 'researching') {
            cardHTML = `
            <div class="research-thread year-box" data-start="${entry.Start_Year}" data-end="${entry.End_Year}">
                <span class="thread-dates">${yearDisplay}</span>
                <div class="thread-line"></div>
                <span class="thread-label">Researching</span>
            </div>`;
        }else {
            const businessTypeHTML = entry.Business_Type && entry.Business_Type.trim() !== "" ? `<p class="business-type">${entry.Business_Type}</p>` : '';
            const cleanId = entry.Address.replace("No. ", "no").toLowerCase();

            // STEP 1: Create a slug for the anchor (e.g. "Westgate Hotel" -> "westgate-hotel")
            // This strips special characters and replaces spaces with hyphens
            const eraSlug = entry.Business_Name 
                ? entry.Business_Name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') 
                : '';
            const anchor = eraSlug ? `#${eraSlug}` : '';

            cardHTML = `
                <a href="property.html?id=${cleanId}${anchor}" class="year-box-link">
                    <div class="year-box" data-start="${entry.Start_Year}" data-end="${entry.End_Year}">
                        <div class="card-content">
                            <p class="year-range">${yearDisplay}</p>
                            <h3 class="business-name">${entry.Business_Name || 'Unknown'}</h3>
                            ${businessTypeHTML}
                            <p class="description">${entry.Description || ''}</p>
                            
                            <div class="card-footer">
                                <span class="view-record-text">Explore Building History</span>
                                <span class="view-record-arrow">→</span>
                            </div>
                        </div>
                    </div>
                </a>`;
        }
        targetColumn.innerHTML += cardHTML;
    }
});

// --- 3. EMPTY COLUMN DETECTOR ---
document.querySelectorAll('.column-content').forEach(column => {
    if (column.children.length === 0) {
        column.innerHTML = `
            <div class="research-thread year-box" data-start="1800" data-end="2100">
                <span class="thread-dates">1800–Present</span>
                <div class="thread-line"></div>
                <span class="thread-label">Under Research</span>
            </div>`;
    }
});

// --- 4. LIGHTBOX FUNCTIONS ---
function openLightbox(imgSrc) {
    document.getElementById('lightbox-img').src = imgSrc;
    document.getElementById('lightbox').style.display = "flex";
}
function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
}

// --- 5. TIME MACHINE LOGIC ---
const viewSwitch = document.getElementById('view-switch');
const yearSlider = document.getElementById('year-slider');
const yearDisplay = document.getElementById('year-display');

yearSlider.addEventListener('input', function() {
    yearDisplay.textContent = this.value;
    if (viewSwitch.checked) { filterCardsByYear(parseInt(this.value)); }
});

viewSwitch.addEventListener('change', function() {
    if (this.checked) {
        filterCardsByYear(parseInt(yearSlider.value));
    } else {
        const allCards = document.querySelectorAll('.year-box');
        allCards.forEach(card => {
            card.style.display = 'flex';
            const dateEl = card.querySelector('.year-range, .date-range');
            if (dateEl && dateEl.hasAttribute('data-original')) {
                dateEl.textContent = dateEl.getAttribute('data-original');
            }
        });
    }
});

function filterCardsByYear(selectedYear) {
    const allCards = document.querySelectorAll('.year-box');
    allCards.forEach(card => {
        const startYear = parseInt(card.getAttribute('data-start'));
        const endYear = parseInt(card.getAttribute('data-end'));
        const dateEl = card.querySelector('.year-range, .date-range');
        if (dateEl && !dateEl.hasAttribute('data-original')) {
            dateEl.setAttribute('data-original', dateEl.textContent);
        }
        if (selectedYear >= startYear && selectedYear <= endYear) {
            card.style.display = 'flex';
            if (dateEl) { dateEl.textContent = selectedYear; }
        } else {
            card.style.display = 'none';
        }
    });
}

// --- 6. ABOUT MODAL LOGIC ---
const aboutModal = document.getElementById("about-modal");
const aboutBtn = document.getElementById("about-btn");
const closeAbout = document.getElementById("close-about");

if (aboutBtn) { aboutBtn.onclick = function() { aboutModal.style.display = "flex"; } }
if (closeAbout) { closeAbout.onclick = function() { aboutModal.style.display = "none"; } }

window.onclick = function(event) {
  if (aboutModal && event.target == aboutModal) { aboutModal.style.display = "none"; }
  const lightbox = document.getElementById('lightbox');
  if (lightbox && event.target == lightbox) { lightbox.style.display = "none"; }
}

// --- 7. SLIDER VISIBILITY ---
document.addEventListener('change', function(event) {
    if (event.target.id === 'view-switch' || event.target.id === 'viewToggle') {
        const sliderContainer = document.querySelector('.year-slider-container');
        if (sliderContainer) {
            sliderContainer.style.display = event.target.checked ? 'flex' : 'none';
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.getElementById('view-switch') || document.getElementById('viewToggle');
    const slider = document.querySelector('.year-slider-container');
    
    // Only show it if the toggle is actually checked on load
    // (e.g. if the browser remembered a 'checked' state from a refresh)
    if (toggle && slider && toggle.checked) { 
        slider.style.setProperty('display', 'flex', 'important'); 
    }
});

// --- 8. ENHANCED SEARCH FUNCTIONALITY ---
const searchInput = document.getElementById('site-search');
const clearBtn = document.getElementById('clear-search');
const resultsCount = document.getElementById('search-results-count');

function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const allCards = document.querySelectorAll('.year-box');
    const allColumns = document.querySelectorAll('.building-column, .side-street-divider');
    const isSearchActive = searchTerm !== "";
    let count = 0;
    clearBtn.style.display = isSearchActive ? "block" : "none";

    allCards.forEach(card => {
        // UPDATED: selector .owner changed to .business-type
        const elementsToSearch = [card.querySelector('.business-name'), card.querySelector('.business-type'), card.querySelector('.description')];
        let isMatch = false;
        elementsToSearch.forEach(el => {
            if (!el) return;
            const originalText = el.getAttribute('data-original-text') || el.textContent;
            if (!el.hasAttribute('data-original-text')) { el.setAttribute('data-original-text', originalText); }
            if (isSearchActive && originalText.toLowerCase().includes(searchTerm)) {
                isMatch = true;
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                el.innerHTML = originalText.replace(regex, `<span class="search-highlight">$1</span>`);
            } else { el.innerHTML = originalText; }
        });
        if (isMatch || !isSearchActive) {
            card.classList.remove('search-hidden');
            card.style.display = "block"; 
            if (isSearchActive) count++;
        } else {
            card.classList.add('search-hidden');
            card.style.display = "none"; 
        }
    });
    resultsCount.textContent = isSearchActive ? `${count} result${count === 1 ? '' : 's'} found` : "";
    allColumns.forEach(col => {
        const hasVisibleCards = col.querySelector('.year-box:not(.search-hidden)');
        if (isSearchActive) { col.style.display = hasVisibleCards ? "flex" : "none"; }
        else { col.style.display = "flex"; }
    });
}
searchInput.addEventListener('input', performSearch);
clearBtn.addEventListener('click', () => { searchInput.value = ""; performSearch(); searchInput.focus(); });

// --- 9. SCROLL MEMORY LOGIC ---

// 1. Save the building ID when a user clicks a card
document.addEventListener('click', function(e) {
    const link = e.target.closest('.year-box-link');
    if (link) {
        const url = new URL(link.href);
        const propertyId = url.searchParams.get('id');
        if (propertyId) {
            // Split at '#' to ensure we only save 'no3' and not 'no3#james-bown'
            const cleanId = propertyId.split('#')[0];
            sessionStorage.setItem('returnToProperty', cleanId);
        }
    }
});

// 2. Scroll back to the building when returning to the map
window.addEventListener('load', function() {
    const returnId = sessionStorage.getItem('returnToProperty');
    
    if (returnId) {
        setTimeout(() => {
            const formattedId = returnId.replace('no', 'no.-');
            const targetColId = "col-" + formattedId;
            const targetElement = document.getElementById(targetColId);

            if (targetElement) {
                const column = targetElement.closest('.building-column');
                
                // 1. Calculate the horizontal center
                const columnRect = column.getBoundingClientRect();
                const absoluteColumnLeft = columnRect.left + window.pageXOffset;
                const middleOfScreen = window.innerWidth / 2;
                const columnWidthHalf = column.offsetWidth / 2;
                
                const targetX = absoluteColumnLeft - middleOfScreen + columnWidthHalf;

                // 2. Scroll to the calculated X, but force Y to 0 (the top)
                window.scrollTo({
                    left: targetX,
                    top: 0,
                    behavior: 'auto'
                });
                
                sessionStorage.removeItem('returnToProperty');
            }
        }, 50); // Shortened delay for a snappier feel
    }
});