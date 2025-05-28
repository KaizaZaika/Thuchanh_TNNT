const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the images/models directory as a static directory
app.use('/images/models', express.static(path.join(__dirname, 'images/models')));

// Route to fetch product images
app.get('/products', (req, res) => {
    const imagesDir = path.join(__dirname, 'images/models');
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading images directory');
        }
        const products = files.map(file => ({
            name: path.basename(file, path.extname(file)), // Extract name from file
            url: `/images/models/${file}` // Generate URL for the image
        }));
        console.log(products); // Debug: Log the generated product data
        res.json(products);
    });
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});