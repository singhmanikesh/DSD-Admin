import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { Gamepad2, Lock, Mail } from "lucide-react";
import logo from "../../assets/DSD logo nav bars.png";
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

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter email and password");
    setLoading(true);
    try {
      const res = await fetch("http://187.127.133.215/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await (res.headers.get("content-type")?.includes("application/json") ? res.json() : res.text());

      if (!res.ok) {
        const msg = data?.error || data || `Status ${res.status}`;
        throw new Error(msg);
      }

      // Save minimal required fields and full user object for role checks
      localStorage.setItem("dsd_admin_logged_in", "true");
      if (data.accesstoken) localStorage.setItem("dsd_admin_accessToken", data.accesstoken);

      // Derive role flags from either root-level fields or nested `user` object.
      const isOwnerFlag = typeof data.isOwner !== "undefined" ? data.isOwner : (data.user?.isOwner ?? false);
      const isAdminFlag = typeof data.isAdmin !== "undefined" ? data.isAdmin : (data.user?.isAdmin ?? false);

      // Build a stored user object (prefer backend `user` if present, but ensure flags exist)
      const userObj = data.user
        ? { ...data.user, isOwner: isOwnerFlag, isAdmin: isAdminFlag }
        : {
            gamerName: data.gamerName || data.gamername || data.name,
            isOwner: isOwnerFlag,
            isAdmin: isAdminFlag,
          };

      try {
        localStorage.setItem("dsd_admin_user", JSON.stringify(userObj));
      } catch (e) {
        // ignore storage errors
      }

      if (userObj.gamerName) localStorage.setItem("dsd_admin_gamerName", userObj.gamerName);
      // Store explicit flags derived from the response (not just from userObj fields)
      localStorage.setItem("dsd_admin_isOwner", String(Boolean(isOwnerFlag)));
      localStorage.setItem("dsd_admin_isAdmin", String(Boolean(isAdminFlag)));

      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message) {
        toast.error(err.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
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
            <img src={logo} alt="DSD Gaming Logo" className="object-contain mb-1" style={{ height: 162 }} />
            <h1 className="text-2xl font-bold text-white mb-0">DSD Premium Gaming</h1>
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

         
        </div>
      </div>
    </div>
  );
}
