import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StoryBookBackground from "@/components/StoryBookBackground";
import { ArrowLeft, Check, Lock } from "lucide-react";

interface Accessory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  cost: number;
  category: "hat" | "glasses" | "scarf" | "badge";
}

const ACCESSORIES: Accessory[] = [
  { id: "top-hat", name: "Top Hat", emoji: "🎩", description: "A classy top hat for a classy shroom", cost: 30, category: "hat" },
  { id: "party-hat", name: "Party Hat", emoji: "🥳", description: "It's always a celebration!", cost: 20, category: "hat" },
  { id: "crown", name: "Royal Crown", emoji: "👑", description: "Rule the mood kingdom", cost: 80, category: "hat" },
  { id: "flower", name: "Flower Crown", emoji: "🌸", description: "Blossom vibes only", cost: 40, category: "hat" },
  { id: "sunglasses", name: "Cool Shades", emoji: "😎", description: "Too cool for school", cost: 25, category: "glasses" },
  { id: "heart-glasses", name: "Heart Glasses", emoji: "💖", description: "See the world with love", cost: 35, category: "glasses" },
  { id: "star-glasses", name: "Star Glasses", emoji: "⭐", description: "You're a star!", cost: 50, category: "glasses" },
  { id: "scarf-red", name: "Cozy Scarf", emoji: "🧣", description: "Warm and snuggly", cost: 30, category: "scarf" },
  { id: "bow-tie", name: "Bow Tie", emoji: "🎀", description: "Fancy and adorable", cost: 20, category: "scarf" },
  { id: "badge-star", name: "Star Badge", emoji: "🌟", description: "For outstanding check-ins", cost: 60, category: "badge" },
  { id: "badge-heart", name: "Heart Badge", emoji: "❤️", description: "Spread the love", cost: 45, category: "badge" },
  { id: "badge-rainbow", name: "Rainbow Badge", emoji: "🌈", description: "All the feels", cost: 70, category: "badge" },
];

const getXp = (): number => {
  try { return parseInt(localStorage.getItem("mapleXp") || "0", 10); } catch { return 0; }
};

const getOwned = (): string[] => {
  try { return JSON.parse(localStorage.getItem("mapleOwned") || "[]"); } catch { return []; }
};

const getEquipped = (): string[] => {
  try { return JSON.parse(localStorage.getItem("mapleEquipped") || "[]"); } catch { return []; }
};

