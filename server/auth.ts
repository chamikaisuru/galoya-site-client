import { type Request, type Response, type NextFunction } from "express";
import { storage } from "./storage";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// ============================================
// 🔒 MIDDLEWARE - Check Authentication
// ============================================
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Only log in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("🔒 Auth check:", {
      sessionID: req.sessionID,
      userId: req.session?.userId,
      path: req.path
    });
  }

  // ✅ Session නැත්නම් 401 error
  if (!req.session?.userId) {
    if (process.env.NODE_ENV === "development") {
      console.log("❌ Authentication failed - No userId in session");
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  if (process.env.NODE_ENV === "development") {
    console.log("✅ Authentication successful - User ID:", req.session.userId);
  }
  next();
}

// ============================================
// 🔐 PASSWORD FUNCTIONS
// ============================================

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================
// 🔐 LOGIN HANDLER
// ============================================
export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (process.env.NODE_ENV === "development") {
      console.log("🔐 Login attempt for:", username);
    }

    // Validate input
    if (!username || !password) {
      if (process.env.NODE_ENV === "development") {
        console.log("❌ Missing credentials");
      }
      return res.status(400).json({ message: "Username and password required" });
    }

    // Get user from database
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      if (process.env.NODE_ENV === "development") {
        console.log("❌ User not found:", username);
      }
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    
    if (!isValid) {
      if (process.env.NODE_ENV === "development") {
        console.log("❌ Invalid password for:", username);
      }
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Login වෙලා session හදනවා
    // CRITICAL: Regenerate session on login to prevent fixation attacks
    req.session.regenerate((err) => {
      if (err) {
        console.error("❌ Session regeneration failed:", err);
        return res.status(500).json({ message: "Login failed" });
      }

      // Set user ID in new session
      req.session!.userId = user.id;

      // ✅ Session හරියට save වෙනවා
      // Save session explicitly
      req.session!.save((err) => {
        if (err) {
          console.error("❌ Session save failed:", err);
          return res.status(500).json({ message: "Login failed" });
        }

        if (process.env.NODE_ENV === "development") {
          console.log("✅ Login successful:", {
            username: user.username,
            userId: user.id,
            sessionID: req.sessionID
          });
        }

        res.json({ 
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username
          }
        });
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

  if (process.env.NODE_ENV === "development") {
    console.log("🚪 Logout request:", { sessionId, userId });
  }

  if (!req.session) {
    if (process.env.NODE_ENV === "development") {
      console.log("⚠️ No session found for logout");
    }
    return res.json({ message: "Already logged out" });
  }

  // ✅ Logout කරනකොට session destroy කරනවා
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Session destruction failed:", err);
      return res.status(500).json({ message: "Logout failed" });
    }

    // ✅ Session හරියට clear වෙනවා
    // Clear the session cookie
    res.clearCookie('galoya.sid', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax'
    });

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Logout successful:", { sessionId, userId });
    }
    
    res.json({ message: "Logout successful" });
  });
}

// ============================================
// 👤 GET CURRENT USER
// ============================================
export async function getCurrentUser(req: Request, res: Response) {
  if (process.env.NODE_ENV === "development") {
    console.log("👤 Get current user:", {
      sessionID: req.sessionID,
      userId: req.session?.userId
    });
  }

  if (!req.session?.userId) {
    if (process.env.NODE_ENV === "development") {
      console.log("❌ No userId in session");
    }
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await storage.getUser(req.session.userId);
    
    if (!user) {
      if (process.env.NODE_ENV === "development") {
        console.log("❌ User not found in database:", req.session.userId);
      }
      
      // Clear invalid session
      req.session.destroy(() => {});
      res.clearCookie('galoya.sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax'
      });
      
      return res.status(401).json({ message: "User not found" });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Current user found:", user.username);
    }
    
    res.json({
      id: user.id,
      username: user.username
    });
  } catch (error) {
    console.error("❌ Get current user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}