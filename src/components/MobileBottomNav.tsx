import { Link, useLocation } from "react-router-dom";
import { Home, Leaf, ClipboardList, User, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

const MobileBottomNav = () => {
    const location = useLocation();
    const { itemCount } = useCart();

    const isActive = (path: string) => {
        if (path === "/" && location.pathname !== "/") return false;
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: Leaf, label: "Shop", path: "/products" },
        { icon: ShoppingCart, label: "Cart", path: "/cart" },
        { icon: ClipboardList, label: "Orders", path: "/transactions" },
        { icon: User, label: "Me", path: "/profile" },
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
                                "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors",
                                active
                                    ? "text-[#4a6b4a]"
                                    : "text-muted-foreground hover:text-[#4a6b4a]/70"
                            )}
                        >
                            <div className="relative">
                                <Icon className={cn("h-5 w-5 transition-all text-current", active && "fill-current scale-110")} strokeWidth={active ? 2.5 : 2} />
                                {label === "Cart" && itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#f15a2b] text-[9px] font-bold text-white shadow-sm ring-1 ring-background animate-in zoom-in">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </span>
                                )}
                            </div>
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileBottomNav;
