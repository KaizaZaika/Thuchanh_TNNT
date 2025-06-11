const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const { exec } = require("child_process");
const cors = require("cors");
const app = express();
const PORT = 3200;

// Middleware to parse form data
app.use(cors());
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
app.use(
  "/images/results",
  express.static(path.join(__dirname, "images/results"))
);

// Serve static files from backend/images
app.use("/images", express.static(path.join(__dirname, "images")));

console.log("Server.js: Đang cố gắng kết nối cơ sở dữ liệu..."); // LOG 2
// Initialize SQLite database
const db = new sqlite3.Database("./backend/products.db", (err) => {
    if (err) {
        console.error("Server.js: Lỗi kết nối CSDL:", err.message); // LOG 3 (Lỗi khi kết nối)
    } else {
        console.log("Server.js: Kết nối CSDL thành công."); // LOG 4 (Kết nối thành công)
        // Create detection_history table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS detection_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                scene_name TEXT NOT NULL,
                image_path TEXT NOT NULL,
                total_price REAL NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error("Error creating detection_history table:", err.message);
            } else {
                console.log("Detection history table is ready");
            }
        });
    }
});

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
    const { category, name, brand } = req.body;
    const extension = path.extname(file.originalname);
    const uniqueName = `${category}_${brand}_${name}${extension}`;
    cb(null, uniqueName);
  },
});
const productUpload = multer({ storage: productStorage });

// Route to handle adding a new product
app.post("/add-product", productUpload.single("image"), (req, res) => {
  const { name, price, category, brand } = req.body;
  const imageUrl = `/images/models/${req.file.filename}`;

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
    const { categoryName } = req.body;
    const extension = path.extname(file.originalname);
    const fileName = `${categoryName}${extension}`;
    cb(null, fileName);
  },
});
const categoryUpload = multer({ storage: categoryStorage });

