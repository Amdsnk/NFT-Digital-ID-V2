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
  
  let pool = null;
  let client = null;
  
  try {
    // Get database URL
    const DATABASE_URL = process.env.DATABASE_URL;
    
    if (!DATABASE_URL) {
      return res.status(500).json({
        message: "Database URL not found in environment",
        error: "Missing DATABASE_URL environment variable",
        help: "Make sure DATABASE_URL is set in your Vercel environment variables"
      });
    }
    
    // Log the database URL structure (without revealing credentials)
    const dbUrlParts = new URL(DATABASE_URL);
    const connectionInfo = {
      protocol: dbUrlParts.protocol,
      host: dbUrlParts.host,
      hasUsername: !!dbUrlParts.username,
      hasPassword: !!dbUrlParts.password,
      pathname: dbUrlParts.pathname,
      searchParams: Object.fromEntries(dbUrlParts.searchParams.entries()),
      hasPgBouncer: dbUrlParts.searchParams.has('pgbouncer'),
      hasSSLMode: dbUrlParts.searchParams.has('sslmode'),
      isPoolerHost: dbUrlParts.host.includes('-pooler')
    };
    
    console.log("Attempting database connection with:", connectionInfo);
    
    // Create connection pool with detailed logging
    pool = new Pool({ 
      connectionString: DATABASE_URL,
      max: 1,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 5000
    });
    
    // Log pool creation success
    console.log("Pool created successfully");
    
    // Try to connect and run a simple query
    client = await pool.connect();
    console.log("Client connected successfully");
    
    // Try to run a query to check if badges table exists
    try {
      const tablesResult = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = 'badges'
        );
      `);
      
      const badgesTableExists = tablesResult.rows[0]?.exists || false;
      
      if (badgesTableExists) {
        // If badges table exists, try to query it
        const badgesResult = await client.query('SELECT COUNT(*) FROM badges');
        const badgesCount = parseInt(badgesResult.rows[0]?.count || '0');
        
        return res.status(200).json({
          message: "Database connection successful",
          connectionInfo,
          badgesTableExists,
          badgesCount,
          success: true
        });
      } else {
        // No badges table
        return res.status(200).json({
          message: "Database connection successful but badges table not found",
          connectionInfo,
          badgesTableExists,
          error: "The badges table does not exist in your database",
          help: "Make sure your database schema is properly set up",
          success: true
        });
      }
    } catch (queryError) {
      return res.status(500).json({
        message: "Database connection succeeded but query failed",
        connectionInfo,
        error: queryError.message,
        stack: process.env.NODE_ENV === 'development' ? queryError.stack : undefined,
        success: false
      });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    
    // Provide detailed error information
    return res.status(500).json({
      message: "Database connection failed",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      help: "Check your DATABASE_URL and make sure your Neon database is properly configured with connection pooling enabled",
      connectionInfo: error.connectionInfo,
      success: false
    });
  } finally {
    // Clean up resources
    if (client) await client.release();
    if (pool) await pool.end();
  }
} 