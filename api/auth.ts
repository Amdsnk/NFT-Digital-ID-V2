import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";

// For Neon serverless driver
neonConfig.webSocketConstructor = ws;

// Vercel serverless function
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  console.log("Auth API call received");
  console.log("Request method:", req.method);
  console.log("Content-Type:", req.headers['content-type']);
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Parse request body carefully
    let username, password;
    
    try {
      // Handle various ways the body might be passed
      if (typeof req.body === 'string') {
        const parsed = JSON.parse(req.body);
        username = parsed.username;
        password = parsed.password;
      } else if (req.body && typeof req.body === 'object') {
        // Body is already parsed
        username = req.body.username;
        password = req.body.password;
      } else {
        console.log("Request body format unknown:", typeof req.body);
        console.log("Raw body:", req.body);
      }
    } catch (parseError) {
      console.error("Body parse error:", parseError);
      return res.status(400).json({ 
        message: 'Invalid JSON in request body',
        error: parseError.message
      });
    }
    
    console.log("Auth attempt for username:", username);
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Always allow admin login for testing
    if (username === 'admin' && password === 'admin123') {
      const response = {
        token: 'admin-token',
        user: {
          id: 1,
          username: 'admin',
          isAdmin: true
        }
      };
      console.log("Auth successful for admin");
      return res.status(200).json(response);
    }
    
    // Try database lookup (if DATABASE_URL is configured)
    try {
      const DATABASE_URL = process.env.DATABASE_URL;
      if (DATABASE_URL) {
        const pool = new Pool({ 
          connectionString: DATABASE_URL,
          max: 1,
          idleTimeoutMillis: 10000,
          connectionTimeoutMillis: 5000
        });
        
        try {
          const client = await pool.connect();
          try {
            const result = await client.query(
              'SELECT * FROM users WHERE username = $1 AND password = $2 AND is_admin = true',
              [username, password]
            );
            
            if (result.rows.length > 0) {
              const user = result.rows[0];
              const response = {
                token: `${user.id}|true`,
                user: {
                  id: user.id,
                  username: user.username,
                  isAdmin: true
                }
              };
              console.log("Auth successful for database user");
              return res.status(200).json(response);
            }
          } finally {
            client.release();
          }
        } finally {
          await pool.end();
        }
      }
    } catch (dbError) {
      console.error("Database auth error (continuing with default logic):", dbError);
    }
    
    // If we get here, authentication failed
    console.log("Auth failed for user:", username);
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
} 