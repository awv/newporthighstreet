/* --- HORIZONTAL SCROLL WITH MOUSE WHEEL --- */
const streetGrid = document.querySelector('.street-grid');

streetGrid.addEventListener('wheel', (evt) => {
    // Only intercept if they are scrolling up/down with a mouse wheel
    if (evt.deltaY !== 0) {
        evt.preventDefault();
        streetGrid.scrollLeft += evt.deltaY;
    }
});

// --- 1. THE STREET BUILDER ---
const layout = [
    "No. 1",
    "No. 1a",
    "No. 2",
    "|GHOST| Old Green",
    "No. 3",
    "No. 4",
    "No. 5",
    "No. 6",
    "No. 7",
    "No. 8",
    "|STREET| Carpenter's Arms Lane",
    "No. 9",
    "No. 10",
    "No. 10a",
    "No. 11",
    "No. 11a",
    "No. 11c",
    "No. 12",
    "No. 13",
    "No. 14",
    "No. 14a",
    "No. 15",
    "No. 16",
    "No. 17",
    "No. 18",
    "No. 19",
    "No. 20",
    "No. 21",
    "|STREET| Market Street",
    "No. 22",
    "No. 22a",
    "No. 22b",
    "No. 23",
    "No. 23a",
    "No. 23b",
    "No. 24",
    "No. 24a",
    "No. 25",
    "No. 25a",
    "No. 26",
    "No. 26a",
    "|STREET| Griffin Street",
    "No. 27",
    "No. 27a",
    "No. 28",
    "No. 28a",
    "No. 29",
    "No. 29a",
    "No. 30",
    "No. 31",
    "No. 32",
    "No. 33",
    "|TURN|",
    "No. 34",
    "No. 35",
    "No. 35a",
    "No. 36",
    "No. 37",
    "No. 37a",
    "No. 37b",
    "No. 38",
    "No. 38a",
    "No. 39",
    "No. 40",
    "No. 40a",
    "No. 41",
    "No. 42",
    "No. 43",
    "No. 44",
    "No. 45",
    "No. 45a",
    "No. 46",
    "No. 47",
    "No. 48",
    "No. 49",
    "No. 50",
    "No. 51",
    "No. 52",
    "No. 53",
    "No. 54",
    "No. 55",
    "No. 56",
    "No. 57",
    "|GHOST| Station Approach",
    "No. 58",
    "No. 59",
    "No. 60",
    "No. 61",
    "No. 62",
    "No. 63",
    "No. 64",
    "|GHOST| Thomas Street",
    "No. 65",
    "No. 66",
    "No. 67",
    "No. 68",
    "No. 68a",
    "No. 69",
    "No. 70",
    "No. 70a",
    "No. 71",
    "No. 72",
    "No. 73",
    "No. 74",
    "No. 75",
    "No. 76",
    "No. 77",
    "|RIVER| River Usk",
    "No. 78",
    "No. 79",
    "No. 80",
    "No. 81",
    "No. 82",
    "No. 83",
    "No. 84"
];

const container = document.getElementById('street-container');

// Build the columns (Now with River and Turn logic)
layout.forEach(item => {
    
    // 1. STANDARD STREET
    if (item.startsWith("|STREET|")) {
        const name = item.replace("|STREET| ", "");
        container.innerHTML += `
            <div class="side-street-divider">
                <h2 class="street-name-vertical">${name}</h2>
            </div>`;
            
    // 2. GHOST STREET (Demolished)
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

    // 3. RIVER (New!)
    } else if (item.startsWith("|RIVER|")) {
        const name = item.replace("|RIVER| ", "");
        container.innerHTML += `
            <div class="side-street-divider river-divider">
                <h2 class="river-text">${name}</h2>
            </div>`;

    // 4. TURN AROUND (New!)
    } else if (item.startsWith("|TURN|")) {
        container.innerHTML += `
            <div class="side-street-divider turn-divider">
                <div class="turn-sign">
                    <span class="turn-icon">↺</span>
                    <span class="turn-label">End of<br>Street</span>
                </div>
            </div>`;
            
    // 5. STANDARD BUILDING
    } else {
        container.innerHTML += `
            <div class="building-column">
                <h2 class="address-header">${item}</h2>
                <div class="column-content" id="col-${item.replace(/\s+/g, '-').toLowerCase()}">
                    </div>
            </div>`;
    }
});

