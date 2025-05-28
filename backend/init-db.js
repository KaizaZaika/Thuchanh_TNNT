const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Initialize SQLite database
const db = new sqlite3.Database('./products.db');

// Create products table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            url TEXT NOT NULL
        )
    `);

    // Clear existing data
    db.run('DELETE FROM products');

    // Read images from the directory
    const imagesDir = path.join(__dirname, 'images/models'); // Path to backend images
fs.readdir(imagesDir, (err, files) => {
    if (err) {
        console.error('Error reading images directory:', err);
        db.close(() => console.log('Database connection closed'));
        return;
    }

    // Insert image data into the database
    const stmt = db.prepare('INSERT INTO products (name, url) VALUES (?, ?)');
    files.forEach(file => {
        const name = path.basename(file, path.extname(file)); // Extract name from file
        const url = `/images/models/${file}`; // Generate URL for the image
        stmt.run(name, url);
    });
    stmt.finalize(() => {
        console.log('Database initialized with images');
        db.close(() => console.log('Database connection closed'));
    });
});
});