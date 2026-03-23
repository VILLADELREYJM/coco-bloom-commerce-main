import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, BarChart3, LogOut, Users, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/seller/reports", label: "Reports", icon: BarChart3 },
  { to: "/seller/orders", label: "Orders", icon: ClipboardList },
  { to: "/seller/users", label: "Users", icon: Users },
  { to: "/seller/storefront", label: "Storefront", icon: ShoppingBag },
  { to: "/seller/inventory", label: "Inventory", icon: Package },
];

const SellerSidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden md:flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <LayoutDashboard className="h-5 w-5 text-sidebar-primary" />
        <span className="font-display text-lg font-bold">Seller Panel</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === l.to
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </aside>
  );
};

export default SellerSidebar;
