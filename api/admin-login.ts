// Simple admin login page with smart redirect
export default function handler(req, res) {
  // Set content type to HTML
  res.setHeader('Content-Type', 'text/html');
  
  // Send a minimal HTML page that will redirect to the admin-login route in the SPA
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Admin Login</title>
  <script>
    // This will ensure correct navigation regardless of how the user accessed the page
    window.addEventListener('DOMContentLoaded', function() {
      // If we're accessing via /api/admin-login, redirect to /admin-login
      if (window.location.pathname.includes('/api/admin-login')) {
        window.location.href = '/admin-login';
        return;
      }
      
      // If we're directly on /admin-login (not hash-based routing)
      if (window.location.pathname === '/admin-login') {
        // Check if we should use hash-based routing
        if (!window.location.hash.includes('admin-login')) {
          window.location.hash = '/admin-login';
        }
      }
    });
  </script>
  <style>
    body {
      font-family: sans-serif;
      text-align: center;
      padding: 50px;
      background: #f0f2f5;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Admin Login</h1>
    <p>Redirecting to the admin login page...</p>
    <p>If you are not redirected, <a href="/#/admin-login">click here</a>.</p>
  </div>
</body>
</html>
  `;
  
  res.status(200).send(html);
} 