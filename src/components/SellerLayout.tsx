import type { ReactNode } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import SellerMobileNav from "@/components/SellerMobileNav"; // Added import
import Footer from "@/components/Footer";

const SellerLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen bg-muted/40 font-body antialiased">
    <SellerSidebar />
    <SellerMobileNav />
    <div className="flex flex-1 flex-col w-full md:pl-60 pb-16 md:pb-0">
      <main className="flex-1 p-4 md:p-8">{children}</main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  </div>
);

export default SellerLayout;
