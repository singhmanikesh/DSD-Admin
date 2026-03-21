import { useState } from "react";
import { Coins, User } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function AddHP() {
  const [userId, setUserId] = useState("");
  const [hpAmount, setHpAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("Please provide a user ID");
    setSubmitting(true);
    try {
      const res = await fetch(`http://187.127.133.215:8080/api/v1/users/${userId}/hp`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hp: Number(hpAmount) }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Status ${res.status}`);
      }

      // backend returns a simple success message
      const text = await res.text();
      toast.success(text || `Added ${hpAmount} HP to user ${userId}`);
      setUserId("");
      setHpAmount("");
    } catch (err) {
      console.error(err);
      // Provide a clearer message for network/CORS issues
      if (err instanceof TypeError || /failed to fetch/i.test(String(err.message))) {
        toast.error("Network error: cannot reach backend. Is the backend running and CORS enabled?");
      } else {
        toast.error(err.message || "Failed to add HP. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Add HP to User</h1>
        <p className="text-gray-400">Manage user HP points</p>
      </div>

      <div className="max-w-2xl">
        {/* Add HP Form */}
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#E50914]/10 rounded-lg">
              <Coins className="w-6 h-6 text-[#E50914]" />
            </div>
            <h2 className="text-xl font-bold text-white">Add HP Points</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID */}
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-gray-300">User ID</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="userId"
                  type="number"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g., 1"
                  className="pl-11 bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20"
                  required
                />
              </div>
            </div>

            {/* HP Amount */}
            <div className="space-y-2">
              <Label htmlFor="hpAmount" className="text-gray-300">HP Amount</Label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="hpAmount"
                  type="number"
                  value={hpAmount}
                  onChange={(e) => setHpAmount(e.target.value)}
                  placeholder="e.g., 100"
                  className="pl-11 bg-[#1f1f1f] border-[#262626] text-white placeholder:text-gray-600 focus:border-[#E50914] focus:ring-[#E50914]/20"
                  required
                />
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="space-y-2">
              <Label className="text-gray-300">Quick Add</Label>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 200, 500].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setHpAmount(amount.toString())}
                    className="py-2 bg-[#1f1f1f] hover:bg-[#E50914]/20 hover:border-[#E50914] text-gray-400 hover:text-[#E50914] border border-[#262626] rounded-lg transition-all"
                  >
                    +{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 px-4 rounded-lg transition-all shadow-lg shadow-[#E50914]/20 ${
                submitting
                  ? "bg-[#7a0a0c] text-gray-200 cursor-not-allowed"
                  : "bg-[#E50914] hover:bg-[#b8070f] text-white hover:shadow-[#E50914]/40"
              }`}
            >
              {submitting ? "Adding..." : "Add HP"}
            </button>
          </form>

          {/* removed preview per request */}
        </div>
      </div>
    </div>
  );
}
