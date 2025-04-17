import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";

// For Neon serverless driver
neonConfig.webSocketConstructor = ws;

// Vercel serverless function
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    // Use a mock database URL for development if not provided
    const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mock_db';
    
    // Create a new pool for this request
    const pool = new Pool({ 
      connectionString: DATABASE_URL,
      max: 1,
      idleTimeoutMillis: 120000,
      connectionTimeoutMillis: 10000
    });
    
    try {
      // Use a raw SQL query instead of schema
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT * FROM badges');
        res.status(200).json(result.rows);
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        message: "Database error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } finally {
      // Close pool
      await pool.end();
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
} 