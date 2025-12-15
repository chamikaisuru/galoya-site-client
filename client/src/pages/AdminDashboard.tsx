import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { usePortfolio, useCreatePortfolio, useUpdatePortfolio, useDeletePortfolio } from "@/hooks/usePortfolio";
import type { InsertPortfolioItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Trash2, Edit, LogOut, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Category = "csr" | "plantation" | "distillery" | "bottle_shots";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Fetch data from database
  const { data: items, isLoading } = usePortfolio();
  const createMutation = useCreatePortfolio();
  const updateMutation = useUpdatePortfolio();
  const deleteMutation = useDeletePortfolio();
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<InsertPortfolioItem>>({});

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🔐 Checking authentication...");
        
        const response = await fetch("/api/auth/me", { 
          credentials: "include" 
        });
        
        console.log("📥 Auth check response:", response.status);
        
        if (!response.ok) {
          console.log("❌ Not authenticated, redirecting to login...");
          setIsAuthenticated(false);
          setLocation("/admin/login");
          return;
        }
        
        const userData = await response.json();
        console.log("✅ Authenticated as:", userData);
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error("❌ Auth check error:", error);
        setIsAuthenticated(false);
        setLocation("/admin/login");
      } finally {
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");
      
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully."
      });
      
      console.log("✅ Logout successful, redirecting...");
      window.location.href = "/admin/login";
      
    } catch (error) {
      console.error("❌ Logout error:", error);
      window.location.href = "/admin/login";
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMutation.mutateAsync(id);
        toast({ 
          title: "Item Deleted", 
          description: "Portfolio item removed successfully." 
        });
      } catch (error) {
        toast({ 
          variant: "destructive",
          title: "Delete Failed", 
          description: "Could not delete the item." 
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      if (!currentItem.title || !currentItem.category || !currentItem.thumbnail) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill all required fields"
        });
        return;
      }

      if ("id" in currentItem && currentItem.id) {
        await updateMutation.mutateAsync({ 
          id: currentItem.id, 
          data: currentItem as Partial<InsertPortfolioItem>
        });
        toast({ title: "Item Updated", description: "Changes saved successfully." });
      } else {
        const newItem: InsertPortfolioItem = {
          slug: currentItem.title?.toLowerCase().replace(/\s+/g, '-') || "new-item",
          title: currentItem.title!,
          category: currentItem.category!,
          thumbnail: currentItem.thumbnail!,
          date: currentItem.date || new Date().toLocaleDateString(),
          description: currentItem.description || "",
          images: currentItem.images || [currentItem.thumbnail!]
        };
        
        await createMutation.mutateAsync(newItem);
        toast({ title: "Item Created", description: "New portfolio item added." });
      }
      
      setIsEditing(false);
      setCurrentItem({});
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save the item"
      });
    }
  };

  // Show loading while checking auth
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const categoryStats = items?.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="min-h-screen bg-background pt-20 pb-24 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your portfolio content</p>
          </div>
          <div className="flex gap-4">
             <Link href="/">
                <Button variant="outline" className="border-white/10">View Site</Button>
             </Link>
             <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
             </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))
          ) : (
            <>
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">All Items</h3>
                <p className="text-3xl font-bold font-serif text-primary">{items?.length || 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">CSR Events</h3>
                <p className="text-3xl font-bold font-serif text-primary">{categoryStats.csr || 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Plantation</h3>
                <p className="text-3xl font-bold font-serif text-primary">{categoryStats.plantation || 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Distillery</h3>
                <p className="text-3xl font-bold font-serif text-primary">{categoryStats.distillery || 0}</p>
              </div>
            </>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex justify-end mb-6">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setCurrentItem({ category: "csr", images: [] })} 
                className="bg-primary text-black hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{"id" in currentItem ? "Edit Item" : "Create New Item"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Title *</label>
                  <Input 
                    value={currentItem.title || ""} 
                    onChange={e => setCurrentItem({...currentItem, title: e.target.value})}
                    placeholder="Event Title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Category *</label>
                    <Select 
                      value={currentItem.category} 
                      onValueChange={(val: Category) => setCurrentItem({...currentItem, category: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csr">CSR</SelectItem>
                        <SelectItem value="plantation">Plantation</SelectItem>
                        <SelectItem value="distillery">Distillery</SelectItem>
                        <SelectItem value="bottle_shots">Bottle Shots</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Date</label>
                    <Input 
                      value={currentItem.date || ""} 
                      onChange={e => setCurrentItem({...currentItem, date: e.target.value})}
                      placeholder="Month Year"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Description</label>
                  <Textarea 
                    value={currentItem.description || ""} 
                    onChange={e => setCurrentItem({...currentItem, description: e.target.value})}
                    placeholder="Short description..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Thumbnail URL *</label>
                  <Input 
                     value={currentItem.thumbnail || ""} 
                     onChange={e => setCurrentItem({...currentItem, thumbnail: e.target.value})}
                     placeholder="/attached_assets/..."
                  />
                </div>
                <Button 
                  onClick={handleSave} 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full bg-primary text-black"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Data Table */}
        <div className="rounded-md border border-white/10 bg-white/5 overflow-hidden">
          <Table>
            <TableHeader className="bg-black/20">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white">Thumbnail</TableHead>
                <TableHead className="text-white">Title</TableHead>
                <TableHead className="text-white">Category</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-right text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5">
                    <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                items?.map((item) => (
                  <TableRow key={item.id} className="border-white/5 hover:bg-white/5">
                    <TableCell>
                      <img src={item.thumbnail} alt={item.title} className="h-10 w-10 rounded object-cover" />
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 rounded-full bg-white/10 text-xs uppercase tracking-wider">
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setCurrentItem(item);
                            setIsEditing(true);
                          }}
                        >
                          <Edit className="h-4 w-4 text-primary" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-400" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}