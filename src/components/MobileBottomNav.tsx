import { Link, useLocation } from "react-router-dom";
import { Home, Store, Leaf, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileBottomNav = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === "/" && location.pathname !== "/") return false;
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: Store, label: "Shop", path: "/storefront" },
        { icon: Leaf, label: "Products", path: "/products" },
        { icon: ClipboardList, label: "Orders", path: "/transactions" },
        { icon: User, label: "Me", path: "/profile" },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
            <nav className="flex h-16 items-center justify-around px-2">
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
                            <Icon className={cn("h-5 w-5", active && "fill-current")} strokeWidth={active ? 2.5 : 2} />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileBottomNav;
