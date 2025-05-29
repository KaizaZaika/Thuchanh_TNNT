const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// Add this route for category processing
app.post('/add-category', upload.single('categoryImage'), (req, res) => {
    const uploadedFile = req.file;
    if (!uploadedFile) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const scenePath = path.join(__dirname, 'images/scenes', uploadedFile.originalname);
    fs.renameSync(uploadedFile.path, scenePath);

    const pythonScript = path.join(__dirname, 'product_recognition.py');
    const command = `python "${pythonScript}" "${uploadedFile.originalname}"`;

    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(stderr);
            return res.status(500).json({ error: 'Error processing image' });
        }
        const txtFile = path.join(__dirname, 'images/results/detected_items.txt');
        fs.readFile(txtFile, 'utf8', (err, data) => {
            if (err) return res.status(500).json({ error: 'Could not read result file' });
            res.json({ result: data });
        });
    });
});