// --- 2. THE DATA POPULATOR (LOCAL MODE) ---
historyData.forEach(entry => {
    // 1. Standardise the address ID
    const targetId = "col-" + entry.Address.trim().replace(/\s+/g, '-').toLowerCase();
    const targetColumn = document.getElementById(targetId);
    
    // 2. CHECK: Does this entry have data?
    const status = entry.Status ? entry.Status.toLowerCase() : '';
    const hasData = (entry.Business_Name && entry.Business_Name.toLowerCase() !== "unknown") || 
                    entry.Proprietor || 
                    status === 'void' || 
                    status === 'researching';

    if (targetColumn && hasData) {
        // --- SMART DATE LOGIC ---
        // We calculate this ONCE here, so it applies to Void, Researching, AND Normal cards.
        // If Start == End, show "1896". If different, show "1890–1900".
        const yearDisplay = (entry.Start_Year == entry.End_Year) 
            ? entry.Start_Year 
            : `${entry.Start_Year}–${entry.End_Year}`;

        let cardHTML = '';

        // --- OPTION A: VOID (The Brick Wall) ---
        if (status === 'void') {
            cardHTML = `
                <div class="year-box void-card" data-start="${entry.Start_Year}" data-end="${entry.End_Year}">
                    <div class="void-pattern">
                        <h3>TO LET</h3>
                    </div>
                    <div class="card-content">
                        <p class="year-range">${yearDisplay}</p> <p class="owner">No Occupant</p>
                    </div>
                </div>
            `;

        // --- OPTION B: RESEARCHING (The Dashed Box) ---
        } else if (status === 'researching') {
            cardHTML = `
                <div class="year-box research-pattern" data-start="${entry.Start_Year}" data-end="${entry.End_Year}">
                     <div class="date-range">${yearDisplay}</div> <p>Records for this address<br>are currently being researched.</p>
                </div>
            `;

        // --- OPTION C: NORMAL BUSINESS ---
        } else {
            // Proprietor & Image logic
            const proprietorHTML = entry.Proprietor && entry.Proprietor.trim() !== "" 
                ? `<p class="owner">${entry.Proprietor}</p>` 
                : '';

            const imageHTML = entry.Image_URL 
                ? `<div class="image-gallery"><img src="${entry.Image_URL}" alt="Historical image" class="thumbnail" onclick="openLightbox(this.src)"></div>` 
                : '';

            cardHTML = `
                <div class="year-box" data-start="${entry.Start_Year}" data-end="${entry.End_Year}">
                    <div class="card-roof">
                        <div class="chimney chimney-left"></div>
                        <div class="chimney chimney-right"></div>
                        <div class="roof-pitch"></div>
                    </div>
                    <div class="card-content">
                        <p class="year-range">${yearDisplay}</p>
                        <h3 class="business-name">${entry.Business_Name || 'Unknown'}</h3>
                        ${proprietorHTML}
                        <p class="description">${entry.Description || ''}</p>
                        ${imageHTML}
                    </div>
                </div>
            `;
        }
        
        targetColumn.innerHTML += cardHTML;
    }
});

// --- 3. EMPTY COLUMN DETECTOR ---
// This checks if any building has NO data at all and adds a "Researching" card.
document.querySelectorAll('.column-content').forEach(column => {
    // If the column is empty (has no cards inside)
    if (column.children.length === 0) {
        
        // Add a placeholder that shows for ALL years (1800-2100)
        column.innerHTML = `
            <div class="year-box research-card" data-start="1800" data-end="2100">
                <div class="research-icon">?</div>
                <p class="research-text">Records for this address<br>are currently being researched.</p>
            </div>
        `;
    }
});

// --- 3. LIGHTBOX FUNCTIONS ---
function openLightbox(imgSrc) {
    document.getElementById('lightbox-img').src = imgSrc;
    document.getElementById('lightbox').style.display = "flex";
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = "none";
}

// --- 4. TIME MACHINE LOGIC (Updated for Smart Dates) ---
const viewSwitch = document.getElementById('view-switch');
const yearSlider = document.getElementById('year-slider');
const yearDisplay = document.getElementById('year-display');

// 1. Slider Listener: Updates display and filters cards
yearSlider.addEventListener('input', function() {
    yearDisplay.textContent = this.value;
    // Only filter if the "Snapshot" toggle is active
    if (viewSwitch.checked) {
        filterCardsByYear(parseInt(this.value));
    }
});

// 2. Toggle Listener: Switches between Timeline and Snapshot
viewSwitch.addEventListener('change', function() {
    if (this.checked) {
        // MODE: SNAPSHOT (Show specific year)
        filterCardsByYear(parseInt(yearSlider.value));
    } else {
        // MODE: TIMELINE (Show everything & reset dates)
        const allCards = document.querySelectorAll('.year-box');
        allCards.forEach(card => {
            card.style.display = 'flex';
            
            // Restore the original date range text (e.g., "1830–1848")
            const dateEl = card.querySelector('.year-range, .date-range');
            if (dateEl && dateEl.hasAttribute('data-original')) {
                dateEl.textContent = dateEl.getAttribute('data-original');
            }
        });
    }
});

