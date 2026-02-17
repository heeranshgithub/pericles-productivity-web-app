# PDF Export Endpoint Usage Guide

## Endpoint Details

**URL:** `POST /notes/export-pdf`  
**Auth:** Required (JWT Bearer token)  
**Content-Type:** `application/json`

## Request Body

```json
{
  "htmlContent": "<html><body><h1>Your HTML here</h1></body></html>",
  "filename": "optional-filename.pdf"
}
```

### Parameters

- `htmlContent` (required): HTML string to convert to PDF
  - Maximum length: 500,000 characters
  - Supports full CSS styling
  - Images and external resources loaded via network

- `filename` (optional): Custom filename for the downloaded PDF
  - Maximum length: 100 characters
  - Defaults to `document.pdf` if not provided

## Response

- **Status:** 200 OK
- **Content-Type:** `application/pdf`
- **Content-Disposition:** `attachment; filename="<filename>"`
- **Body:** Binary PDF stream

## Testing Methods

### Method 1: Using curl

```bash
# Replace YOUR_TOKEN with your JWT token
curl -X POST http://localhost:3000/notes/export-pdf \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "htmlContent": "<html><body><h1>Test</h1><p>Hello World!</p></body></html>",
    "filename": "test.pdf"
  }' \
  --output test.pdf
```

### Method 2: Using the test script

```bash
# Get your auth token first by logging in
node test-pdf-endpoint.js YOUR_TOKEN
```

### Method 3: Using Postman/Insomnia

1. Create a new POST request to `http://localhost:3000/notes/export-pdf`
2. Add header: `Authorization: Bearer YOUR_TOKEN`
3. Add header: `Content-Type: application/json`
4. Set body to raw JSON:
   ```json
   {
     "htmlContent": "<html><body><h1>Test</h1></body></html>",
     "filename": "test.pdf"
   }
   ```
5. Send request and save response as PDF file

## Example HTML Templates

### Simple Document

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; padding: 40px; }
    h1 { color: #2c3e50; }
  </style>
</head>
<body>
  <h1>My Document</h1>
  <p>Content goes here...</p>
</body>
</html>
```

### Styled Report

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Courier New', monospace;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: #f8f9fa;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .content {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Monthly Report</h1>
    <p>Generated on: 2026-02-16</p>
  </div>
  <div class="content">
    <h2>Summary</h2>
    <p>Your report content here...</p>
  </div>
</body>
</html>
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Failed to generate PDF: [error details]"
}
```

Common causes:
- Invalid HTML syntax
- Puppeteer launch failure
- Rendering timeout

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

Cause: Missing or invalid JWT token

### 422 Validation Error
```json
{
  "statusCode": 422,
  "message": ["htmlContent must be a string", "htmlContent should not be empty"]
}
```

Cause: Invalid request body (missing required fields, exceeding limits)

## PDF Configuration

The generated PDFs have the following settings:

- **Format:** A4 (210mm × 297mm)
- **Margins:** 20px on all sides
- **Background:** Preserved (includes CSS backgrounds)
- **Images:** Loaded from external URLs
- **Fonts:** System fonts available

## Performance Notes

- PDF generation takes 2-5 seconds on average
- Each request spawns a headless Chrome instance
- Complex HTML with many images may take longer
- Concurrent requests are supported but CPU-intensive

## Security Considerations

- Maximum HTML size: 500KB (prevents abuse)
- Puppeteer runs in sandbox mode (disabled for Docker/server environments)
- Filenames are not sanitized by default - validate in production
- Consider rate limiting for production use
