pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.9.359/pdf.worker.min.js';

let currentPDF = null; // Store the current PDF document
let currentPage = 1; // Track the current page
let scale = 1.5; // Increased scale for higher resolution

function loadPDF(arrayBuffer) {
    pdfjsLib.getDocument({ data: arrayBuffer }).promise.then(function(pdf) {
        currentPDF = pdf; // Store the loaded PDF
        currentPage = 1; // Reset to the first page
        renderPage(currentPage); // Render the first page
    });
}

function extractTextFromPDF(pageNumber) {
    currentPDF.getPage(pageNumber).then(function(page) {
        page.getTextContent().then(function(textContent) {
            const textItems = textContent.items.map(item => item.str);
            const extractedText = textItems.join(' ');
            console.log('Extracted Text:', extractedText);
            // You can display or use the extracted text as needed
        });
    });
}

// Call this function to extract text from the current page
function extractCurrentPageText() {
    extractTextFromPDF(currentPage);
}

function performOCR(imageData) {
    Tesseract.recognize(imageData)
        .then(function(result) {
            console.log(result.text);
            // Use the extracted text as needed
        });
}

document.getElementById('pdf-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file.type === 'application/pdf') {
        const url = URL.createObjectURL(file); // Create a URL for the uploaded PDF
        document.getElementById('pdf-viewer').src = url; // Set the src of the iframe
    }
});

function renderPage(pageNumber) {
    currentPDF.getPage(pageNumber).then(function(page) {
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        // Render the PDF page onto the canvas
        page.render(renderContext);

        const viewer = document.getElementById('pdf-viewer');
        viewer.innerHTML = ''; // Clear previous content
        viewer.appendChild(canvas);

        // Create and render the text layer
        const textLayerDiv = document.createElement('div');
        textLayerDiv.className = 'textLayer';
        viewer.appendChild(textLayerDiv);

        page.getTextContent().then(function(textContent) {
            const textLayer = new pdfjsLib.TextLayerBuilder({
                textLayerDiv: textLayerDiv,
                pageIndex: pageNumber - 1,
                viewport: viewport
            });
            textLayer.setTextContent(textContent);
            textLayer.render();
        });

        // Add navigation buttons
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        };

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            if (currentPage < currentPDF.numPages) {
                currentPage++;
                renderPage(currentPage);
            }
        };

        viewer.appendChild(prevButton);
        viewer.appendChild(nextButton);
    });
}

// Function to enable text highlighting
function enableTextHighlighting(canvas, page) {
    const context = canvas.getContext('2d');
    let isHighlighting = false;
    let startX, startY;

    canvas.addEventListener('mousedown', (e) => {
        isHighlighting = true;
        startX = e.offsetX;
        startY = e.offsetY;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isHighlighting) {
            const endX = e.offsetX;
            const endY = e.offsetY;
            context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous highlights
            renderPage(currentPage); // Re-render the page
            context.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Highlight color
            context.fillRect(startX, startY, endX - startX, endY - startY); // Draw highlight
        }
    });

    canvas.addEventListener('mouseup', () => {
        isHighlighting = false;
    });
}

function loadPDF(arrayBuffer) {
    pdfjsLib.getDocument({ data: arrayBuffer }).promise.then(function(pdf) {
        currentPDF = pdf;
        currentPage = 1;
        renderPage(currentPage);
    });
}

function renderPage(pageNumber) {
    currentPDF.getPage(pageNumber).then(function(page) {
        const scale = 2.0; // Adjust this for zoom
        const viewport = page.getViewport({ scale: scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext);

        const viewer = document.getElementById('pdf-viewer');
        viewer.innerHTML = ''; // Clear previous content
        viewer.appendChild(canvas);
    });
}

// Adjust PDF viewer height based on slider input
document.getElementById('pdf-height-adjust').addEventListener('input', function(event) {
    const newHeight = event.target.value + 'px';
    document.getElementById('pdf-viewer').style.height = newHeight; // Update height
});

// Adjust PDF viewer width based on slider input
document.getElementById('pdf-width-adjust').addEventListener('input', function(event) {
    const newWidth = event.target.value + 'px';
    document.getElementById('pdf-viewer').style.width = newWidth; // Update width
});

// Zoom In function
document.getElementById('zoom-in').addEventListener('click', function() {
    scale += 0.5; // Increase scale by 0.5
    renderPage(currentPage); // Re-render the current page
});

// Zoom Out function
document.getElementById('zoom-out').addEventListener('click', function() {
    if (scale > 0.5) { // Prevent scale from going below 0.5
        scale -= 0.5; // Decrease scale by 0.5
        renderPage(currentPage); // Re-render the current page
    }
});