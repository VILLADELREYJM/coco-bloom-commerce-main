import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BuyerLayout from "@/components/BuyerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      // Intercept the Firebase error and show your custom message
      const errorMessage = result.error?.toLowerCase() || "";

      if (errorMessage.includes("auth/invalid-credential") ||
        errorMessage.includes("invalid-password") ||
        errorMessage.includes("user-not-found")) {

        toast.error("Try again: Incorrect email or password");
        setPassword(""); // Clear password field for security and a fresh start
      } else {
        // Fallback for other errors like network issues
        toast.error(result.error || "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <BuyerLayout>
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
          <h1 className="text-center font-display text-2xl font-bold">Welcome Back</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Sign in to your EcoCoin Market account
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full font-display font-semibold">
              Sign In
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link to="/seller/login" className="text-xs text-muted-foreground hover:underline">
              Seller Login →
            </Link>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
};

export default Login;