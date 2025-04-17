// Special endpoint to handle client-side routing
export default function handler(req, res) {
  // Set content type to HTML
  res.setHeader('Content-Type', 'text/html');
  
  // Send the index.html with base path
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NFT Dashboard</title>
  <script>
    // This script ensures the app loads the correct route
    window.initialPath = "${req.url}";
    
    // Redirect to index with the correct route
    window.location.href = "/#${req.url}";
  </script>
</head>
<body>
  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; color: #555;">
    <div style="text-align: center;">
      <h2>Loading...</h2>
      <p>Please wait while we redirect you to the correct page.</p>
    </div>
  </div>
</body>
</html>`;
  
  res.status(200).send(html);
} 