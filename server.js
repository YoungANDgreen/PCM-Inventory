const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware for handling form data and file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Array to store form submissions with attachments
const submissions = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Serve the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submissions
app.post('/submit', upload.single('image'), (req, res) => {
  const { product, sku, qty, email, intention, sellingPrice } = req.body;
  const timestamp = new Date().toLocaleString();
  const image = req.file ? req.file.buffer.toString('base64') : null; // Convert image to base64

  const submission = { timestamp, product, sku, qty, email, intention, sellingPrice, image };
  submissions.push(submission);

  // Redirect to the home page after submission
  res.redirect('/');
});

// Serve the page displaying array contents
app.get('/submissions', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Submissions</title>
    </head>
    <body>
      <h1>Recent Submissions:</h1>
      <ul>
        ${submissions.map((submission) => `
          <li>
            <p><strong>Timestamp:</strong> ${submission.timestamp}</p>
            <p><strong>Product:</strong> ${submission.product}</p>
            <p><strong>SKU:</strong> ${submission.sku}</p>
            <p><strong>Quantity:</strong> ${submission.qty}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            <p><strong>Intention:</strong> ${submission.intention}</p>
            ${submission.sellingPrice ? `<p><strong>Selling Price:</strong> $${submission.sellingPrice}</p>` : ''}
            ${submission.image ? `<img src="data:image/jpeg;base64,${submission.image}" alt="Attached Image">` : ''}
          </li>
        `).join('')}
      </ul>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
