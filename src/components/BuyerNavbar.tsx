import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BuyerNavbar = () => {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between sm:h-20">

        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img
            src="/images/logo.png"
            alt="EcoCoin Logo"
            className="h-8 w-8 object-contain sm:h-10 sm:w-10"
          />

          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-display text-lg font-bold text-[#4a6b4a] sm:text-xl">
              EcoCoin Market
            </span>
            <span className="hidden text-xs font-medium text-muted-foreground -mt-1 min-[360px]:block">
              Brainworks
            </span>
          </div>
        </Link>

        {/* Desktop nav - Center navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link to="/" className="text-foreground/70 transition-colors hover:text-foreground">Home</Link>
          <Link to="/about" className="text-foreground/70 transition-colors hover:text-foreground">About Us</Link>
          <Link to="/storefront" className="text-foreground/70 transition-colors hover:text-foreground">Storefront</Link>
          <Link to="/products" className="text-foreground/70 transition-colors hover:text-foreground">Products</Link>
          {user && (
            <Link to="/transactions" className="text-foreground/70 transition-colors hover:text-foreground">Orders</Link>
          )}
        </nav>

        {/* Right side actions: Cart, Logout, then Profile Details */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <Link to="/cart" className="relative p-2 text-foreground/70 transition-colors hover:text-foreground md:flex">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f15a2b] text-[10px] font-bold text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-4 md:flex">
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
                <Avatar className="h-9 w-9 ring-2 ring-[#4a6b4a]/20 transition-shadow group-hover:ring-[#4a6b4a]/40">
                  <AvatarImage src={user.image} className="object-cover" />
                  <AvatarFallback className="bg-[#4a6b4a]/10 text-[#4a6b4a] font-semibold">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  {user.name}
                </span>
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
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

          <button className="rounded-md p-2 transition-colors hover:bg-muted md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-black/35 transition-opacity duration-300 md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed right-0 top-0 z-[70] h-dvh w-[62%] max-w-[240px] overflow-y-auto border-l bg-card shadow-2xl transition-transform duration-300 md:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex h-12 items-center justify-between border-b px-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Menu</span>
          <button
            className="rounded-md p-1.5 text-foreground/90 transition-colors hover:bg-muted"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="px-3 py-4">
          <div className="space-y-1 text-xs font-medium">
            <Link to="/" onClick={() => setOpen(false)} className="block rounded px-2 py-2 transition-colors hover:bg-primary/10 hover:text-primary">Home</Link>
            <Link to="/products" onClick={() => setOpen(false)} className="block rounded px-2 py-2 transition-colors hover:bg-primary/10 hover:text-primary">Products</Link>
            <Link to="/storefront" onClick={() => setOpen(false)} className="block rounded px-2 py-2 transition-colors hover:bg-primary/10 hover:text-primary">Storefront</Link>
            <Link to="/about" onClick={() => setOpen(false)} className="block rounded px-2 py-2 transition-colors hover:bg-primary/10 hover:text-primary">About</Link>
            <Link to="/cart" onClick={() => setOpen(false)} className="block rounded px-2 py-2 transition-colors hover:bg-primary/10 hover:text-primary">Cart</Link>
            {user && (
              <>
                <Link to="/transactions" onClick={() => setOpen(false)} className="block rounded px-2 py-2 transition-colors hover:bg-primary/10 hover:text-primary">Orders</Link>
                <Link to="/profile" onClick={() => setOpen(false)} className="block rounded px-2 py-2 transition-colors hover:bg-primary/10 hover:text-primary">My account</Link>
              </>
            )}
          </div>

          <div className="my-3 border-t" />

          <div className="space-y-1.5">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="block w-full rounded px-2 py-2 text-left text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block rounded px-2 py-2 text-xs font-medium transition-colors hover:bg-primary/10 hover:text-primary">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block rounded bg-primary px-2 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Register</Link>
              </>
            )}
          </div>
        </nav>
      </aside>
    </header>
  );
};

export default BuyerNavbar;