// Route to handle adding a new category and running product recognition
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
    const baseName = path.parse(fileName).name; // This will be used as sceneName
    const savedFilePath = path.join(__dirname, 'images', 'scenes', fileName);
    console.log(`File saved at: ${savedFilePath}`);

    // Verify the file was actually saved
    if (!fs.existsSync(savedFilePath)) {
      console.error(`Error: File was not saved correctly at ${savedFilePath}`);
      return res.status(500).json({ error: "Failed to save the uploaded file" });
    }

    // Get the absolute path to the Python script
    const pythonScriptPath = path.join(__dirname, 'product_recognition.py');
    console.log(`Running Python script: ${pythonScriptPath} with file: ${fileName}`);

    // Change working directory to the script's directory for consistent paths
    const scriptDir = path.dirname(pythonScriptPath);
    
    exec(
      `python3 "${pythonScriptPath}" "${fileName}"`,
      { cwd: scriptDir },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error running product recognition: ${error.message}`);
          console.error(`stderr: ${stderr}`);
          return res
            .status(500)
            .json({ error: "Error running product recognition" });
        }
        console.log(`Python script output: ${stdout}`);
        const txtFilePath = path.join(
          __dirname,
          "images",
          "results",
          `detection_at_${baseName}.txt`
        );
        fs.readFile(txtFilePath, "utf8", (readErr, data) => {
          if (readErr) {
            console.error(
              `Error reading detected items file: ${readErr.message}`
            );
            return res
              .status(500)
              .json({ error: "Error reading detected items" });
          }
          console.log(`Detected items from file: ${data}`);
          // Process detected items
          const items = data
            .trim()
            .split("\n")
            .filter((item) => item.trim() !== "");
          
          // For now, we'll set total price to 0 and update it after fetching all product details
          const detectionImagePath = `/images/results/found_${baseName}.jpg`;
          const insertQuery = `
            INSERT INTO detection_history (scene_name, image_path, total_price)
            VALUES (?, ?, 0)
            RETURNING id;
          `;
          
          db.get(insertQuery, [baseName, detectionImagePath], (err, row) => {
            if (err) {
              console.error("Error saving to detection history:", err.message);
              // Check if the client accepts JSON
              if (req.accepts('json')) {
                return res.status(500).json({ 
                  error: 'Error saving detection history',
                  redirect: `/category_result.html?scene=${encodeURIComponent(baseName)}`
                });
              }
              return res.redirect(`/category_result.html?scene=${encodeURIComponent(baseName)}`);
            }
            
            const historyId = row.id;
            const redirectUrl = `/category_result.html?scene=${encodeURIComponent(baseName)}&historyId=${historyId}`;
            
            // Check if the client accepts JSON
            if (req.accepts('json')) {
              return res.json({ redirect: redirectUrl });
            }
            
            // Default to HTML redirect
            res.redirect(redirectUrl);
          });
        });
      }
    );
  }
);

// API to update detection history with total price
app.put('/api/detection-history/:id', (req, res) => {
  const { totalPrice } = req.body;
  const historyId = req.params.id;
  
  if (!totalPrice || isNaN(totalPrice)) {
    return res.status(400).json({ error: 'Valid total price is required' });
  }
  
  const query = 'UPDATE detection_history SET total_price = ? WHERE id = ?';
  db.run(query, [totalPrice, historyId], function(err) {
    if (err) {
      console.error('Error updating detection history:', err.message);
      return res.status(500).json({ error: 'Failed to update detection history' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Detection history not found' });
    }
    
    res.json({ success: true, message: 'Detection history updated' });
  });
});

// API to get all detection history
app.get('/api/detection-history', (req, res) => {
  const query = 'SELECT * FROM detection_history ORDER BY created_at DESC';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching detection history:', err.message);
      return res.status(500).json({ error: 'Failed to fetch detection history' });
    }
    res.json(rows);
  });
});

// Route to fetch detected items for a specific scene
app.get("/detected-items", (req, res) => {
  const sceneName = req.query.scene;
  if (!sceneName) {
    return res.status(400).json({ error: "Scene name is required" });
  }
  const txtFilePath = path.join(
    __dirname,
    "images",
    "results",
    `detection_at_${sceneName}.txt`
  );
  fs.readFile(txtFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading detected items file: ${err.message}`);
      return res
        .status(500)
        .json({ error: "Error reading detected items file" });
    }
    const items = data
      .trim()
      .split("\n")
      .filter((item) => item.trim() !== "");
    res.json({ detected_items: items });
  });
});

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
// Route to fetch products from the database
app.get("/products", (req, res) => {
  console.log("Server.js: Nhận được yêu cầu GET /products"); // LOG 5
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      console.error("Server.js: Lỗi truy vấn CSDL:", err.message); // LOG 6 (Lỗi truy vấn)
      return res.status(500).send("Error fetching products from database");
    }
    console.log("Server.js: Truy vấn sản phẩm thành công, gửi", rows.length, "sản phẩm."); // LOG 7 (Thành công)
    res.json(rows);
  });
});

// Delete a product by ID
app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  if (!productId) {
    return res.status(400).json({ error: "Product ID is required" });
  }
  
  // First, get the product to delete its image file
  const getQuery = "SELECT url FROM products WHERE id = ?";
  db.get(getQuery, [productId], (err, row) => {
    if (err) {
      console.error(`Error finding product: ${err.message}`);
      return res.status(500).json({ error: "Error finding product" });
    }
    
    if (!row) {
      return res.status(404).json({ error: `Product with ID ${productId} not found` });
    }
    
    // Delete the product from the database
    const deleteQuery = "DELETE FROM products WHERE id = ?";
    db.run(deleteQuery, [productId], function(err) {
      if (err) {
        console.error(`Error deleting product: ${err.message}`);
        return res.status(500).json({ error: "Error deleting product from database" });
      }
      
      // If the product had an associated image, try to delete it
      if (row.url) {
        const imagePath = path.join(__dirname, '..', row.url);
        fs.unlink(imagePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error(`Error deleting image file: ${unlinkErr.message}`);
            // Continue with the response even if image deletion fails
          }
          res.json({ message: `Product with ID ${productId} deleted successfully` });
        });
      } else {
        res.json({ message: `Product with ID ${productId} deleted successfully` });
      }
    });
  });
});

// Get product details by name
app.get("/product-details", (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).json({ error: "Product name is required" });
  }
  const query = "SELECT id, name, price, category, brand, url FROM products WHERE name = ?";
  db.get(query, [name], (err, row) => {
    if (err) {
      console.error(`Error querying product details: ${err.message}`);
      return res.status(500).json({ error: "Error fetching product details" });
    }
    if (!row) {
      return res.status(404).json({ error: `Product ${name} not found` });
    }
    res.json(row);
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