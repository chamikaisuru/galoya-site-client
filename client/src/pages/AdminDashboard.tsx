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
import { Plus, Trash2, Edit, LogOut, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Category = "csr" | "plantation" | "distillery" | "bottle_shots";

interface PortfolioFormData {
  id?: string;
  title: string;
  category: Category;
  thumbnail: string;
  date: string;
  description: string;
  images: string[];
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Fetch data from database
  const { data: items, isLoading, refetch } = usePortfolio();
  const createMutation = useCreatePortfolio();
  const updateMutation = useUpdatePortfolio();
  const deleteMutation = useDeletePortfolio();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: "",
    category: "csr",
    thumbnail: "",
    date: "",
    description: "",
    images: []
  });
  const [imageInput, setImageInput] = useState("");

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", { 
          credentials: "include" 
        });
        
        if (!response.ok) {
          setIsAuthenticated(false);
          setLocation("/admin/login");
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
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
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully."
      });
      
      window.location.href = "/admin/login";
    } catch (error) {
      window.location.href = "/admin/login";
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "csr",
      thumbnail: "",
      date: "",
      description: "",
      images: []
    });
    setImageInput("");
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: any) => {
    setFormData({
      id: item.id,
      title: item.title,
      category: item.category,
      thumbnail: item.thumbnail,
      date: item.date,
      description: item.description,
      images: item.images || []
    });
    setImageInput(item.images?.join("\n") || "");
    setIsDialogOpen(true);
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      const newImages = imageInput.split("\n").map(img => img.trim()).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        images: [...new Set([...prev.images, ...newImages])]
      }));
      setImageInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.title || !formData.category || !formData.thumbnail) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill all required fields"
        });
        return;
      }

      if (formData.images.length === 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please add at least one image"
        });
        return;
      }

      if (formData.id) {
        // Update existing
        await updateMutation.mutateAsync({ 
          id: formData.id, 
          data: {
            slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
            title: formData.title,
            category: formData.category,
            thumbnail: formData.thumbnail,
            date: formData.date || new Date().toLocaleDateString(),
            description: formData.description,
            images: formData.images
          }
        });
        toast({ 
          title: "Success", 
          description: "Portfolio item updated successfully." 
        });
      } else {
        // Create new
        await createMutation.mutateAsync({
          slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
          title: formData.title,
          category: formData.category,
          thumbnail: formData.thumbnail,
          date: formData.date || new Date().toLocaleDateString(),
          description: formData.description,
          images: formData.images
        });
        toast({ 
          title: "Success", 
          description: "Portfolio item created successfully." 
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save portfolio item"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast({ 
        title: "Success", 
        description: "Portfolio item deleted successfully." 
      });
      refetch();
    } catch (error) {
      toast({ 
        variant: "destructive",
        title: "Error", 
        description: "Failed to delete the item." 
      });
    }
  };

  // Loading state
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

  if (!isAuthenticated) return null;

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
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Total Items</h3>
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
          <Button 
            onClick={openCreateDialog}
            className="bg-primary text-black hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Item
          </Button>
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
                          onClick={() => openEditDialog(item)}
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

        {/* Edit/Create Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{formData.id ? "Edit Portfolio Item" : "Create New Portfolio Item"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-bold">Title *</label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData(prev => ({...prev, title: e.target.value}))}
                  placeholder="Event Title"
                  className="bg-white/5 border-white/10"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Category *</label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val: Category) => setFormData(prev => ({...prev, category: val}))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
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
                    value={formData.date} 
                    onChange={e => setFormData(prev => ({...prev, date: e.target.value}))}
                    placeholder="Month Year"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold">Description</label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Short description..."
                  className="bg-white/5 border-white/10"
                  rows={3}
                />
              </div>

              {/* Thumbnail URL */}
              <div className="space-y-2">
                <label className="text-sm font-bold">Thumbnail URL *</label>
                <Input 
                  value={formData.thumbnail} 
                  onChange={e => setFormData(prev => ({...prev, thumbnail: e.target.value}))}
                  placeholder="/attached_assets/..."
                  className="bg-white/5 border-white/10"
                />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <label className="text-sm font-bold">Gallery Images * (one per line)</label>
                <Textarea 
                  value={imageInput} 
                  onChange={e => setImageInput(e.target.value)}
                  placeholder="/attached_assets/image1.png&#10;/attached_assets/image2.png"
                  className="bg-white/5 border-white/10"
                  rows={4}
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleAddImage}
                  className="w-full"
                  size="sm"
                >
                  Add Images to Gallery
                </Button>
              </div>

              {/* Image List */}
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-bold">Gallery ({formData.images.length} images)</label>
                  <div className="border border-white/10 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto bg-white/5">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 bg-black/20 p-2 rounded">
                        <span className="text-xs text-muted-foreground truncate flex-1">{img}</span>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveImage(idx)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <Button 
                onClick={handleSave} 
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full bg-primary text-black hover:bg-primary/90"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {formData.id ? "Update Item" : "Create Item"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}