import { useNavigate } from "react-router";
import { Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function Tournaments() {
  const navigate = useNavigate();
  const [selectedTournament, setSelectedTournament] = useState(null);

  const tournaments = [
    {
      id: 1,
      name: "Valorant Weekly Cup",
      game: "Valorant",
      category: "VALORANT",
      organizer: "DSD Gaming",
      prize: "5000",
      expiry: "Mar 25, 2026",
      joined: 12,
      status: "Active",
      players: [
        { userId: 1, gamerName: "AceShooter", email: "ace@email.com" },
        { userId: 2, gamerName: "NightWolf", email: "night@email.com" },
        { userId: 3, gamerName: "Phantom", email: "phantom@email.com" },
      ],
    },
    {
      id: 2,
      name: "CSGO Wingman Battle",
      game: "CSGO",
      category: "WINGMAN",
      organizer: "Mythic Dreamz",
      prize: "10000",
      expiry: "Apr 1, 2026",
      joined: 8,
      status: "Active",
      players: [
        { userId: 4, gamerName: "ShadowKing", email: "shadow@email.com" },
        { userId: 5, gamerName: "ThunderBolt", email: "thunder@email.com" },
      ],
    },
    {
      id: 3,
      name: "PUBG Squad Championship",
      game: "PUBG",
      category: "SQUAD",
      organizer: "DSD Gaming",
      prize: "15000",
      expiry: "Apr 10, 2026",
      joined: 24,
      status: "Active",
      players: [
        { userId: 6, gamerName: "DragonSlayer", email: "dragon@email.com" },
        { userId: 7, gamerName: "CyberNinja", email: "cyber@email.com" },
        { userId: 8, gamerName: "WarriorX", email: "warrior@email.com" },
      ],
    },
    {
      id: 4,
      name: "Free Fire Clash",
      game: "Free Fire",
      category: "FREE_FIRE",
      organizer: "ESL Gaming",
      prize: "8000",
      expiry: "Mar 28, 2026",
      joined: 16,
      status: "Active",
      players: [
        { userId: 1, gamerName: "AceShooter", email: "ace@email.com" },
        { userId: 2, gamerName: "NightWolf", email: "night@email.com" },
      ],
    },
    {
      id: 5,
      name: "BGMI Solo Masters",
      game: "BGMI",
      category: "SOLO",
      organizer: "DSD Gaming",
      prize: "12000",
      expiry: "Mar 15, 2026",
      joined: 32,
      status: "Ended",
      players: [
        { userId: 3, gamerName: "Phantom", email: "phantom@email.com" },
        { userId: 4, gamerName: "ShadowKing", email: "shadow@email.com" },
      ],
    },
  ];

  const handleDelete = (id, name) => {
    toast.success(`Tournament "${name}" deleted successfully`);
  };

  const handleViewPlayers = (tournamentId) => {
    setSelectedTournament(tournamentId);
  };

  const closeModal = () => {
    setSelectedTournament(null);
  };

  const selectedTournamentData = tournaments.find((t) => t.id === selectedTournament);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tournament Management</h1>
          <p className="text-gray-400">Manage all tournaments and competitions</p>
        </div>
        <button
          onClick={() => navigate("/tournaments/create")}
          className="flex items-center gap-2 px-5 py-3 bg-[#E50914] hover:bg-[#b8070f] text-white rounded-lg transition-all shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/40"
        >
          <Plus className="w-5 h-5" />
          Create Tournament
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626] bg-[#1f1f1f]">
                <th className="text-left px-6 py-4 text-gray-400 font-medium">ID</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Tournament Name</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Game</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Category</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Organizer</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Prize</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Expiry Date</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Joined</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((tournament) => (
                <tr
                  key={tournament.id}
                  className="border-b border-[#262626] hover:bg-[#1f1f1f] transition-colors"
                >
                  <td className="px-6 py-4 text-white">{tournament.id}</td>
                  <td className="px-6 py-4 text-white">{tournament.name}</td>
                  <td className="px-6 py-4 text-gray-300">{tournament.game}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#E50914]/20 text-[#E50914] rounded text-xs">
                      {tournament.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{tournament.organizer}</td>
                  <td className="px-6 py-4 text-green-400">₹{tournament.prize}</td>
                  <td className="px-6 py-4 text-gray-300">{tournament.expiry}</td>
                  <td className="px-6 py-4 text-white">{tournament.joined}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        tournament.status === "Active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {tournament.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewPlayers(tournament.id)}
                        className="p-2 hover:bg-[#E50914]/20 text-gray-400 hover:text-[#E50914] rounded transition-colors"
                        title="View Players"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tournament.id, tournament.name)}
                        className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Players Modal */}
      {selectedTournament && selectedTournamentData && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#141414] border border-[#262626] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-[#262626]">
              <h2 className="text-2xl font-bold text-white mb-1">
                {selectedTournamentData.name}
              </h2>
              <p className="text-gray-400">
                Total Players: {selectedTournamentData.players.length}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#262626]">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">User ID</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Gamer Name</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTournamentData.players.map((player) => (
                    <tr
                      key={player.userId}
                      className="border-b border-[#262626] hover:bg-[#1f1f1f] transition-colors"
                    >
                      <td className="px-4 py-3 text-white">{player.userId}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#E50914]/20 flex items-center justify-center text-[#E50914] font-medium">
                            {player.gamerName.charAt(0)}
                          </div>
                          <span className="text-white">{player.gamerName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{player.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#262626]">
              <button
                onClick={closeModal}
                className="w-full py-2 px-4 bg-[#1f1f1f] hover:bg-[#262626] text-white rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
