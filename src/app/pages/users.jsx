import { Search, Users as UsersIcon } from "lucide-react";
import { Input } from "../components/ui/input";

export function Users() {
  const users = [
    { id: 1, gamerName: "AceShooter", email: "ace@email.com", joined: "Jan 15, 2026" },
    { id: 2, gamerName: "NightWolf", email: "night@email.com", joined: "Jan 20, 2026" },
    { id: 3, gamerName: "Phantom", email: "phantom@email.com", joined: "Feb 1, 2026" },
    { id: 4, gamerName: "ShadowKing", email: "shadow@email.com", joined: "Feb 10, 2026" },
    { id: 5, gamerName: "ThunderBolt", email: "thunder@email.com", joined: "Feb 15, 2026" },
    { id: 6, gamerName: "DragonSlayer", email: "dragon@email.com", joined: "Feb 20, 2026" },
    { id: 7, gamerName: "CyberNinja", email: "cyber@email.com", joined: "Feb 25, 2026" },
    { id: 8, gamerName: "WarriorX", email: "warrior@email.com", joined: "Mar 1, 2026" },
  ];

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

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-11 bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626] bg-[#1f1f1f]">
                <th className="text-left px-6 py-4 text-gray-400 font-medium">ID</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Gamer Name</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Email</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Joined Date</th>
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
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#E50914]/20 flex items-center justify-center text-[#E50914] font-medium">
                        {user.gamerName.charAt(0)}
                      </div>
                      <span className="text-white">{user.gamerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 text-gray-300">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
