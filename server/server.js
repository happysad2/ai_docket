const express = require('express');
const multer = require('multer');
const tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');
const serverless = require('serverless-http');
const mkdirp = require('mkdirp');
const cors = require('cors');

const app = express();

// Use /tmp/uploads for file storage (Lambda can only write to /tmp)
const upload = multer({
  dest: '/tmp/uploads/'
});

// Ensure the /tmp/uploads directory exists
mkdirp.sync('/tmp/uploads');

// Enable CORS for all routes or specify origin(s)
app.use(cors({
  origin: 'https://imagescanai.s3.ap-southeast-2.amazonaws.com',  // Replace with your front-end origin
  credentials: true, // If you need to support cookies or credentials
}));

// Serve the front-end (optional for Lambda; remove if serving from S3)
app.get('/', (req, res) => {
  res.send('API is running');
});

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
      .then(({ data: { text } }) => {
        // Send back the extracted text as a response
        res.json({ message: 'File processed successfully', text: text });

        // Delete the file after processing
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      })
      .catch(err => {
        console.error('Error during OCR:', err);
        res.status(500).json({ message: 'Error during processing', error: err.message });
      });
  } catch (err) {
    console.error('Error handling the image:', err);
    res.status(500).json({ message: 'Error processing file', error: err.message });
  }
});

// Export the handler for AWS Lambda
module.exports.handler = serverless(app);
