const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3200;

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the images directory from the backend
app.use('/images/models', express.static(path.join(__dirname, 'images/models')));

// Initialize SQLite database
const db = new sqlite3.Database('./products.db');
app.get('/test-db', (req, res) => {
    db.get('SELECT 1', [], (err, row) => {
        if (err) {
            console.error('Database connection error:', err.message);
            return res.status(500).send('Database connection failed');
        }
        res.send('Database connection successful');
    });
});
app.get('/ping', (req, res) => {
    res.send('Server is running');
});
// Route to fetch products from the database
app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Error fetching products from database');
        }
        console.log('Fetched products:', rows); // Log the fetched rows for debugging
        res.json(rows);
    });
    
});

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});