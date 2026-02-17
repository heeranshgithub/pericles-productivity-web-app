/**
 * Test script for the PDF export endpoint
 * 
 * Usage:
 * 1. Start the backend: npm run start:dev
 * 2. Get an auth token by logging in
 * 3. Run: node test-pdf-endpoint.js <YOUR_TOKEN>
 */

const fs = require('fs');
const path = require('path');

const AUTH_TOKEN = process.argv[2] || 'YOUR_TOKEN_HERE';
const API_URL = 'http://localhost:3000/notes/export-pdf';

const sampleHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      background-color: #f5f5f5;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
    }
    p {
      line-height: 1.6;
      color: #34495e;
    }
    .highlight {
      background-color: #fff3cd;
      padding: 10px;
      border-left: 4px solid #ffc107;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>Test PDF Document</h1>
  <p>This is a test document generated from HTML using Puppeteer.</p>
  <div class="highlight">
    <strong>Note:</strong> This demonstrates the HTML to PDF conversion endpoint.
  </div>
  <h2>Features</h2>
  <ul>
    <li>CSS styling support</li>
    <li>Background colors preserved</li>
    <li>Custom margins and formatting</li>
    <li>A4 page format</li>
  </ul>
</body>
</html>
`;

async function testPdfEndpoint() {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        htmlContent: sampleHTML,
        filename: 'test-document.pdf',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const outputPath = path.join(__dirname, 'test-output.pdf');
    fs.writeFileSync(outputPath, Buffer.from(buffer));

    console.log('✅ PDF generated successfully!');
    console.log(`📄 Saved to: ${outputPath}`);
    console.log(`📊 File size: ${(buffer.byteLength / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testPdfEndpoint();
