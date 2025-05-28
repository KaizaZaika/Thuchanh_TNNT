const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the images directory from the backend
app.use('/images/models', express.static(path.join(__dirname, 'images/models')));

// Initialize SQLite database
const db = new sqlite3.Database('./products.db');

// Route to fetch products from the database
app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Error fetching products from database');
        }
        res.json(rows);
    });
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});