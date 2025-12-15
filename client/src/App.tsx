import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Brand from "@/pages/Brand";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Sustainability from "@/pages/Sustainability";
import Portfolio from "@/pages/Portfolio";
import CSREvent from "@/pages/CSREvent";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import AgeVerification from "@/components/AgeVerification";
import "./lib/i18n";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/brand" component={Brand} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/sustainability" component={Sustainability} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/portfolio/:slug" component={CSREvent} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin/login" component={Login} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AgeVerification />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;