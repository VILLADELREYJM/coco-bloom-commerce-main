import BuyerLayout from "@/components/BuyerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Phone, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <BuyerLayout>
        <div className="container flex min-h-[60vh] items-center justify-center py-16 text-center">
          <div className="max-w-md p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
            <p className="text-slate-500 mt-2 mb-6">Please log in to your account to view your profile details.</p>
            <Link to="/login">
              <Button className="w-full h-12 bg-[#4a6b4a] hover:bg-[#3d5a3d] transition-all shadow-sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </BuyerLayout>
    );
  }

  const infoFields = [
    { icon: Mail, label: "Email Address", value: user.email },
    { icon: MapPin, label: "Shipping Address", value: user.address || "Not set" },
    { icon: Phone, label: "Contact Number", value: user.mobile || "Not set" },
  ];

  return (
    <BuyerLayout>
      <div className="min-h-screen bg-[#fcfcf9]">
        <div className="container py-16 max-w-2xl"> {/* Narrower container for a centered look */}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Visual Accent Header */}
            <div className="h-32 bg-gradient-to-r from-[#4a6b4a] to-[#6a8b6a]" />

            <div className="px-10 pb-10">
              {/* Profile Avatar */}
              <div className="relative -mt-12 mb-6">
                <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-md">
                  <div className="h-full w-full rounded-xl bg-slate-50 flex items-center justify-center text-[#4a6b4a]">
                    <User size={40} />
                  </div>
                </div>
              </div>

              {/* User Identity Area */}
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">{user.name}</h2>
                  <p className="text-sm text-slate-500 font-medium">EcoCoin Market Member</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 rounded-full border-slate-200 text-xs font-bold">
                  <Edit size={14} /> Edit Profile
                </Button>
              </div>

              <Separator className="mb-10 opacity-50" />

              {/* Personal Details List */}
              <div className="grid gap-8">
                {infoFields.map((f) => (
                  <div key={f.label} className="flex items-center gap-5 group">
                    <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#f15a2b]/10 group-hover:text-[#f15a2b] transition-all">
                      <f.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-0.5">{f.label}</p>
                      <p className="text-slate-700 font-semibold">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Minimalist Footer Action */}
          <div className="mt-8 text-center">
            <button className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">
              Logout Account
            </button>
          </div>

        </div>
      </div>
    </BuyerLayout>
  );
};

export default Profile;