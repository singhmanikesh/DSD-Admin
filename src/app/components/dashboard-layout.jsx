import { Outlet, useNavigate, useLocation, Navigate } from "react-router";
import { 
  Trophy, 
  Users, 
  Coins, 
  LogOut,
  Gamepad2
} from "lucide-react";

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("dsd_admin_logged_in");

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("dsd_admin_logged_in");
    navigate("/login");
  };

  const menuItems = [
    { icon: Trophy, label: "Tournaments", path: "/tournaments" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: Coins, label: "Add HP", path: "/users/add-hp" },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-[#262626] flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-[#E50914]" />
            <div>
              <h1 className="text-xl font-bold text-white">DSD Gaming</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>
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
                  isActive(item.path)
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
        <Outlet />
      </main>
    </div>
  );
}
