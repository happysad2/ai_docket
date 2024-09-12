const express = require('express');
const multer = require('multer');
const tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
// const { appendToSheet } = require('./googleSheets'); 

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve the front-end from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// Handle image upload and OCR
app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;

  try {
    // Check if the uploaded file is an image (optional check)
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.tiff'];

    if (!allowedExtensions.includes(fileExt)) {
      return res.status(400).json({ message: 'Only image files are supported' });
    }

    // Use Tesseract for OCR on the uploaded image
    tesseract.recognize(filePath, 'eng', { logger: m => console.log(m) })
      .then(async ({ data: { text } }) => {
        // Send back the extracted text as a response
        res.json({ message: 'File processed successfully', text: text });

        // Send the extracted text to Google Sheets
        // await appendToSheet(text);

        // Optionally, delete the file after processing
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      })
      .catch(err => {
        console.error('Error during OCR:', err);
        res.status(500).json({ message: 'Error during processing' });
      });
  } catch (err) {
    console.error('Error handling the image:', err);
    res.status(500).json({ message: 'Error processing file' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
