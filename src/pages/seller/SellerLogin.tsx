import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerLayout from "@/components/BuyerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SELLER_EMAIL = "justinegaming017@gmail.com";
const SELLER_PASS = "seller123";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === SELLER_EMAIL && password === SELLER_PASS) {
      localStorage.setItem("coircraft_seller", "true");
      toast.success("Welcome, Justine!");
      navigate("/seller/storefront");
    } else {
      toast.error("Invalid seller credentials.");
    }
  };

  return (
    <BuyerLayout>
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">

          <h1 className="text-center font-display text-2xl font-bold">
            Seller Login
          </h1>

          <p className="mt-1 text-center text-sm text-muted-foreground">
            Access your seller dashboard
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter seller email"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-display font-semibold"
            >
              Sign In
            </Button>

          </form>

        </div>
      </div>
    </BuyerLayout>
  );
};

export default SellerLogin;