import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, Package, BarChart3, ClipboardList, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const SellerMobileNav = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/seller/dashboard" },
        { icon: ClipboardList, label: "Orders", path: "/seller/orders" },
        { icon: Users, label: "Users", path: "/seller/users" },
        { icon: ShoppingBag, label: "Storefront", path: "/seller/storefront" },
        { icon: Package, label: "Inventory", path: "/seller/inventory" },
        { icon: BarChart3, label: "Reports", path: "/seller/reports" },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
            <nav className="flex h-16 items-center justify-around px-2 pb-safe-area-bottom">
                {navItems.map(({ icon: Icon, label, path }) => {
                    const active = isActive(path);
                    return (
                        <Link
                            key={path}
                            to={path}
                            className={cn(
                                "flex flex-1 flex-col items-center justify-center gap-0.5 py-1 text-[9px] font-medium transition-colors",
                                active
                                    ? "text-[#4a6b4a]"
                                    : "text-muted-foreground hover:text-[#4a6b4a]/70"
                            )}
                        >
                            <div className="relative">
                                <Icon className={cn("h-4 w-4 transition-all text-current", active && "fill-current scale-110")} strokeWidth={active ? 2.5 : 2} />
                            </div>
                            <span className="scale-90">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default SellerMobileNav;