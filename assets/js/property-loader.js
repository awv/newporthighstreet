document.addEventListener("DOMContentLoaded", () => {
    // 1. Find out which property the user clicked (e.g., property.html?id=no32)
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    if (propertyId) {
        // 2. Go get the Markdown file from your content folder
        fetch(`content/${propertyId}.md`)
            .then(response => {
                if (!response.ok) throw new Error("Property history not found.");
                return response.text();
            })
            .then(markdownText => {
                // 3. Convert that text into HTML and put it on the page
                document.getElementById('property-content').innerHTML = marked.parse(markdownText);
            })
            .catch(err => {
                document.getElementById('property-content').innerHTML = `<h2>Sorry, research for this property is still in progress.</h2>`;
            });
    }
});