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
  });

  const categories = [
    "VALORANT",
    "CSGO",
    "WINGMAN",
    "PUBG",
    "SQUAD",
    "SOLO",
    "FREE_FIRE",
    "BGMI",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Tournament created successfully!");
    navigate("/tournaments");
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
                className="flex-1 py-3 px-4 bg-[#E50914] hover:bg-[#b8070f] text-white rounded-lg transition-all shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/40"
              >
                Create Tournament
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

        {/* Mock Preview */}
        <div className="mt-6 bg-[#141414] border border-[#262626] rounded-xl p-6">
          <h3 className="text-white font-medium mb-3">Preview Data:</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Tournament Name: Valorant Weekly Cup</p>
            <p>Category: VALORANT</p>
            <p>Game Name: Valorant</p>
            <p>Prize: ₹5000</p>
            <p>Organizer: DSD Gaming</p>
            <p>Expiry: 2026-03-25</p>
          </div>
        </div>
      </div>
    </div>
  );
}
