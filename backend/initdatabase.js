const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, 'database.db');

// Connect to the database
const db = new sqlite3.Database(dbPath);

// Create the products table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            price TEXT NOT NULL,
            category TEXT NOT NULL
        )
    `);

    // Insert sample data
    db.run(`
        INSERT INTO products (name, url, price, category)
        VALUES
        ('Fresh Orange', '/images/models/orange.png', '$4.99', 'Fruits'),
        ('Fresh Onion', '/images/models/onion.png', '$2.99', 'Vegetables'),
        ('Fresh Meat', '/images/models/meat.png', '$10.99', 'Meat'),
        ('Fresh Cabbage', '/images/models/cabbage.png', '$3.99', 'Vegetables')
    `);

    console.log('Database initialized with sample data.');
});

// Close the database connection
db.close();