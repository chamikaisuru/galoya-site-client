import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { portfolioItems, PortfolioItem, Category } from "@/data/portfolio";
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
import { Plus, Trash2, Edit, LogOut, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>(portfolioItems);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<PortfolioItem>>({});

  // Check auth
  useEffect(() => {
    const isAuth = localStorage.getItem("galoya_admin_auth");
    if (!isAuth) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("galoya_admin_auth");
    setLocation("/admin/login");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter(item => item.id !== id));
      toast({ title: "Item Deleted", description: "Portfolio item removed." });
    }
  };

  const handleSave = () => {
    // In a real full-stack app, this would send a POST/PUT request to the backend
    // For mockup, we just update the local state
    if (currentItem.id) {
      // Update existing
      setItems(items.map(item => item.id === currentItem.id ? { ...item, ...currentItem } as PortfolioItem : item));
      toast({ title: "Item Updated", description: "Changes saved successfully." });
    } else {
      // Create new
      const newItem = {
        ...currentItem,
        id: `new-${Date.now()}`,
        slug: currentItem.title?.toLowerCase().replace(/\s+/g, '-') || "new-item",
        images: currentItem.images || [currentItem.thumbnail || ""]
      } as PortfolioItem;
      setItems([newItem, ...items]);
      toast({ title: "Item Created", description: "New portfolio item added." });
    }
    setIsEditing(false);
    setCurrentItem({});
  };

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
          {["All Items", "CSR Events", "Plantation", "Distillery"].map((label, i) => (
             <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-lg">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">{label}</h3>
                <p className="text-3xl font-bold font-serif text-primary">
                  {i === 0 ? items.length : items.filter(x => x.category === label.toLowerCase().split(' ')[0]).length}
                </p>
             </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex justify-end mb-6">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentItem({ category: "csr", images: [] })} className="bg-primary text-black hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" /> Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{currentItem.id ? "Edit Item" : "Create New Item"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Title</label>
                  <Input 
                    value={currentItem.title || ""} 
                    onChange={e => setCurrentItem({...currentItem, title: e.target.value})}
                    placeholder="Event Title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Category</label>
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
                  <label className="text-sm font-bold">Thumbnail URL (Placeholder)</label>
                  <div className="flex gap-2">
                    <Input 
                       value={currentItem.thumbnail || ""} 
                       onChange={e => setCurrentItem({...currentItem, thumbnail: e.target.value})}
                       placeholder="/assets/..."
                    />
                    <Button variant="outline" size="icon"><ImageIcon className="h-4 w-4" /></Button>
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full bg-primary text-black">Save Item</Button>
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
              {items.map((item) => (
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
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
