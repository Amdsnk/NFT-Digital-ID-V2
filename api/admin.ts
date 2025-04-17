// Full admin login page that doesn't redirect
export default function handler(req, res) {
  // Set content type to HTML
  res.setHeader('Content-Type', 'text/html');
  
  // Send a standalone admin login page
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Admin Login</title>
  <style>
    body {
      font-family: sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f0f2f5;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .login-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }
    .icon-container {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }
    .icon {
      background-color: #0070f3;
      color: white;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    h1 {
      margin: 0 0 24px 0;
      color: #333;
      font-size: 24px;
      text-align: center;
    }
    p {
      margin: 0 0 24px 0;
      color: #666;
      text-align: center;
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: #0070f3;
      box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
    }
    button {
      width: 100%;
      padding: 12px;
      background-color: #0070f3;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #0060df;
    }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .error {
      color: #e00;
      margin-top: 16px;
      text-align: center;
    }
    .success {
      color: #0a0;
      margin-top: 16px;
      text-align: center;
    }
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="login-card">
    <div class="icon-container">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
    </div>
    <h1>Admin Login</h1>
    <p>Sign in to access the admin dashboard</p>
    
    <form id="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" placeholder="Enter your username" value="admin" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Enter your password" value="admin123" />
      </div>
      <button type="submit" id="login-button">Login</button>
    </form>
    
    <div id="message"></div>
  </div>

  <script>
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const messageEl = document.getElementById('message');
      const button = document.getElementById('login-button');
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (!username || !password) {
        messageEl.className = 'error';
        messageEl.textContent = 'Please enter both username and password';
        return;
      }
      
      try {
        // Disable button and show loading
        button.disabled = true;
        button.innerHTML = '<span class="spinner"></span> Logging in...';
        messageEl.textContent = '';
        
        // Call the API
        const response = await fetch('/api/auth/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Success!
          messageEl.className = 'success';
          messageEl.textContent = 'Login successful. Redirecting to admin dashboard...';
          
          // Store auth data in localStorage
          localStorage.setItem('adminSession', JSON.stringify({
            isAdmin: true,
            username: username,
            token: data.token,
            timestamp: Date.now()
          }));
          
          // Redirect to admin dashboard
          setTimeout(() => {
            window.location.href = '/admin';
          }, 1000);
        } else {
          // API error
          messageEl.className = 'error';
          messageEl.textContent = data.message || 'Login failed. Please check your credentials.';
          button.disabled = false;
          button.textContent = 'Login';
        }
      } catch (error) {
        // Network or other error
        messageEl.className = 'error';
        messageEl.textContent = 'An error occurred. Please try again.';
        console.error('Login error:', error);
        button.disabled = false;
        button.textContent = 'Login';
      }
    });
  </script>
</body>
</html>
  `;
  
  res.status(200).send(html);
} 