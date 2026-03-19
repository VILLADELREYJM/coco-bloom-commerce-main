import type { ReactNode } from "react";
import BuyerNavbar from "@/components/BuyerNavbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";

const BuyerLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <BuyerNavbar />
    <main className="flex-1 pb-16 md:pb-0">{children}</main>
    <Footer />
    <MobileBottomNav />
  </div>
);

export default BuyerLayout;
