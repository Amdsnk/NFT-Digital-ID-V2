module.exports = (req, res) => {
  // Set headers to handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Redirect to the home page with the admin-login hash route
  res.statusCode = 302;
  res.setHeader('Location', '/#/admin-login');
  res.end();
}; 