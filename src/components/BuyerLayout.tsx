import type { ReactNode } from "react";
import BuyerNavbar from "@/components/BuyerNavbar";
import Footer from "@/components/Footer";

const BuyerLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <BuyerNavbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default BuyerLayout;
