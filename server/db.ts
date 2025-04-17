import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// For Neon serverless driver
neonConfig.webSocketConstructor = ws;

// Use a mock database URL for development if not provided
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mock_db';

// Configure pool with proper settings for serverless environment
const pool = new Pool({ 
  connectionString: DATABASE_URL,
  // Add better connection management for serverless environment
  max: 1, // Reduce connections for serverless
  idleTimeoutMillis: 120000, // 2 minutes
  connectionTimeoutMillis: 10000, // 10 seconds
  // Log connection errors
  onError: (err, client) => {
    console.error('Neon Database Connection Error:', err);
    // Don't crash the app, just log the error
  }
});

// Safeguard against unhandled pool errors
pool.on('error', (err) => {
  console.error('Unexpected Neon pool error:', err);
  // Don't crash in production
});

// Export with error handling
export { pool };
export const db = drizzle(pool, { schema });

// Add a health check function
export async function checkDbConnection() {
  let client = null;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT 1');
    return result.rows.length > 0;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  } finally {
    if (client) client.release();
  }
}
