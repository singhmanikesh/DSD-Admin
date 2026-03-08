import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { Gamepad2, Lock, Mail } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@dsdgaming.com");
  const [password, setPassword] = useState("");
  const isLoggedIn = localStorage.getItem("dsd_admin_logged_in");

  // Redirect to dashboard if already logged in
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("dsd_admin_logged_in", "true");
      toast.success("Login successful!");
      navigate("/");
    } else {
      toast.error("Please enter email and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0000] relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E50914] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E50914] rounded-full blur-[120px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="w-12 h-12 text-[#E50914]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">DSD Gaming</h1>
            <p className="text-gray-400">Admin Login</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dsdgaming.com"
                  className="pl-11 bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-11 bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#E50914] hover:bg-[#b8070f] text-white rounded-lg transition-all shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/40"
            >
              Login
            </button>
          </form>

          {/* Mock credentials hint */}
          <div className="mt-6 p-3 bg-[#1f1f1f] border border-[#262626] rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              Demo: admin@dsdgaming.com / any password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
