import { useNavigate } from "react-router";
import { Plus, Trash2, Eye, Users } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function Tournaments() {
  const navigate = useNavigate();
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://187.127.133.215:8080/api/v1/global/tournaments");
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();

        // Map backend shape to UI shape
        const mapped = data.map((t) => {
          const expiryDate = t.tournamentExpiry ? new Date(t.tournamentExpiry) : null;
          const now = new Date();
          return {
            id: t.tournamentId,
            name: t.tournamentName,
            game: t.gameName,
            category: t.tournamentCategory,
            organizer: t.organizerName,
            prize: String(t.tournamentPrize),
            hpReward: typeof t.hpReward !== 'undefined' && t.hpReward !== null ? t.hpReward : null,
            expiry: expiryDate ? expiryDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "-",
            joined: t.totalJoined ?? 0,
            status: expiryDate && expiryDate < now ? "Ended" : "Active",
            players: [], // backend doesn't return players yet
            description: t.description,
            createdAt: t.tournamentCreated,
          };
        });

        setTournaments(mapped);
      } catch (err) {
        setError(err.message || "Failed to load tournaments");
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const handleDelete = (id, name) => {
    // legacy - replaced by themed modal
    setDeleteTarget({ id, name });
  };

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const performDelete = async () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    setDeleting(true);
    try {
      const res = await fetch(`http://187.127.133.215:8080/api/v1/tournaments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }

      setTournaments((prev) => prev.filter((t) => t.id !== id));
      if (selectedTournament === id) setSelectedTournament(null);
      toast.success(`Tournament "${name}" deleted successfully`);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete tournament. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleViewPlayers = (tournamentId) => {
    // fetch players for the tournament and then open modal
    fetchPlayersForTournament(tournamentId);
  };

  const closeModal = () => {
    setSelectedTournament(null);
    setPlayers([]);
    setPlayersError(null);
    setPlayersLoading(false);
  };

  const selectedTournamentData = tournaments.find((t) => t.id === selectedTournament);
  const [players, setPlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [playersError, setPlayersError] = useState(null);

  // Teams state
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState(null);
  const [selectedTeamsTournament, setSelectedTeamsTournament] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchPlayersForTournament = async (tournamentId) => {
    setPlayers([]);
    setPlayersLoading(true);
    setPlayersError(null);
    try {
      const res = await fetch(`http://187.127.133.215:8080/api/v1/tournaments/${tournamentId}/users`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();

      // Only keep required fields and normalize keys
      const mapped = (data || []).map((p) => ({
        userId: p.userId ?? p.id ?? null,
        gamerName: p.gamerName || p.gamer_name || p.name || "",
        email: p.email || "",
      }));

      setPlayers(mapped);
      setSelectedTournament(tournamentId);
    } catch (err) {
      console.error(err);
      setPlayersError(err.message || "Failed to load players");
    } finally {
      setPlayersLoading(false);
    }
  };

  const handleViewTeams = (tournamentId) => {
    fetchTeamsForTournament(tournamentId);
  };

  const fetchTeamsForTournament = async (tournamentId) => {
    setTeams([]);
    setTeamsLoading(true);
    setTeamsError(null);
    try {
      const res = await fetch(`http://187.127.133.215:8080/api/v1/tournaments/${tournamentId}/teams`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();

      // Expecting array of teams with players array
      const mapped = (data || []).map((team, idx) => ({
        id: team.teamId ?? idx,
        teamName: team.teamName || team.name || "Team",
        teamLeader: team.teamLeader || team.leader || "",
        players: Array.isArray(team.players) ? team.players : [],
      }));

      setTeams(mapped);
      setSelectedTeamsTournament(tournamentId);
    } catch (err) {
      console.error(err);
      setTeamsError(err.message || "Failed to load teams");
    } finally {
      setTeamsLoading(false);
    }
  };

  const closeTeamsModal = () => {
    setSelectedTeamsTournament(null);
    setTeams([]);
    setTeamsError(null);
    setTeamsLoading(false);
    setSelectedTeam(null);
  };

  const handleViewTeamPlayers = (team) => {
    // team object already contains players array from backend
    setSelectedTeam(team);
  };

  const closeTeamPlayersModal = () => {
    setSelectedTeam(null);
  };

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
      {loading ? (
        <div className="flex items-center justify-center p-12 text-gray-400">Loading tournaments...</div>
      ) : error ? (
        <div className="p-6 text-red-400">Error: {error}</div>
      ) : (
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
                <th className="text-left px-6 py-4 text-gray-400 font-medium">HP Reward</th>
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
                  <td className="px-6 py-4 text-blue-300">{tournament.hpReward !== null ? `${tournament.hpReward} HP` : '-'}</td>
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
                        onClick={() => handleViewTeams(tournament.id)}
                        className="p-2 hover:bg-[#E50914]/20 text-gray-400 hover:text-[#E50914] rounded transition-colors"
                        title="View Teams"
                      >
                        <Users className="w-4 h-4" />
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
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="bg-[#141414] border border-[#262626] rounded-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#262626]">
              <h3 className="text-xl font-bold text-white">Delete Tournament</h3>
              <p className="text-gray-400 mt-1">Are you sure you want to delete "{deleteTarget.name}"? This action cannot be undone.</p>
            </div>

            <div className="p-4 flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 bg-[#1f1f1f] hover:bg-[#262626] text-gray-300 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={performDelete}
                disabled={deleting}
                className={`px-4 py-2 rounded-lg text-white ${deleting ? 'bg-[#7a0a0c]' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Players Modal */}
      {selectedTournament && (
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
                {selectedTournamentData ? selectedTournamentData.name : "Players"}
              </h2>
              <p className="text-gray-400">
                Total Players: {players.length}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {playersLoading ? (
                <div className="text-gray-400 p-6">Loading players...</div>
              ) : playersError ? (
                <div className="text-red-400 p-6">Error: {playersError}</div>
              ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#262626]">
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">User ID</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Gamer Name</th>
                    <th className="text-left px-4 py-3 text-gray-400 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr
                      key={player.userId}
                      className="border-b border-[#262626] hover:bg-[#1f1f1f] transition-colors"
                    >
                      <td className="px-4 py-3 text-white">{player.userId}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#E50914]/20 flex items-center justify-center text-[#E50914] font-medium">
                            {player.gamerName ? player.gamerName.charAt(0) : "-"}
                          </div>
                          <span className="text-white">{player.gamerName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{player.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              )}
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

      {/* Teams Modal */}
      {selectedTeamsTournament && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeTeamsModal}
        >
          <div
            className="bg-[#141414] border border-[#262626] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#262626]">
              <h2 className="text-2xl font-bold text-white mb-1">Teams</h2>
              <p className="text-gray-400">Total Teams: {teams.length}</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {teamsLoading ? (
                <div className="text-gray-400 p-6">Loading teams...</div>
              ) : teamsError ? (
                <div className="text-red-400 p-6">Error: {teamsError}</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#262626]">
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Team Name</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Leader</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Players</th>
                      <th className="text-left px-4 py-3 text-gray-400 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => (
                      <tr key={team.id} className="border-b border-[#262626] hover:bg-[#1f1f1f] transition-colors">
                        <td className="px-4 py-3 text-white">{team.teamName}</td>
                        <td className="px-4 py-3 text-gray-300">{team.teamLeader}</td>
                        <td className="px-4 py-3 text-white">{team.players ? team.players.length : 0}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleViewTeamPlayers(team)}
                            className="px-3 py-1 bg-[#1f1f1f] hover:bg-[#262626] text-white rounded-lg"
                          >
                            View Team Players
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-6 border-t border-[#262626]">
              <button
                onClick={closeTeamsModal}
                className="w-full py-2 px-4 bg-[#1f1f1f] hover:bg-[#262626] text-white rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Players Modal */}
      {selectedTeam && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeTeamPlayersModal}
        >
          <div
            className="bg-[#141414] border border-[#262626] rounded-xl max-w-md w-full max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#262626]">
              <h3 className="text-xl font-bold text-white">{selectedTeam.teamName}</h3>
              <p className="text-gray-400">Leader: {selectedTeam.teamLeader}</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {(!selectedTeam.players || selectedTeam.players.length === 0) ? (
                <div className="text-gray-400 p-6">No players in this team.</div>
              ) : (
                <ul className="space-y-3">
                  {selectedTeam.players.map((p, i) => (
                    <li key={i} className="flex items-center gap-3 px-3 py-2 bg-[#0f0f0f] rounded">
                      <div className="w-8 h-8 rounded-full bg-[#E50914]/20 flex items-center justify-center text-[#E50914] font-medium">{typeof p === 'string' ? p.charAt(0) : (p.gamerName ? p.gamerName.charAt(0) : '-')}</div>
                      <div>
                        <div className="text-white">{typeof p === 'string' ? p : (p.gamerName || p.name || JSON.stringify(p))}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-6 border-t border-[#262626]">
              <button
                onClick={closeTeamPlayersModal}
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
