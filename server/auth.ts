import { type Request, type Response, type NextFunction } from "express";
import { storage } from "./storage";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// ============================================
// 🔒 MIDDLEWARE - Check Authentication
// ============================================
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log("🔒 Auth check:", {
    sessionID: req.sessionID,
    userId: req.session?.userId,
    path: req.path
  });

  if (!req.session?.userId) {
    console.log("❌ Authentication failed - No userId in session");
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  console.log("✅ Authentication successful - User ID:", req.session.userId);
  next();
}

// ============================================
// 🔐 PASSWORD FUNCTIONS
// ============================================
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================
// 🔐 LOGIN HANDLER - FIXED VERSION
// ============================================
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    console.log("🔐 Login attempt:", {
      username,
      sessionID: req.sessionID,
      hasSession: !!req.session
    });

    // Validate input
    if (!username || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({ message: "Username and password required" });
    }

    // Get user from database
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      console.log("❌ User not found:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    
    if (!isValid) {
      console.log("❌ Invalid password for:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ SUCCESS - Create session
    console.log("✅ Password verified, creating session...");

    // Set userId in session
    req.session!.userId = user.id;

    // CRITICAL: Save session before responding
    req.session!.save((err) => {
      if (err) {
        console.error("❌ Session save failed:", err);
        return res.status(500).json({ message: "Login failed - session error" });
      }

      console.log("✅ Session saved successfully:", {
        sessionID: req.sessionID,
        userId: req.session!.userId
      });

      res.json({ 
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username
        }
      });
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// ============================================
// 🚪 LOGOUT HANDLER
// ============================================
export async function logout(req: Request, res: Response) {
  const sessionId = req.sessionID;
  const userId = req.session?.userId;

  console.log("🚪 Logout request:", { sessionId, userId });

  if (!req.session) {
    console.log("⚠️ No session found for logout");
    return res.json({ message: "Already logged out" });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Session destruction failed:", err);
      return res.status(500).json({ message: "Logout failed" });
    }

    res.clearCookie('galoya.sid', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax'
    });

    console.log("✅ Logout successful:", { sessionId, userId });
    
    res.json({ message: "Logout successful" });
  });
}

// ============================================
// 👤 GET CURRENT USER
// ============================================
export async function getCurrentUser(req: Request, res: Response) {
  console.log("👤 Get current user:", {
    sessionID: req.sessionID,
    userId: req.session?.userId
  });

  if (!req.session?.userId) {
    console.log("❌ No userId in session");
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await storage.getUser(req.session.userId);
    
    if (!user) {
      console.log("❌ User not found in database:", req.session.userId);
      
      req.session.destroy(() => {});
      res.clearCookie('galoya.sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax'
      });
      
      return res.status(401).json({ message: "User not found" });
    }

    console.log("✅ Current user found:", user.username);
    
    res.json({
      id: user.id,
      username: user.username
    });
  } catch (error) {
    console.error("❌ Get current user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}