// 3. The Filter Engine
function filterCardsByYear(selectedYear) {
    const allCards = document.querySelectorAll('.year-box');
    
    allCards.forEach(card => {
        const startYear = parseInt(card.getAttribute('data-start'));
        const endYear = parseInt(card.getAttribute('data-end'));
        const dateEl = card.querySelector('.year-range, .date-range');

        // SAFETY BACKUP: If we haven't saved the original range yet, save it now.
        // This prevents us from losing "1830–1848" forever.
        if (dateEl && !dateEl.hasAttribute('data-original')) {
            dateEl.setAttribute('data-original', dateEl.textContent);
        }

        if (selectedYear >= startYear && selectedYear <= endYear) {
            // Show the card
            card.style.display = 'flex';
            
            // UPDATE THE TEXT: Change "1830–1848" to just "1848"
            if (dateEl) {
                dateEl.textContent = selectedYear;
            }
        } else {
            // Hide the card
            card.style.display = 'none';
        }
    });
}

// --- 5. ABOUT MODAL LOGIC ---
const aboutModal = document.getElementById("about-modal");
const aboutBtn = document.getElementById("about-btn");
const closeAbout = document.getElementById("close-about");

if (aboutBtn) {
    aboutBtn.onclick = function() {
      aboutModal.style.display = "flex";
    }
}

if (closeAbout) {
    closeAbout.onclick = function() {
      aboutModal.style.display = "none";
    }
}

window.onclick = function(event) {
  if (aboutModal && event.target == aboutModal) {
    aboutModal.style.display = "none";
  }
  const lightbox = document.getElementById('lightbox');
  if (lightbox && event.target == lightbox) {
    lightbox.style.display = "none";
  }
}

// --- CRASH-PROOF SLIDER LOGIC ---

document.addEventListener('change', function(event) {
    // 1. Check if the thing that changed was our specific toggle switch
    // We check for BOTH likely IDs just to be safe
    if (event.target.id === 'view-switch' || event.target.id === 'viewToggle') {
        
        const sliderContainer = document.querySelector('.year-slider-container');
        
        if (sliderContainer) {
            if (event.target.checked) {
                // Snapshot View -> Show Slider
                sliderContainer.style.display = 'flex';
            } else {
                // Timeline View -> Hide Slider
                sliderContainer.style.display = 'none';
            }
        }
    }
});

// Run once on load to set the initial state
document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.getElementById('view-switch') || document.getElementById('viewToggle');
    const slider = document.querySelector('.year-slider-container');
    
    if (toggle && slider) {
        // Set initial visibility based on whether the box is checked
        slider.style.display = toggle.checked ? 'flex' : 'none';
    }
});
// --- ENHANCED SEARCH FUNCTIONALITY ---
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
        const elementsToSearch = [
            card.querySelector('.business-name'),
            card.querySelector('.owner'),
            card.querySelector('.description')
        ];

        let isMatch = false;

        elementsToSearch.forEach(el => {
            if (!el) return;
            const originalText = el.getAttribute('data-original-text') || el.textContent;
            if (!el.hasAttribute('data-original-text')) {
                el.setAttribute('data-original-text', originalText);
            }

            if (isSearchActive && originalText.toLowerCase().includes(searchTerm)) {
                isMatch = true;
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                el.innerHTML = originalText.replace(regex, `<span class="search-highlight">$1</span>`);
            } else {
                el.innerHTML = originalText;
            }
        });

        if (isMatch || !isSearchActive) {
            card.classList.remove('search-hidden');
            // Remove the 'display: none' that might be lingering
            card.style.display = "block"; 
            if (isSearchActive) count++;
        } else {
            card.classList.add('search-hidden');
            // Force it to disappear so it doesn't take up space in the column
            card.style.display = "none"; 
        }
    });

    resultsCount.textContent = isSearchActive ? `${count} result${count === 1 ? '' : 's'} found` : "";

// COLUMN LOGIC: 
    // If searching, hide EVERYTHING except the columns with matches.
    allColumns.forEach(col => {
        const hasVisibleCards = col.querySelector('.year-box:not(.search-hidden)');
        
        if (isSearchActive) {
            // If searching, only show columns that contain a matching business card
            col.style.display = hasVisibleCards ? "flex" : "none";
        } else {
            // When not searching, show everything (roads, river, and buildings)
            col.style.display = "flex";
        }
    });
}

// Event Listeners
searchInput.addEventListener('input', performSearch);

clearBtn.addEventListener('click', () => {
    searchInput.value = "";
    performSearch();
    searchInput.focus();
});