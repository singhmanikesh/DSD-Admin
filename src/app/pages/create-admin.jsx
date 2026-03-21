import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function CreateAdmin() {
  const navigate = useNavigate();
  // Read role flags from localStorage to determine permissions
  let isOwner = false;
  let isAdmin = false;
  try {
    const userJson = localStorage.getItem("dsd_admin_user");
    if (userJson) {
      const user = JSON.parse(userJson);
      isOwner = Boolean(user?.isOwner);
      isAdmin = Boolean(user?.isAdmin);
    } else {
      isOwner = localStorage.getItem("dsd_admin_isOwner") === "true";
      isAdmin = localStorage.getItem("dsd_admin_isAdmin") === "true";
    }
  } catch (e) {
    isOwner = localStorage.getItem("dsd_admin_isOwner") === "true";
    isAdmin = localStorage.getItem("dsd_admin_isAdmin") === "true";
  }
  const [form, setForm] = useState({
    email: "",
    password: "",
    gamername: "",
    isAdmin: false,
    isOwner: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("https://dsdpremiumgaming.com/api/v1/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          gamername: form.gamername,
          isAdmin: form.isAdmin,
          isOwner: form.isOwner,
        }),
      });

      const data = await (res.headers.get("content-type")?.includes("application/json") ? res.json() : res.text());

      if (!res.ok) {
        const msg = data?.error || data || `Status ${res.status}`;
        throw new Error(msg);
      }

      const message = data?.message || "Admin registered successfully";
      toast.success(message);
      navigate("/users");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to register admin");
    } finally {
      setSubmitting(false);
    }
  };

  // If the user is not an owner, show a themed error instead of the form.
  if (!isOwner) {
    return (
      <div className="p-8">
        <div className="max-w-2xl">
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Insufficient Permissions</h2>
            <p className="text-gray-400 mb-6">
              {isAdmin
                ? "You have admin access but not owner permissions. Contact an owner to create admin accounts."
                : "You do not have permission to access this page. Contact an owner to request access."}
            </p>
            <button onClick={() => navigate(-1)} className="px-6 py-2 bg-[#1f1f1f] hover:bg-[#262626] text-gray-300 rounded-lg">Go back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Create Admin Account</h1>
        <p className="text-gray-400">Create a new admin/owner account</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#262626] rounded-xl p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input id="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="owner1@byom.de" className="bg-[#1f1f1f] border-[#262626] text-white" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input id="password" type="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} placeholder="StrongPass@123" className="bg-[#1f1f1f] border-[#262626] text-white" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gamername" className="text-gray-300">Gamer Name</Label>
            <Input id="gamername" value={form.gamername} onChange={(e) => handleChange("gamername", e.target.value)} placeholder="owner1" className="bg-[#1f1f1f] border-[#262626] text-white" required />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" checked={form.isAdmin} onChange={(e) => handleChange("isAdmin", e.target.checked)} />
              <span>Is Admin</span>
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input type="checkbox" checked={form.isOwner} onChange={(e) => handleChange("isOwner", e.target.checked)} />
              <span>Is Owner</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={submitting} className={`flex-1 py-3 px-4 rounded-lg transition-all shadow-lg shadow-[#E50914]/20 ${submitting ? 'bg-[#7a0a0c] text-gray-200 cursor-not-allowed' : 'bg-[#E50914] hover:bg-[#b8070f] text-white'}`}>
              {submitting ? 'Creating...' : 'Create Admin'}
            </button>
            <button type="button" onClick={() => navigate("/users")} className="px-8 py-3 bg-[#1f1f1f] hover:bg-[#262626] text-gray-400 hover:text-white rounded-lg transition-all">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAdmin;
