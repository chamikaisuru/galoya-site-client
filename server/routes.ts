import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertPortfolioItemSchema, insertProductSchema } from "@shared/schema";
import { login, logout, getCurrentUser, requireAuth } from "./auth";
import { sendContactEmail } from "./email";

// Extend session data type
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============ SESSION SETUP ============
  // CRITICAL: Session must be configured before any routes
  const sessionSecret = process.env.SESSION_SECRET || "galoya-arrack-secret-key-change-in-production-" + Date.now();
  
  console.log("🔐 Configuring session middleware...");
  
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      name: 'galoya.sid', // Custom session cookie name
      cookie: {
        secure: process.env.NODE_ENV === "production", // true in production with HTTPS
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        path: '/', // Ensure cookie is available for all paths
      },
      rolling: true, // Reset expiry on each request
    })
  );

  console.log("✅ Session middleware configured");

  // Add session debugging middleware in development
  if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
      console.log("📋 Session Debug:", {
        sessionID: req.sessionID,
        userId: req.session?.userId,
        cookie: req.session?.cookie,
        path: req.path
      });
      next();
    });
  }

  // ============ AUTH ROUTES ============
  app.post("/api/auth/login", login);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", getCurrentUser);

  // ============ CONTACT FORM ROUTE ============
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      await sendContactEmail({ name, email, phone, message });

      res.json({ 
        message: "Message sent successfully",
        success: true 
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // ============ PORTFOLIO ROUTES ============
  
  // Get all portfolio items (public)
  app.get("/api/portfolio", async (req, res) => {
    try {
      const items = await storage.getAllPortfolioItems();
      res.json(items);
    } catch (error) {
      console.error("Get portfolio error:", error);
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });

  // Get single portfolio item by slug (public)
  app.get("/api/portfolio/:slug", async (req, res) => {
    try {
      const item = await storage.getPortfolioItemBySlug(req.params.slug);
      if (!item) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Get portfolio item error:", error);
      res.status(500).json({ message: "Failed to fetch portfolio item" });
    }
  });

  // Create portfolio item (Admin only)
  app.post("/api/portfolio", requireAuth, async (req, res) => {
    try {
      const validated = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createPortfolioItem(validated);
      res.status(201).json(item);
    } catch (error) {
      console.error("Create portfolio error:", error);
      res.status(400).json({ message: "Invalid portfolio data", error });
    }
  });

  // Update portfolio item (Admin only)
  app.put("/api/portfolio/:id", requireAuth, async (req, res) => {
    try {
      const item = await storage.updatePortfolioItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Update portfolio error:", error);
      res.status(400).json({ message: "Failed to update portfolio item" });
    }
  });

  // Delete portfolio item (Admin only)
  app.delete("/api/portfolio/:id", requireAuth, async (req, res) => {
    try {
      await storage.deletePortfolioItem(req.params.id);
      res.json({ message: "Portfolio item deleted" });
    } catch (error) {
      console.error("Delete portfolio error:", error);
      res.status(500).json({ message: "Failed to delete portfolio item" });
    }
  });

  // ============ PRODUCTS ROUTES ============
  
  // Get all products (public)
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await storage.getAllProducts();
      res.json(allProducts);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product by slug (public)
  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create product (Admin only)
  app.post("/api/products", requireAuth, async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      console.error("Create product error:", error);
      res.status(400).json({ message: "Invalid product data", error });
    }
  });

  // Update product (Admin only)
  app.put("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Update product error:", error);
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  // Delete product (Admin only)
  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ message: "Product deleted" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  return httpServer;
}