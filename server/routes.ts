import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertPortfolioItemSchema, insertProductSchema, insertAwardSchema } from "@shared/schema";
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
  const sessionSecret = process.env.SESSION_SECRET || "galoya-arrack-secret-key-change-in-production-" + Date.now();
  
  console.log("🔐 Configuring session middleware...");
  
  app.set('trust proxy', 1);
  
  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      name: 'galoya.sid',
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
      },
      rolling: true,
    })
  );

  console.log("✅ Session middleware configured");

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
  
  app.get("/api/portfolio", async (req, res) => {
    try {
      const items = await storage.getAllPortfolioItems();
      res.json(items);
    } catch (error) {
      console.error("Get portfolio error:", error);
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });

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
  
  app.get("/api/products", async (req, res) => {
    try {
      const allProducts = await storage.getAllProducts();
      res.json(allProducts);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

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

  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ message: "Product deleted" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ============ AWARDS ROUTES ============
  console.log("📋 Registering Awards routes...");
  
  app.get("/api/awards", async (req, res) => {
    try {
      console.log("📥 GET /api/awards - Fetching all awards");
      const allAwards = await storage.getAllAwards();
      console.log(`✅ Found ${allAwards.length} awards`);
      res.json(allAwards);
    } catch (error) {
      console.error("❌ Get awards error:", error);
      res.status(500).json({ message: "Failed to fetch awards" });
    }
  });

  app.get("/api/awards/:id", async (req, res) => {
    try {
      console.log(`📥 GET /api/awards/${req.params.id}`);
      const award = await storage.getAward(req.params.id);
      if (!award) {
        return res.status(404).json({ message: "Award not found" });
      }
      res.json(award);
    } catch (error) {
      console.error("❌ Get award error:", error);
      res.status(500).json({ message: "Failed to fetch award" });
    }
  });

  app.post("/api/awards", requireAuth, async (req, res) => {
    try {
      console.log("📥 POST /api/awards - Creating award");
      const validated = insertAwardSchema.parse(req.body);
      const award = await storage.createAward(validated);
      console.log("✅ Award created:", award.id);
      res.status(201).json(award);
    } catch (error) {
      console.error("❌ Create award error:", error);
      res.status(400).json({ message: "Invalid award data", error });
    }
  });

  app.put("/api/awards/:id", requireAuth, async (req, res) => {
    try {
      console.log(`📥 PUT /api/awards/${req.params.id} - Updating award`);
      const award = await storage.updateAward(req.params.id, req.body);
      if (!award) {
        return res.status(404).json({ message: "Award not found" });
      }
      console.log("✅ Award updated:", award.id);
      res.json(award);
    } catch (error) {
      console.error("❌ Update award error:", error);
      res.status(400).json({ message: "Failed to update award" });
    }
  });

  app.delete("/api/awards/:id", requireAuth, async (req, res) => {
    try {
      console.log(`📥 DELETE /api/awards/${req.params.id} - Deleting award`);
      await storage.deleteAward(req.params.id);
      console.log("✅ Award deleted");
      res.json({ message: "Award deleted" });
    } catch (error) {
      console.error("❌ Delete award error:", error);
      res.status(500).json({ message: "Failed to delete award" });
    }
  });

  console.log("✅ Awards routes registered successfully");

  return httpServer;
}