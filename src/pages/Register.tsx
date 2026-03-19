import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BuyerLayout from "@/components/BuyerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "", confirm: "", name: "", address: "", mobile: "" });
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) { toast.error("Please enter a valid email"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    if (!form.name.trim() || !form.address.trim() || !form.mobile.trim()) { toast.error("All fields are required"); return; }
    const mobileRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!mobileRegex.test(form.mobile)) { toast.error("Please enter a valid mobile number"); return; }

    const result = await register({ email: form.email, password: form.password, name: form.name, address: form.address, mobile: form.mobile });
    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      toast.error(result.error || "Account creation failed. Check Firebase Auth and Firestore rules.");
    }
  };

  return (
    <BuyerLayout>
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
          <h1 className="text-center font-display text-2xl font-bold">Create Account</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">Join EcoCoin Market</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="name">Complete Name</Label>
              <Input id="name" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Juan Dela Cruz" />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" value={form.address} onChange={e => update("address", e.target.value)} placeholder="123 Main St, Manila" />
            </div>
            <div>
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" value={form.mobile} onChange={e => update("mobile", e.target.value)} placeholder="+63 912 345 6789" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={e => update("password", e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" value={form.confirm} onChange={e => update("confirm", e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full font-display font-semibold">Create Account</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </BuyerLayout>
  );
};

export default Register;
