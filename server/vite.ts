import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // detect if we're running in production or development
  const isProd = app.get("env") === "production";

  if (isProd) {
    serveStatic(app);
  } else {
    const vite = await import("vite");
    const viteDevMiddleware = await vite.createServer({
      middlewareMode: true as any,
      hmr: {
        server,
      },
      allowedHosts: true as true,
    });

    // add vite middleware
    app.use(viteDevMiddleware.middlewares);

    app.use("*", async (req, res, next) => {
      try {
        const indexPath = path.resolve("client", "index.html");
        if (!fs.existsSync(indexPath)) {
          throw new Error(`Could not find the index at: ${indexPath}`);
        }

        let html = fs.readFileSync(indexPath, "utf-8");
        html = await viteDevMiddleware.transformIndexHtml(req.originalUrl, html);

        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (error) {
        console.error("Vite middleware error:", error);
        next(error);
      }
    });

    console.log("Vite middleware registered");
  }
}

export function serveStatic(app: Express) {
  const serveStaticOptions = {
    extensions: ["html"],
    index: false,
  };

  const publicDir = path.join(process.cwd(), "dist", "public");
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir, serveStaticOptions));
  }

  // Handle admin routes and admin-login separately
  app.get(['/admin', '/admin/*', '/admin-login'], (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "public", "index.html"));
  });

  // Handle any remaining routes with index.html for SPA routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "public", "index.html"));
  });
}
