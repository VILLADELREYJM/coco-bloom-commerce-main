import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const BuyerNavbar = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-20 items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="EcoCoin Logo"
            className="h-10 w-10 object-contain"
          />

          <div className="flex flex-col leading-tight">
            <span className="font-display text-xl font-bold text-[#4a6b4a]">
              EcoCoin Market
            </span>
            <span className="text-xs font-medium text-muted-foreground -mt-1">
              Brainworks
            </span>
          </div>
        </Link>

        {/* Desktop nav - Center navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link to="/" className="text-foreground/70 transition-colors hover:text-foreground">Home</Link>
          <Link to="/storefront" className="text-foreground/70 transition-colors hover:text-foreground">Storefront</Link>
          <Link to="/products" className="text-foreground/70 transition-colors hover:text-foreground">Products</Link>
          {user && (
            <Link to="/transactions" className="text-foreground/70 transition-colors hover:text-foreground">Orders</Link>
          )}
        </nav>

        {/* Right side actions: Cart, Logout, then Profile Details */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-foreground/70 transition-colors hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f15a2b] text-[10px] font-bold text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Logout Button on the Left */}
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="rounded-lg border-slate-200 font-semibold px-4 hover:bg-slate-50 transition-all"
              >
                Logout
              </Button>

              {/* Profile Section on the Right */}
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-[#4a6b4a]/10 flex items-center justify-center group-hover:bg-[#4a6b4a]/20 transition-colors">
                  <User className="h-4 w-4 text-[#4a6b4a]" />
                </div>
                <span className="hidden sm:inline-block text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  {user.name}
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hover:bg-[#4a6b4a]/10 hover:text-[#4a6b4a]">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm" className="bg-[#4a6b4a] hover:bg-[#3d5a3d]">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <button className="p-2 md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t bg-card p-6 md:hidden">
          <div className="flex flex-col gap-4 text-sm font-medium">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/storefront" onClick={() => setOpen(false)}>Storefront</Link>
            <Link to="/products" onClick={() => setOpen(false)}>Products</Link>
            {user && (
              <>
                <Link to="/transactions" onClick={() => setOpen(false)}>Orders</Link>
                <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default BuyerNavbar;