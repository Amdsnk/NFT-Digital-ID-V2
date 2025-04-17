import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

// Create default admin for development/testing purposes
async function ensureAdminExists() {
  try {
    // Check if any admin users exist
    const users = await storage.getAllUsers();
    const adminExists = users.some(user => user.isAdmin);
    
    if (!adminExists) {
      // Create a default admin user
      await storage.createUser({
        username: "admin",
        password: "admin123", // In production, use a secure password and hash it
        walletAddress: "0x0000000000000000000000000000000000000000",
        email: "admin@example.com",
        isAdmin: true
      });
      
      log("Created default admin user (username: admin, password: admin123)", "setup");
    }
  } catch (error) {
    console.error("Error creating default admin:", error);
    // Don't throw the error, just log it - we don't want to crash the server on startup
  }
}

// Create and export the Express app for Vercel serverless
export const app = express();

// Add CORS headers for Vercel deployment
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Basic error handler for database connection issues
app.use("/api/*", async (req, res, next) => {
  try {
    // Simple ping to database to check connection
    await storage.ping().catch((err) => {
      console.error("Database connection error:", err);
      throw new Error("Database connection failed");
    });
    next();
  } catch (err) {
    console.error("API pre-check error:", err);
    return res.status(500).json({ 
      message: "Database connection error. Please check your connection string.",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV });
});

// Initialize function for both local server and Vercel
const initializeApp = async () => {
  try {
    // Ensure admin user exists - but don't block server start if this fails
    await ensureAdminExists().catch(err => {
      console.error("Admin user creation failed but continuing startup:", err);
    });
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Express error handler:", err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      // Don't throw here as it will crash the server - just log the error
      // throw err; <- This can cause issues in serverless environments
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    
    return server;
  } catch (error) {
    console.error("Failed to initialize app:", error);
    // Add a fallback route handler for when initialization fails
    app.use("/api/*", (req, res) => {
      res.status(500).json({ 
        message: "Server initialization failed",
        path: req.path,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    });
    
    return null; // Return null instead of crashing
  }
};

// Only start the server if we're running directly (not imported by Vercel)
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const server = await initializeApp();
    
    if (!server) {
      console.error("Failed to start server");
      process.exit(1);
    }
    
    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  })();
} else {
  // Initialize the app for Vercel
  initializeApp().catch(err => {
    console.error("Failed to initialize app for serverless:", err);
    // Don't crash the serverless function, just log the error
  });
}

// Export for Vercel
export default app;
