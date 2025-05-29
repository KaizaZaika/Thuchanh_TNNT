const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Connect to the database
const db = new sqlite3.Database('./products.db');

// Path to the images directory
const imagesDir = path.join(__dirname, 'images/models');

// Default values for new products
const defaultPrice = 0.0;
const defaultCategory = 'Uncategorized';
const defaultBrand = 'Unknown';

// Initialize the database
db.serialize(() => {
    // Create the products table if it doesn't exist
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            price REAL DEFAULT ${defaultPrice},
            category TEXT DEFAULT '${defaultCategory}',
            brand TEXT DEFAULT '${defaultBrand}',
            url TEXT NOT NULL
        )
    `);

    // Read the images directory
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error reading images directory:', err);
            return db.close(() => {
                console.log('Database connection closed due to error.');
            });
        }

        // Filter image files
        const imageFiles = files.filter(file =>
            file.toLowerCase().endsWith('.jpg') ||
            file.toLowerCase().endsWith('.png') ||
            file.toLowerCase().endsWith('.jpeg')
        );

        let pendingOperations = imageFiles.length;

        if (pendingOperations === 0) {
            console.log('No images found to process.');
            return db.close(() => {
                console.log('Database connection closed.');
            });
        }

        // Insert each image into the database
        imageFiles.forEach(file => {
            const name = path.parse(file).name; // Use the file name without extension
            const url = `/images/models/${file}`;

            // Check if the product already exists
            db.get('SELECT * FROM products WHERE name = ?', [name], (err, row) => {
                if (err) {
                    console.error('Error querying database:', err);
                } else if (row) {
                    console.log(`Product "${name}" already exists in the database.`);
                } else {
                    // Insert the new product
                    db.run(
                        'INSERT INTO products (name, url) VALUES (?, ?)',
                        [name, url],
                        err => {
                            if (err) {
                                console.error('Error inserting product into database:', err);
                            } else {
                                console.log(`Inserted product: ${name}`);
                            }
                        }
                    );
                }

                // Decrement pending operations and close the database if done
                pendingOperations--;
                if (pendingOperations === 0) {
                    db.close(() => {
                        console.log('Database initialization complete and connection closed.');
                    });
                }
            });
        });
    });
});