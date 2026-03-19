import type { ReactNode } from "react";
import SellerSidebar from "@/components/SellerSidebar";
import Footer from "@/components/Footer";

const SellerLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen">
    <SellerSidebar />
    <div className="ml-60 flex flex-1 flex-col">
      <main className="flex-1 p-8">{children}</main>
      <Footer />
    </div>
  </div>
);

export default SellerLayout;
