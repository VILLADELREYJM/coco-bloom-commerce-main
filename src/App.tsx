import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Storefront from "./pages/Storefront";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import About from "./pages/About";
import SellerLogin from "./pages/seller/SellerLogin";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerUsers from "./pages/seller/SellerUsers";
import SellerStorefront from "./pages/seller/SellerStorefront";
import SellerInventory from "./pages/seller/SellerInventory";
import SellerReports from "./pages/seller/SellerReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/storefront" element={<Storefront />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/seller/login" element={<SellerLogin />} />
              <Route path="/seller/dashboard" element={<Navigate to="/seller/reports" replace />} />
              <Route path="/seller/orders" element={<SellerOrders />} />
              <Route path="/seller/users" element={<SellerUsers />} />
              <Route path="/seller/storefront" element={<SellerStorefront />} />
              <Route path="/seller/inventory" element={<SellerInventory />} />
              <Route path="/seller/reports" element={<SellerReports />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