const RedeemPoints: React.FC = () => {
  const navigate = useNavigate();
  const [xp, setXp] = useState(getXp);
  const [owned, setOwned] = useState<string[]>(getOwned);
  const [equipped, setEquipped] = useState<string[]>(getEquipped);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { key: "all", label: "All" },
    { key: "hat", label: "🎩 Hats" },
    { key: "glasses", label: "👓 Glasses" },
    { key: "scarf", label: "🧣 Scarves" },
    { key: "badge", label: "⭐ Badges" },
  ];

  const filtered = selectedCategory === "all"
    ? ACCESSORIES
    : ACCESSORIES.filter((a) => a.category === selectedCategory);

  const handleBuy = (accessory: Accessory) => {
    if (xp < accessory.cost || owned.includes(accessory.id)) return;
    const newXp = xp - accessory.cost;
    const newOwned = [...owned, accessory.id];
    setXp(newXp);
    setOwned(newOwned);
    localStorage.setItem("mapleXp", String(newXp));
    localStorage.setItem("mapleOwned", JSON.stringify(newOwned));
  };

  const handleEquip = (id: string) => {
    const accessory = ACCESSORIES.find((a) => a.id === id);
    if (!accessory) return;
    // Only one per category
    let newEquipped = equipped.filter((eId) => {
      const a = ACCESSORIES.find((x) => x.id === eId);
      return a && a.category !== accessory.category;
    });
    if (!equipped.includes(id)) {
      newEquipped.push(id);
    }
    setEquipped(newEquipped);
    localStorage.setItem("mapleEquipped", JSON.stringify(newEquipped));
  };

  const handleUnequip = (id: string) => {
    const newEquipped = equipped.filter((e) => e !== id);
    setEquipped(newEquipped);
    localStorage.setItem("mapleEquipped", JSON.stringify(newEquipped));
  };

  return (
    <StoryBookBackground>
      <div className="min-h-screen flex flex-col items-center px-4 py-6">
        {/* Header */}
        <div className="w-full max-w-lg flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/mood")}
            className="rounded-full p-2 transition-all hover:scale-110 active:scale-95"
            style={{ background: "rgba(255,248,240,0.92)", boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}
          >
            <ArrowLeft size={20} style={{ color: "#3D2B1F" }} />
          </button>
          <h1 className="text-xl font-extrabold tracking-tight" style={{ color: "#3D2B1F" }}>
            Redeem Points
          </h1>
        </div>

        {/* XP Balance */}
        <div
          className="w-full max-w-lg rounded-2xl p-6 mb-6 text-center"
          style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
        >
          <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-1">Your Balance</p>
          <p className="text-4xl font-extrabold text-primary">{xp} XP</p>
          <p className="text-xs text-muted-foreground mt-2">Earn XP by completing mood check-ins (+10 XP each)</p>
        </div>

        {/* Equipped preview */}
        {equipped.length > 0 && (
          <div
            className="w-full max-w-lg rounded-2xl p-5 mb-6"
            style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
          >
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Currently Equipped</p>
            <div className="flex gap-2 flex-wrap">
              {equipped.map((id) => {
                const a = ACCESSORIES.find((x) => x.id === id);
                if (!a) return null;
                return (
                  <button
                    key={id}
                    onClick={() => handleUnequip(id)}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all hover:scale-105"
                    style={{ background: "hsl(var(--primary) / 0.12)", color: "#3D2B1F" }}
                  >
                    <span className="text-lg">{a.emoji}</span>
                    <span>{a.name}</span>
                    <Check size={14} className="text-primary" />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Tap to unequip</p>
          </div>
        )}

        {/* Category filter */}
        <div className="w-full max-w-lg flex gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all"
              style={{
                background: selectedCategory === cat.key ? "hsl(var(--primary))" : "rgba(255,255,255,0.85)",
                color: selectedCategory === cat.key ? "white" : "#3D2B1F",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accessory grid */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-3">
          {filtered.map((accessory) => {
            const isOwned = owned.includes(accessory.id);
            const isEquipped = equipped.includes(accessory.id);
            const canAfford = xp >= accessory.cost;

            return (
              <div
                key={accessory.id}
                className="rounded-2xl p-4 flex flex-col items-center text-center transition-all"
                style={{
                  background: isEquipped
                    ? "hsl(var(--primary) / 0.08)"
                    : "rgba(255,255,255,0.88)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                  border: isEquipped ? "2px solid hsl(var(--primary))" : "2px solid transparent",
                }}
              >
                <span className="text-4xl mb-2">{accessory.emoji}</span>
                <p className="text-sm font-extrabold" style={{ color: "#3D2B1F" }}>
                  {accessory.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1 mb-3">
                  {accessory.description}
                </p>

                {isOwned ? (
                  <button
                    onClick={() => isEquipped ? handleUnequip(accessory.id) : handleEquip(accessory.id)}
                    className="w-full py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                    style={{
                      background: isEquipped ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                      color: isEquipped ? "white" : "#3D2B1F",
                    }}
                  >
                    {isEquipped ? "Equipped ✓" : "Equip"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(accessory)}
                    disabled={!canAfford}
                    className="w-full py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                    style={{
                      background: canAfford ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      color: canAfford ? "white" : "#999",
                    }}
                  >
                    {!canAfford && <Lock size={12} />}
                    {accessory.cost} XP
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </StoryBookBackground>
  );
};

export default RedeemPoints;
