import { Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const DEFAULT_AVATAR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#2a2a2a" />
  <circle cx="50" cy="38" r="18" fill="#8a8a8a" />
  <path d="M20 92c6-18 20-28 30-28s24 10 30 28" fill="#8a8a8a" />
</svg>
`;
const DEFAULT_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(DEFAULT_AVATAR_SVG)}`;

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://dsdpremiumgaming.com/api/v1/users");
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
        <p className="text-gray-400">Manage all registered users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <UsersIcon className="w-5 h-5 text-[#E50914]" />
            <p className="text-gray-400">Total Users</p>
          </div>
          <p className="text-3xl font-bold text-white">{users.length}</p>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-gray-400">Loading users...</div>
      ) : error ? (
        <div className="p-6 text-red-400">Error: {error}</div>
      ) : (
        <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#262626] bg-[#1f1f1f]">
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">ID</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Avatar</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Gamer Name</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Email</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">HP</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Riot ID</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">Steam ID</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#262626] hover:bg-[#1f1f1f] transition-colors"
                  >
                    <td className="px-6 py-4 text-white">{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="w-10 h-10">
                        <ImageWithFallback
                          src={user.avatarUrl || DEFAULT_AVATAR}
                          alt={user.gamerName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{user.gamerName}</td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-white">{user.hp}</td>
                    <td className="px-6 py-4 text-gray-300">{user.riotId}</td>
                    <td className="px-6 py-4 text-gray-300">{user.steamId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
