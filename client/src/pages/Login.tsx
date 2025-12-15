import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, User, AlertCircle } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("🔐 Attempting login for:", username);
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        console.log("❌ Login failed:", data.message);
        throw new Error(data.message || "Login failed");
      }

      const data = await response.json();
      console.log("✅ Login successful:", data);

      // Verify session
      console.log("🔍 Verifying session...");
      const sessionCheck = await fetch("/api/auth/me", {
        credentials: "include"
      });
      
      console.log("🔍 Session check status:", sessionCheck.status);
      
      if (sessionCheck.ok) {
        const userData = await sessionCheck.json();
        console.log("✅ Session verified! User:", userData);
      }

      // Small delay then redirect
      console.log("🚀 Redirecting to dashboard...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      window.location.href = "/admin/dashboard";
      
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-black px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">
            GALOYA ARRACK
          </h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-card border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-bold text-foreground uppercase tracking-widest">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 h-11"
                    required
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-bold text-foreground uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary/50 h-11"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary text-black hover:bg-primary/90 h-11 text-base font-bold uppercase tracking-widest"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging In...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Debug Hint - Only visible in development */}
              {process.env.NODE_ENV === "development" && (
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Press F12 to view console logs
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-muted-foreground hover:text-primary"
          >
            ← Back to Website
          </Button>
        </div>
      </div>
    </div>
  );
}