import { Outlet, useNavigate, useLocation, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { 
  Trophy, 
  Users, 
  Coins, 
  LogOut,
  Gamepad2,
  UserPlus,
} from "lucide-react";
import logo from "../../assets/DSD logo nav bars.png";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("dsd_admin_logged_in");
  const [gamerName, setGamerName] = useState(localStorage.getItem("dsd_admin_gamerName") || "");

  useEffect(() => {
    setGamerName(localStorage.getItem("dsd_admin_gamerName") || "");
    const onStorage = () => setGamerName(localStorage.getItem("dsd_admin_gamerName") || "");
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("dsd_admin_logged_in");
    localStorage.removeItem("dsd_admin_accessToken");
    localStorage.removeItem("dsd_admin_gamerName");
    setGamerName("");
    navigate("/login");
  };

  // Derive roles from the stored user object when available; fall back to explicit flags
  let isOwner = false;
  try {
    const userJson = localStorage.getItem("dsd_admin_user");
    if (userJson) {
      const user = JSON.parse(userJson);
      isOwner = Boolean(user?.isOwner);
    } else {
      isOwner = localStorage.getItem("dsd_admin_isOwner") === "true";
    }
  } catch (e) {
    isOwner = localStorage.getItem("dsd_admin_isOwner") === "true";
  }

  const menuItems = [
    { icon: Trophy, label: "Tournaments", path: "/tournaments" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: UserPlus, label: "Create Admin", path: "/admins/create" },
    { icon: Coins, label: "Add HP", path: "/users/add-hp" },
  ];

  // Determine the most specific matching menu path for the current location.
  // This ensures nested routes like "/users/add-hp" activate the exact item
  // instead of the parent "/users" item.
  const activePath = (
    menuItems
      .map((m) => m.path)
      .filter((p) => (p === "/" ? location.pathname === "/" : location.pathname.startsWith(p)))
      .sort((a, b) => b.length - a.length)[0] || "/"
  );

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-[#262626] flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-[#262626]">
          <img src={logo} alt="DSD Gaming Logo" className="object-contain" style={{ height: 108 }} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  activePath === item.path
                    ? "bg-[#E50914] text-white shadow-lg shadow-[#E50914]/20"
                    : "text-gray-400 hover:bg-[#1f1f1f] hover:text-white"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#262626]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-[#1f1f1f] hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="flex items-center justify-end px-6 py-3 border-b border-[#262626]">
          {gamerName ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E50914]/20 flex items-center justify-center text-[#E50914] font-medium">
                {gamerName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-gray-300">{gamerName}</span>
            </div>
          ) : null}
        </div>
        <Outlet />
      </main>
    </div>
  );
}
