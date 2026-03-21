import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

export function CreateTournament() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    game: "",
    prize: "",
    organizer: "",
    expiry: "",
    description: "",
    hpReward: "",
  });

  const categories = [
    // Games
    "VALORANT",
    "DOTA2",
    "CSGO",
    "PUBG",

    // Game Modes
    "AIM_1V1",
    "MODE_2V2",
    "MODE_5V5",
    "HOSTAGE",
    "WINGMAN",

    // Tournament Format
    "SINGLE_ELIMINATION",
    "DOUBLE_ELIMINATION",
    "ROUND_ROBIN",
    "SWISS_SYSTEM",
    "FFA",

    // Tournament Status
    "UPCOMING",
    "ONGOING",
    "FINISHED",

    // Prize Types
    "MONEY",
    "POINTS",
  ];

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      tournamentName: formData.name,
      tournamentCategory: formData.category,
      tournamentExpiry: formData.expiry,
      tournamentPrize: Number(formData.prize),
      hpReward: formData.hpReward === "" ? null : Number(formData.hpReward),
      organizerName: formData.organizer,
      gameName: formData.game,
      description: formData.description,
    };

    try {
      const res = await fetch("http://localhost:8080/api/v1/tournaments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }

      const data = await res.json();

      // Show success to the user (do not show full backend response)
      toast.success(`Tournament "${data.tournamentName || formData.name}" created successfully!`);
      navigate("/tournaments");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create tournament. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/tournaments")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tournaments
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Create Tournament</h1>
        <p className="text-gray-400">Add a new tournament to the platform</p>
      </div>

      {/* Form */}
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-[#141414] border border-[#262626] rounded-xl p-8">
          <div className="space-y-6">
            {/* Tournament Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Tournament Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., Valorant Weekly Cup"
                className="bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300">Tournament Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger className="bg-[#1f1f1f] border-[#262626] text-white focus:border-[#E50914] focus:ring-[#E50914]/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1f1f1f] border-[#262626]">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-[#E50914]/20">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Game Name */}
            <div className="space-y-2">
              <Label htmlFor="game" className="text-gray-300">Game Name</Label>
              <Input
                id="game"
                value={formData.game}
                onChange={(e) => handleChange("game", e.target.value)}
                placeholder="e.g., Valorant"
                className="bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20"
                required
              />
            </div>

            {/* Prize and Organizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="prize" className="text-gray-300">Tournament Prize (₹)</Label>
                <Input
                  id="prize"
                  type="number"
                  value={formData.prize}
                  onChange={(e) => handleChange("prize", e.target.value)}
                  placeholder="e.g., 5000"
                  className="bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer" className="text-gray-300">Organizer Name</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => handleChange("organizer", e.target.value)}
                  placeholder="e.g., DSD Gaming"
                  className="bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20"
                  required
                />
              </div>
            </div>

            {/* HP Reward */}
            <div className="space-y-2">
              <Label htmlFor="hpReward" className="text-gray-300">HP Reward </Label>
              <Input
                id="hpReward"
                type="number"
                value={formData.hpReward}
                onChange={(e) => handleChange("hpReward", e.target.value)}
                placeholder="e.g., 50"
                className="bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20"
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-gray-300">Tournament Expiry</Label>
              <Input
                id="expiry"
                type="datetime-local"
                value={formData.expiry}
                onChange={(e) => handleChange("expiry", e.target.value)}
                className="bg-[#1f1f1f] border-[#262626] text-white focus:border-[#E50914] focus:ring-[#E50914]/20"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter tournament description and rules..."
                rows={5}
                className="bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-3 px-4 rounded-lg transition-all shadow-lg shadow-[#E50914]/20 ${
                  submitting
                    ? "bg-[#7a0a0c] text-gray-200 cursor-not-allowed"
                    : "bg-[#E50914] hover:bg-[#b8070f] text-white hover:shadow-[#E50914]/40"
                }`}
              >
                {submitting ? "Creating..." : "Create Tournament"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/tournaments")}
                className="px-8 py-3 bg-[#1f1f1f] hover:bg-[#262626] text-gray-400 hover:text-white rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
