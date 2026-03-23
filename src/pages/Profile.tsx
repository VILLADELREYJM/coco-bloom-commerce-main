import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BuyerLayout from "@/components/BuyerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User as UserIcon, LogOut, Package, ShoppingBag,
  MapPin, Phone, Mail, Camera, Loader2, CheckCircle2, Shield, Edit2, CreditCard, Clock
} from "lucide-react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

export default function Profile() {
  const { user, transactions, logout, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        address: user.address || ""
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await updateUserProfile({
        name: formData.name,
        mobile: formData.mobile,
        address: formData.address
      });
      if (res.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imageLoading) return;
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setImageLoading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await updateUserProfile({ image: base64String });
        if (res.success) {
          toast.success("Profile photo updated!");
        } else {
          toast.error(res.error || "Failed to update photo");
        }
      } catch (error) {
        console.error("Failed to upload image", error);
        toast.error("Failed to update photo");
      } finally {
        setImageLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setPwLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        toast.error("Unable to verify user session");
        return;
      }
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordForm.currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordForm.newPassword);
      toast.success("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Password update failed:", error);
      toast.error("Failed to update password. Please check your current password.");
    } finally {
      setPwLoading(false);
    }
  };

  if (!user) {
    return (
      <BuyerLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-8">
          <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
            <UserIcon className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Sign in required</h1>
          <p className="text-slate-500 mb-6">Please log in to view your profile.</p>
          <Link to="/login">
            <Button className="bg-[#4a6b4a] hover:bg-[#3d5a3d]">Sign In</Button>
          </Link>
        </div>
      </BuyerLayout>
    );
  }

  // Calculate Stats
  const totalOrders = transactions.length;
  const totalSpent = transactions.filter(t => t.status === 'completed').reduce((acc, curr) => acc + curr.total, 0);
  const totalReceived = transactions.filter(t => t.status === 'completed').length;

  return (
    <BuyerLayout>
      <div className="min-h-screen bg-slate-50/50 pb-20 pt-8">
        <div className="container max-w-5xl px-4 md:px-6">

          {/* Header Card */}
          <div className="bg-[#1a2e1a] rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden mb-8">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="h-28 w-28 rounded-full border-4 border-[#3d5a3d] bg-[#2a402a] flex items-center justify-center overflow-hidden shadow-lg">
                    {imageLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-green-200" />
                    ) : (
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user.image} className="object-cover" />
                        <AvatarFallback className="text-3xl font-bold bg-[#2a402a] text-green-100">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <label className="absolute bottom-1 right-1 p-2 bg-green-500 hover:bg-green-400 text-white rounded-full cursor-pointer shadow-lg transition-colors">
                    <Camera className="h-4 w-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={imageLoading} />
                  </label>
                </div>

                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold tracking-tight mb-1">{user.name}</h1>
                  <p className="text-green-200/80 font-medium text-sm flex items-center justify-center md:justify-start gap-2">
                    <Mail className="h-3.5 w-3.5" /> {user.email}
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex items-center gap-8 md:gap-12 bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/5">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{totalOrders}</p>
                  <p className="text-xs uppercase tracking-wider text-green-200/60 font-medium mt-1">Orders</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">₱{totalSpent.toLocaleString()}</p>
                  <p className="text-xs uppercase tracking-wider text-green-200/60 font-medium mt-1">Spent</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{totalReceived}</p>
                  <p className="text-xs uppercase tracking-wider text-green-200/60 font-medium mt-1">Received</p>
                </div>
              </div>

            </div>
          </div>

          {/* Tabs & Content */}
          <Tabs defaultValue="info" className="w-full">
            <div className="flex justify-center md:justify-start mb-6">
              <TabsList className="bg-white p-1.5 h-auto rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                <TabsTrigger
                  value="info"
                  className="rounded-full px-6 py-2.5 data-[state=active]:bg-[#1a2e1a] data-[state=active]:text-white transition-all font-medium text-sm"
                >
                  <UserIcon className="h-4 w-4 mr-2" /> My Info
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="rounded-full px-6 py-2.5 data-[state=active]:bg-[#1a2e1a] data-[state=active]:text-white transition-all font-medium text-sm"
                >
                  <Shield className="h-4 w-4 mr-2" /> Security
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="rounded-full px-6 py-2.5 data-[state=active]:bg-[#1a2e1a] data-[state=active]:text-white transition-all font-medium text-sm"
                >
                  <Clock className="h-4 w-4 mr-2" /> Activity
                </TabsTrigger>
              </TabsList>
            </div>

            {/* MY INFO TAB */}
            <TabsContent value="info" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-white px-8 py-6">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">Account Information</CardTitle>
                    <CardDescription className="mt-1">Manage your personal details and shipping address.</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-slate-200 hover:bg-slate-50 hover:text-[#4a6b4a]"
                    >
                      <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                  )}
                </CardHeader>

                <CardContent className="p-8 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Full Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`border-0 border-b border-slate-100 rounded-none px-0 py-2 h-auto text-base font-semibold focus-visible:ring-0 focus-visible:border-[#4a6b4a] transition-all ${!isEditing ? 'bg-transparent text-slate-700' : 'bg-slate-50/50'}`}
                        readOnly={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Email Address</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={formData.email}
                          className="border-0 border-b border-slate-100 rounded-none px-0 py-2 h-auto text-base font-medium text-slate-500 bg-transparent focus-visible:ring-0 focus-visible:border-transparent cursor-not-allowed"
                          readOnly
                        />
                        <Badge variant="secondary" className="bg-green-50 text-green-600 border border-green-100 text-[10px] font-bold px-2 py-0.5 pointer-events-none">VERIFIED</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Mobile Number</Label>
                      <Input
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="+63 900 000 0000"
                        className={`border-0 border-b border-slate-100 rounded-none px-0 py-2 h-auto text-base font-semibold focus-visible:ring-0 focus-visible:border-[#4a6b4a] transition-all ${!isEditing ? 'bg-transparent text-slate-700' : 'bg-slate-50/50'}`}
                        readOnly={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Shipping Address</Label>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Enter your full address"
                        className={`border-0 border-b border-slate-100 rounded-none px-0 py-2 h-auto text-base font-semibold focus-visible:ring-0 focus-visible:border-[#4a6b4a] transition-all ${!isEditing ? 'bg-transparent text-slate-700' : 'bg-slate-50/50'}`}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex items-center justify-end gap-3 mt-12 pt-6 border-t border-slate-50">
                      <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={loading}>Cancel</Button>
                      <Button onClick={handleUpdateProfile} className="bg-[#4a6b4a] hover:bg-[#3d5a3d] px-8" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}

                  {/* Bottom Actions */}
                  {!isEditing && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-slate-50">
                      <Button variant="outline" className="justify-start h-12 border-slate-100 hover:bg-slate-50 hover:text-[#4a6b4a] group" onClick={() => document.getElementById('tab-trigger-activity')?.click()}>
                        <Package className="mr-2 h-4 w-4 text-slate-400 group-hover:text-[#4a6b4a]" /> My Orders
                      </Button>
                      <Button variant="outline" className="justify-start h-12 border-red-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 group text-red-500" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4 group-hover:text-red-600" /> Sign Out
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* SECURITY TAB */}
            <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-white px-8 py-6">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">Account Security</CardTitle>
                    <CardDescription className="mt-1">Update your password to keep your account secure.</CardDescription>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#4a6b4a]">
                    <Shield className="h-6 w-6" />
                  </div>
                </CardHeader>

                <CardContent className="p-8 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <div className="space-y-2 md:col-span-1">
                      <Label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Current Password</Label>
                      <Input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className={`border-0 border-b border-slate-100 rounded-none px-0 py-2 h-auto text-base font-semibold focus-visible:ring-0 focus-visible:border-[#4a6b4a] transition-all bg-transparent text-slate-700`}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label className="text-xs uppercase tracking-wider text-slate-400 font-bold">New Password</Label>
                      <Input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Create a new password"
                        className={`border-0 border-b border-slate-100 rounded-none px-0 py-2 h-auto text-base font-semibold focus-visible:ring-0 focus-visible:border-[#4a6b4a] transition-all bg-transparent text-slate-700`}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Confirm New Password</Label>
                      <Input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Re-enter new password"
                        className={`border-0 border-b border-slate-100 rounded-none px-0 py-2 h-auto text-base font-semibold focus-visible:ring-0 focus-visible:border-[#4a6b4a] transition-all bg-transparent text-slate-700`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-12 pt-6 border-t border-slate-50">
                    <Button
                      variant="ghost"
                      onClick={() => setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })}
                      disabled={pwLoading}
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      className="bg-[#4a6b4a] hover:bg-[#3d5a3d] px-8"
                      disabled={pwLoading}
                    >
                      {pwLoading ? "Updating..." : "Change Password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Tips Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="border-b border-slate-50 px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-base font-bold text-slate-800">Password Tips</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 text-sm text-slate-600 space-y-2">
                    <p>✓ Use at least 8 characters</p>
                    <p>✓ Mix uppercase and lowercase letters</p>
                    <p>✓ Include numbers and symbols</p>
                    <p>✓ Avoid personal information</p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden">
                  <CardHeader className="border-b border-slate-50 px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                        <Shield className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-base font-bold text-slate-800">Keep Your Account Safe</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 text-sm text-slate-600 space-y-2">
                    <p>✓ Change password regularly</p>
                    <p>✓ Don't share your credentials</p>
                    <p>✓ Log out on shared devices</p>
                    <p>✓ Use a unique password</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ACTIVITY TAB */}
            <TabsContent value="activity" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <Card key={tx.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 py-4 bg-white rounded-t-xl">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={tx.status === "completed" ? "default" : "secondary"}
                          className={`capitalize ${tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : tx.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : tx.status === "shipped"
                                  ? "bg-orange-100 text-orange-700"
                                  : tx.status === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : tx.status === "completed"
                                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                      : "bg-red-100 text-red-700"
                            }`}
                        >
                          {tx.status}
                        </Badge>
                        <span className="text-sm text-slate-400 font-mono">#{tx.id.slice(0, 8)}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </span>
                    </CardHeader>
                    <CardContent className="p-6 bg-white rounded-b-xl">
                      <div className="space-y-3">
                        {tx.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-700">{item.product.name} <span className="text-slate-400 font-normal">x{item.quantity}</span></span>
                            <span className="font-semibold text-slate-900">₱{(item.product.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end items-center gap-4">
                        <span className="text-sm font-bold text-slate-500">Total</span>
                        <span className="text-xl font-bold text-[#4a6b4a]">₱{tx.total.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))) : (
                <div className="text-center py-12 bg-white rounded-3xl">
                  <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500">No recent activity found.</p>
                </div>
              )}
            </TabsContent>

          </Tabs>

        </div>
      </div>
    </BuyerLayout>
  );
}