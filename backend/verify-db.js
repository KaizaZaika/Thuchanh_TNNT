const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./products.db');

// Query the products table
db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
        console.error('Error querying database:', err);
        return;
    }

    console.log('Products in database:', rows);
});

db.close(() => {
    console.log('Database connection closed');
});