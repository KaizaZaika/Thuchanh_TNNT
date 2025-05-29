const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const multer = require("multer"); // For handling file uploads
const fs = require("fs"); // For file system operations
const { exec } = require("child_process");
const app = express();
const PORT = 3200;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve the images directory for products and categories
app.use(
  "/images/models",
  express.static(path.join(__dirname, "images/models"))
);
app.use(
  "/images/scenes",
  express.static(path.join(__dirname, "images/scenes"))
);

// Initialize SQLite database
const db = new sqlite3.Database("./products.db");

// Route to clean up database entries with missing image files
app.get("/cleanup-database", (req, res) => {
  const query = "SELECT id, url FROM products";
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Error querying database:", err.message);
      return res.status(500).send("Failed to query database");
    }

    let missingFiles = [];
    rows.forEach((row) => {
      const filePath = path.join(__dirname, row.url);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(row.id);
      }
    });

    if (missingFiles.length > 0) {
      const deleteQuery = `DELETE FROM products WHERE id IN (${missingFiles.join(
        ","
      )})`;
      db.run(deleteQuery, (err) => {
        if (err) {
          console.error("Error deleting entries from database:", err.message);
          return res.status(500).send("Failed to clean up database");
        }
        res.send(`Deleted ${missingFiles.length} entries with missing files.`);
      });
    } else {
      res.send("No missing files found.");
    }
  });
});

// Configure multer for product file uploads
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "images/models");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { category, name, brand } = req.body; // Extract category, name, and brand from the form data
    const extension = path.extname(file.originalname); // Get the file extension
    const uniqueName = `${category}_${name}_${brand}${extension}`; // Format the file name
    cb(null, uniqueName);
  },
});
const productUpload = multer({ storage: productStorage });

// Route to handle adding a new product
app.post("/add-product", productUpload.single("image"), (req, res) => {
  const { name, price, category, brand } = req.body;
  const imageUrl = `/images/models/${req.file.filename}`;

  // Insert product details into the database
  const query = `
    INSERT INTO products (name, price, category, brand, url)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(query, [name, price, category, brand, imageUrl], (err) => {
    if (err) {
      console.error("Error inserting product into database:", err.message);
      return res.status(500).send("Failed to add product");
    }
    res.send("Product added successfully");
  });
});

// Configure multer for category file uploads
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "images/scenes");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { categoryName } = req.body; // Get the category name from the form
    const extension = path.extname(file.originalname); // Get the file extension
    const fileName = `${categoryName}${extension}`; // Use the category name as the file name
    cb(null, fileName);
  },
});
const categoryUpload = multer({ storage: categoryStorage });

// Modified route to handle adding a new category and running product recognition
// Modified route to handle adding a new category and running product recognition
// Example client-side code (e.g., in a file like addCategory.js)
app.post(
  "/add-category",
  categoryUpload.single("categoryImage"),
  (req, res) => {
    const { categoryName } = req.body;
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileName = req.file.filename;
    const savedFilePath = `/images/scenes/${fileName}`;
    console.log(`File saved at: ${savedFilePath}`);

    exec(`python product_recognition.py ${fileName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running product recognition: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return res.status(500).json({ error: "Error running product recognition" });
      }
      console.log(`Python script output: ${stdout}`);
      const txtFilePath = path.join(__dirname, "images", "results", "detected_items.txt");
      fs.readFile(txtFilePath, "utf8", (readErr, data) => {
        if (readErr) {
          console.error(`Error reading detected items file: ${readErr.message}`);
          return res.status(500).json({ error: "Error reading detected items" });
        }
        console.log(`Detected items from file: ${data}`);
        // Send JSON response with detected items
        const items = data.trim().split('\n').filter(item => item.trim() !== '');
        res.json({ detected_items: items });
      });
    });
  }
);
// Route to test database connection
app.get("/test-db", (req, res) => {
  db.get("SELECT 1", [], (err, row) => {
    if (err) {
      console.error("Database connection error:", err.message);
      return res.status(500).send("Database connection failed");
    }
    res.send("Database connection successful");
  });
});

// Route to fetch products from the database
app.get("/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      console.error("Error querying database:", err.message);
      return res.status(500).send("Error fetching products from database");
    }
    res.json(rows);
  });
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
