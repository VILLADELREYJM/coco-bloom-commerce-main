import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerLayout from "@/components/BuyerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, Store } from "lucide-react";

const SELLER_EMAIL = "justinegaming017@gmail.com";
const SELLER_PASS = "jusjus";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === SELLER_EMAIL && password === SELLER_PASS) {
      localStorage.setItem("coircraft_seller", "true");
      toast.success("Welcome back, Seller!");
      navigate("/seller/reports");
    } else {
      toast.error("Invalid seller credentials.");
    }
  };

  return (
    <BuyerLayout>
      <div className="container flex min-h-[70vh] items-center justify-center py-16 bg-gradient-to-br from-slate-50 to-green-50/30">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#4a6b4a]/10 mb-6 ring-8 ring-[#4a6b4a]/5">
              <Store className="h-8 w-8 text-[#4a6b4a]" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              Seller Portal
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to manage your inventory and sales
            </p>
          </div>

          <div className="rounded-xl border bg-white/80 backdrop-blur-sm p-8 shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-hover:text-[#4a6b4a] transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                  <a href="#" className="text-xs font-medium text-[#4a6b4a] hover:underline">Forgot password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-hover:text-[#4a6b4a] transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-display font-semibold text-lg bg-[#4a6b4a] hover:bg-[#3d5a3d] shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all"
              >
                Sign In
              </Button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-500">
            Protected by reCAPTCHA and Subject to the <a href="#" className="underline hover:text-slate-800">Privacy Policy</a>
          </p>
        </div>
      </div>
    </BuyerLayout>
  );
};

export default SellerLogin;