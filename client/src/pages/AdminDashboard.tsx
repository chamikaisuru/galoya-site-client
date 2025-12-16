import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { usePortfolio, useCreatePortfolio, useUpdatePortfolio, useDeletePortfolio } from "@/hooks/usePortfolio";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useAwards, useCreateAward, useUpdateAward, useDeleteAward } from "@/hooks/useAwards";
import type { InsertPortfolioItem, InsertProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Trash2, Edit, LogOut, Loader2, X, Package, Images, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Category = "csr" | "plantation" | "distillery" | "bottle_shots";
type InsertAward = {
  name: string;
  year: string;
  organization: string;
  category: string;
  description?: string;
  image?: string;
  displayOrder: string;
};

interface PortfolioFormData {
  id?: string;
  title: string;
  category: Category;
  thumbnail: string;
  date: string;
  description: string;
  images: string[];
}

interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  abv: string;
  image: string;
  description: string;
  ingredients: string;
  tastingNotes: string;
  longDescription: string;
}

type AwardFormData = {
  id?: string;
  name: string;
  year: string;
  organization: string;
  category: string;
  description: string;
  image: string;
  displayOrder: string;
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("portfolio");
  
  // Portfolio hooks
  const { data: portfolioItems, isLoading: portfolioLoading, refetch: refetchPortfolio } = usePortfolio();
  const createPortfolioMutation = useCreatePortfolio();
  const updatePortfolioMutation = useUpdatePortfolio();
  const deletePortfolioMutation = useDeletePortfolio();
  
  // Products hooks
  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = useProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  // Awards hooks
  const { data: awards, isLoading: awardsLoading, refetch: refetchAwards } = useAwards();
  const createAwardMutation = useCreateAward();
  const updateAwardMutation = useUpdateAward();
  const deleteAwardMutation = useDeleteAward();
  
  // Dialog states
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [awardDialogOpen, setAwardDialogOpen] = useState(false);
  
  // Form data states
  const [portfolioFormData, setPortfolioFormData] = useState<PortfolioFormData>({
    title: "",
    category: "csr",
    thumbnail: "",
    date: "",
    description: "",
    images: []
  });
  
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    abv: "",
    image: "",
    description: "",
    ingredients: "",
    tastingNotes: "",
    longDescription: ""
  });

  const [awardFormData, setAwardFormData] = useState<AwardFormData>({
    name: "",
    year: "",
    organization: "",
    category: "certification",
    description: "",
    image: "",
    displayOrder: "0"
  });
  
  const [imageInput, setImageInput] = useState("");

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
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
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      toast({ title: "Logged Out", description: "You have been logged out successfully." });
      window.location.href = "/admin/login";
    } catch (error) {
      window.location.href = "/admin/login";
    }
  };

  // ============================================
  // PORTFOLIO FUNCTIONS
  // ============================================
  
  const resetPortfolioForm = () => {
    setPortfolioFormData({
      title: "",
      category: "csr",
      thumbnail: "",
      date: "",
      description: "",
      images: []
    });
    setImageInput("");
  };

  const openCreatePortfolioDialog = () => {
    resetPortfolioForm();
    setPortfolioDialogOpen(true);
  };

  const openEditPortfolioDialog = (item: any) => {
    setPortfolioFormData({
      id: item.id,
      title: item.title,
      category: item.category,
      thumbnail: item.thumbnail,
      date: item.date,
      description: item.description,
      images: item.images || []
    });
    setImageInput(item.images?.join("\n") || "");
    setPortfolioDialogOpen(true);
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      const newImages = imageInput.split("\n").map(img => img.trim()).filter(Boolean);
      setPortfolioFormData(prev => ({
        ...prev,
        images: [...new Set([...prev.images, ...newImages])]
      }));
      setImageInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setPortfolioFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSavePortfolio = async () => {
    try {
      if (!portfolioFormData.title || !portfolioFormData.category || !portfolioFormData.thumbnail) {
        toast({ variant: "destructive", title: "Validation Error", description: "Please fill all required fields" });
        return;
      }

      if (portfolioFormData.images.length === 0) {
        toast({ variant: "destructive", title: "Validation Error", description: "Please add at least one image" });
        return;
      }

      const data = {
        slug: portfolioFormData.title.toLowerCase().replace(/\s+/g, '-'),
        title: portfolioFormData.title,
        category: portfolioFormData.category,
        thumbnail: portfolioFormData.thumbnail,
        date: portfolioFormData.date || new Date().toLocaleDateString(),
        description: portfolioFormData.description,
        images: portfolioFormData.images
      };

      if (portfolioFormData.id) {
        await updatePortfolioMutation.mutateAsync({ id: portfolioFormData.id, data });
        toast({ title: "Success", description: "Portfolio item updated successfully." });
      } else {
        await createPortfolioMutation.mutateAsync(data);
        toast({ title: "Success", description: "Portfolio item created successfully." });
      }
      
      setPortfolioDialogOpen(false);
      resetPortfolioForm();
      refetchPortfolio();
    } catch (error: any) {
      console.error("Save portfolio error:", error);
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to save portfolio item" });
    }
  };

  const handleDeletePortfolio = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?")) return;
    try {
      await deletePortfolioMutation.mutateAsync(id);
      toast({ title: "Success", description: "Portfolio item deleted successfully." });
      refetchPortfolio();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete the item." });
    }
  };

  // ============================================
  // PRODUCTS FUNCTIONS
  // ============================================
  
  const resetProductForm = () => {
    setProductFormData({
      name: "",
      slug: "",
      abv: "",
      image: "",
      description: "",
      ingredients: "",
      tastingNotes: "",
      longDescription: ""
    });
  };

  const openCreateProductDialog = () => {
    resetProductForm();
    setProductDialogOpen(true);
  };

  const openEditProductDialog = (product: any) => {
    setProductFormData({
      id: product.id,
      name: product.name,
      slug: product.slug,
      abv: product.abv,
      image: product.image,
      description: product.description,
      ingredients: product.ingredients,
      tastingNotes: product.tastingNotes,
      longDescription: product.longDescription
    });
    setProductDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (!productFormData.name || !productFormData.abv || !productFormData.image || !productFormData.description) {
        toast({ variant: "destructive", title: "Validation Error", description: "Please fill all required fields" });
        return;
      }

      const slug = productFormData.slug || productFormData.name.toLowerCase().replace(/\s+/g, '-');
      
      const data: InsertProduct = {
        name: productFormData.name,
        slug: slug,
        abv: productFormData.abv,
        image: productFormData.image,
        description: productFormData.description,
        ingredients: productFormData.ingredients,
        tastingNotes: productFormData.tastingNotes,
        longDescription: productFormData.longDescription
      };

      if (productFormData.id) {
        await updateProductMutation.mutateAsync({ id: productFormData.id, data });
        toast({ title: "Success", description: "Product updated successfully." });
      } else {
        await createProductMutation.mutateAsync(data);
        toast({ title: "Success", description: "Product created successfully." });
      }
      
      setProductDialogOpen(false);
      resetProductForm();
      refetchProducts();
    } catch (error: any) {
      console.error("Save product error:", error);
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to save product" });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProductMutation.mutateAsync(id);
      toast({ title: "Success", description: "Product deleted successfully." });
      refetchProducts();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete the product." });
    }
  };

  // ============================================
  // AWARDS FUNCTIONS
  // ============================================
  
  const resetAwardForm = () => {
    setAwardFormData({
      name: "",
      year: "",
      organization: "",
      category: "certification",
      description: "",
      image: "",
      displayOrder: "0"
    });
  };

  const openCreateAwardDialog = () => {
    resetAwardForm();
    setAwardDialogOpen(true);
  };

  const openEditAwardDialog = (award: any) => {
    setAwardFormData({
      id: award.id,
      name: award.name,
      year: award.year,
      organization: award.organization,
      category: award.category,
      description: award.description || "",
      image: award.image || "",
      displayOrder: award.displayOrder || "0"
    });
    setAwardDialogOpen(true);
  };

  const handleSaveAward = async () => {
    try {
      if (!awardFormData.name || !awardFormData.year || !awardFormData.organization) {
        alert("Please fill all required fields");
        return;
      }

      const data: InsertAward = {
        name: awardFormData.name,
        year: awardFormData.year,
        organization: awardFormData.organization,
        category: awardFormData.category,
        description: awardFormData.description,
        image: awardFormData.image,
        displayOrder: awardFormData.displayOrder
      };

      if (awardFormData.id) {
        await updateAwardMutation.mutateAsync({ id: awardFormData.id, data });
        alert("Award updated successfully!");
      } else {
        await createAwardMutation.mutateAsync(data);
        alert("Award created successfully!");
      }
      
      setAwardDialogOpen(false);
      resetAwardForm();
      refetchAwards();
    } catch (error: any) {
      console.error("Save award error:", error);
      alert(error.message || "Failed to save award");
    }
  };

  const handleDeleteAward = async (id: string) => {
    if (!confirm("Are you sure you want to delete this award?")) return;
    try {
      await deleteAwardMutation.mutateAsync(id);
      alert("Award deleted successfully!");
      refetchAwards();
    } catch (error) {
      alert("Failed to delete the award.");
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

  const portfolioStats = portfolioItems?.reduce((acc, item) => {
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
            <p className="text-muted-foreground">Manage your content</p>
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
           <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-8 bg-white/5 border border-white/10">
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Images className="h-4 w-4 mr-2" /> Portfolio
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Package className="h-4 w-4 mr-2" /> Products
            </TabsTrigger>
            <TabsTrigger value="awards" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Trophy className="h-4 w-4 mr-2" /> Awards
            </TabsTrigger>
          </TabsList>

          {/* ============================================ */}
          {/* PORTFOLIO TAB */}
          {/* ============================================ */}
          <TabsContent value="portfolio" className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {portfolioLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))
              ) : (
                <>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Total Items</h3>
                    <p className="text-3xl font-bold font-serif text-primary">{portfolioItems?.length || 0}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">CSR Events</h3>
                    <p className="text-3xl font-bold font-serif text-primary">{portfolioStats.csr || 0}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Plantation</h3>
                    <p className="text-3xl font-bold font-serif text-primary">{portfolioStats.plantation || 0}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Distillery</h3>
                    <p className="text-3xl font-bold font-serif text-primary">{portfolioStats.distillery || 0}</p>
                  </div>
                </>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end">
              <Button onClick={openCreatePortfolioDialog} className="bg-primary text-black hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Add Portfolio Item
              </Button>
            </div>

            {/* Table */}
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
                  {portfolioLoading ? (
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
                    portfolioItems?.map((item) => (
                      <TableRow key={item.id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <img src={item.thumbnail} alt={item.title} className="h-10 w-10 rounded object-cover" />
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 rounded-full bg-white/10 text-xs uppercase">
                            {item.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditPortfolioDialog(item)}>
                              <Edit className="h-4 w-4 text-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeletePortfolio(item.id)}
                              disabled={deletePortfolioMutation.isPending}
                            >
                              {deletePortfolioMutation.isPending ? (
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
          </TabsContent>

          {/* ============================================ */}
          {/* PRODUCTS TAB */}
          {/* ============================================ */}
          <TabsContent value="products" className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {productsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))
              ) : (
                <>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Total Products</h3>
                    <p className="text-3xl font-bold font-serif text-primary">{products?.length || 0}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Active</h3>
                    <p className="text-3xl font-bold font-serif text-green-500">{products?.length || 0}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Categories</h3>
                    <p className="text-3xl font-bold font-serif text-primary">Arrack</p>
                  </div>
                </>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end">
              <Button onClick={openCreateProductDialog} className="bg-primary text-black hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/10 bg-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white">Image</TableHead>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">ABV</TableHead>
                    <TableHead className="text-white">Slug</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="border-white/5">
                        <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    products?.map((product) => (
                      <TableRow key={product.id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {product.abv}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono">{product.slug}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditProductDialog(product)}>
                              <Edit className="h-4 w-4 text-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deleteProductMutation.isPending}
                            >
                              {deleteProductMutation.isPending ? (
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
          </TabsContent>
         {/* ============================================ */}
          {/* AWARDS TAB - NEW */}
          {/* ============================================ */}
          <TabsContent value="awards" className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {awardsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-lg" />
                ))
              ) : (
                <>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Total Awards</h3>
                    <p className="text-3xl font-bold font-serif text-primary">{awards?.length || 0}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Certifications</h3>
                    <p className="text-3xl font-bold font-serif text-primary">
                      {awards?.filter(a => a.category === 'certification').length || 0}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Competitions</h3>
                    <p className="text-3xl font-bold font-serif text-primary">
                      {awards?.filter(a => a.category === 'competition').length || 0}
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">Recognition</h3>
                    <p className="text-3xl font-bold font-serif text-primary">
                      {awards?.filter(a => a.category === 'recognition').length || 0}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end">
              <Button onClick={openCreateAwardDialog} className="bg-primary text-black hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Add Award
              </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border border-white/10 bg-white/5 overflow-hidden">
              <Table>
                <TableHeader className="bg-black/20">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-white">Order</TableHead>
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Year</TableHead>
                    <TableHead className="text-white">Organization</TableHead>
                    <TableHead className="text-white">Category</TableHead>
                    <TableHead className="text-right text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {awardsLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-white/5">
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    awards?.map((award) => (
                      <TableRow key={award.id} className="border-white/5 hover:bg-white/5">
                        <TableCell className="font-mono text-muted-foreground">{award.displayOrder}</TableCell>
                        <TableCell className="font-medium">{award.name}</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {award.year}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{award.organization}</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 rounded-full bg-white/10 text-xs uppercase">
                            {award.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditAwardDialog(award)}>
                              <Edit className="h-4 w-4 text-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteAward(award.id)}
                              disabled={deleteAwardMutation.isPending}
                            >
                              {deleteAwardMutation.isPending ? (
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
          </TabsContent>

        </Tabs>

        {/* ============================================ */}
        {/* PORTFOLIO DIALOG */}
        {/* ============================================ */}
        <Dialog open={portfolioDialogOpen} onOpenChange={setPortfolioDialogOpen}>
          <DialogContent className="bg-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{portfolioFormData.id ? "Edit Portfolio Item" : "Create Portfolio Item"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Title *</label>
                <Input 
                  value={portfolioFormData.title} 
                  onChange={e => setPortfolioFormData(prev => ({...prev, title: e.target.value}))}
                  placeholder="Event Title"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Category *</label>
                  <Select 
                    value={portfolioFormData.category} 
                    onValueChange={(val: Category) => setPortfolioFormData(prev => ({...prev, category: val}))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
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
                    value={portfolioFormData.date} 
                    onChange={e => setPortfolioFormData(prev => ({...prev, date: e.target.value}))}
                    placeholder="Month Year"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Description</label>
                <Textarea 
                  value={portfolioFormData.description} 
                  onChange={e => setPortfolioFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Short description..."
                  className="bg-white/5 border-white/10"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Thumbnail URL *</label>
                <Input 
                  value={portfolioFormData.thumbnail} 
                  onChange={e => setPortfolioFormData(prev => ({...prev, thumbnail: e.target.value}))}
                  placeholder="/attached_assets/..."
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Gallery Images * (one per line)</label>
                <Textarea 
                  value={imageInput} 
                  onChange={e => setImageInput(e.target.value)}
                  placeholder="/attached_assets/image1.png&#10;/attached_assets/image2.png"
                  className="bg-white/5 border-white/10"
                  rows={4}
                />
                <Button type="button" variant="outline" onClick={handleAddImage} className="w-full" size="sm">
                  Add Images
                </Button>
              </div>

              {portfolioFormData.images.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-bold">Gallery ({portfolioFormData.images.length})</label>
                  <div className="border border-white/10 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto bg-white/5">
                    {portfolioFormData.images.map((img, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 bg-black/20 p-2 rounded">
                        <span className="text-xs text-muted-foreground truncate flex-1">{img}</span>
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveImage(idx)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                onClick={handleSavePortfolio} 
                disabled={createPortfolioMutation.isPending || updatePortfolioMutation.isPending}
                className="w-full bg-primary text-black hover:bg-primary/90"
              >
                {(createPortfolioMutation.isPending || updatePortfolioMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {portfolioFormData.id ? "Update" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ============================================ */}
        {/* PRODUCT DIALOG */}
        {/* ============================================ */}
        <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
          <DialogContent className="bg-card border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{productFormData.id ? "Edit Product" : "Create New Product"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Product Name *</label>
                  <Input 
                    value={productFormData.name} 
                    onChange={e => setProductFormData(prev => ({...prev, name: e.target.value}))}
                    placeholder="Galoya Arrack Original"
                    className="bg-white/5 border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold">Slug (URL)</label>
                  <Input 
                    value={productFormData.slug} 
                    onChange={e => setProductFormData(prev => ({...prev, slug: e.target.value}))}
                    placeholder="galoya-original (auto-generated)"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">ABV (Alcohol by Volume) *</label>
                <Input 
                  value={productFormData.abv} 
                  onChange={e => setProductFormData(prev => ({...prev, abv: e.target.value}))}
                  placeholder="36.8% ABV"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Product Image URL *</label>
                <Input 
                  value={productFormData.image} 
                  onChange={e => setProductFormData(prev => ({...prev, image: e.target.value}))}
                  placeholder="/attached_assets/generated_images/..."
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Short Description *</label>
                <Textarea 
                  value={productFormData.description} 
                  onChange={e => setProductFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder="A smooth, mellow spirit..."
                  className="bg-white/5 border-white/10"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Ingredients</label>
                <Input 
                  value={productFormData.ingredients} 
                  onChange={e => setProductFormData(prev => ({...prev, ingredients: e.target.value}))}
                  placeholder="100% Sugarcane Syrup, Water"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Tasting Notes</label>
                <Input 
                  value={productFormData.tastingNotes} 
                  onChange={e => setProductFormData(prev => ({...prev, tastingNotes: e.target.value}))}
                  placeholder="Honey, Caramel, Vanilla"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Long Description</label>
                <Textarea 
                  value={productFormData.longDescription} 
                  onChange={e => setProductFormData(prev => ({...prev, longDescription: e.target.value}))}
                  placeholder="Full product description for detail page..."
                  className="bg-white/5 border-white/10"
                  rows={6}
                />
              </div>

              <Button 
                onClick={handleSaveProduct} 
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                className="w-full bg-primary text-black hover:bg-primary/90"
              >
                {(createProductMutation.isPending || updateProductMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {productFormData.id ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
          {/* ============================================ */}
        {/* AWARD DIALOG */}
        {/* ============================================ */}
        <Dialog open={awardDialogOpen} onOpenChange={setAwardDialogOpen}>
          <DialogContent className="bg-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{awardFormData.id ? "Edit Award" : "Create New Award"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Award Name *</label>
                <Input 
                  value={awardFormData.name} 
                  onChange={e => setAwardFormData(prev => ({...prev, name: e.target.value}))}
                  placeholder="ISO 9001:2015 / Gold Medal"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Year *</label>
                  <Input 
                    value={awardFormData.year} 
                    onChange={e => setAwardFormData(prev => ({...prev, year: e.target.value}))}
                    placeholder="2024"
                    className="bg-white/5 border-white/10"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold">Display Order</label>
                  <Input 
                    value={awardFormData.displayOrder} 
                    onChange={e => setAwardFormData(prev => ({...prev, displayOrder: e.target.value}))}
                    placeholder="1"
                    type="number"
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Organization *</label>
                <Input 
                  value={awardFormData.organization} 
                  onChange={e => setAwardFormData(prev => ({...prev, organization: e.target.value}))}
                  placeholder="International Organization for Standardization"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Category *</label>
                <Select 
                  value={awardFormData.category} 
                  onValueChange={(val) => setAwardFormData(prev => ({...prev, category: val}))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="recognition">Recognition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Description</label>
                <Textarea 
                  value={awardFormData.description} 
                  onChange={e => setAwardFormData(prev => ({...prev, description: e.target.value}))}
                  placeholder="Quality Management System Certification"
                  className="bg-white/5 border-white/10"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Image URL (Optional)</label>
                <Input 
                  value={awardFormData.image} 
                  onChange={e => setAwardFormData(prev => ({...prev, image: e.target.value}))}
                  placeholder="/attached_assets/awards/iso-logo.png"
                  className="bg-white/5 border-white/10"
                />
                <p className="text-xs text-muted-foreground">Certificate or organization logo</p>
              </div>

              <Button 
                onClick={handleSaveAward} 
                disabled={createAwardMutation.isPending || updateAwardMutation.isPending}
                className="w-full bg-primary text-black hover:bg-primary/90"
              >
                {(createAwardMutation.isPending || updateAwardMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {awardFormData.id ? "Update Award" : "Create Award"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}