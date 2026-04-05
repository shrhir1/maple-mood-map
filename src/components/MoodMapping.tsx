import React, { useState, useEffect, useRef } from "react";
import Maple from "./Maple";
import StoryBookBackground from "./StoryBookBackground";
import { Check, Heart } from "lucide-react";
import { getMapleResponse } from "@/lib/claude";
import AngryFace from "./icons/AngryFace";

type Screen = "welcome" | "severity" | "loading" | "recommendations" | "done";

interface Emotion {
  label: string;
  emoji: string;
  selectedBg: string;
  selectedBorder: string;
}

interface AIRecommendation {
  icon: string;
  title: string;
  description: string;
}

const emotions: Emotion[] = [
  { label: "Sad", emoji: "😢", selectedBg: "#E8F4FD", selectedBorder: "#5BA4CF" },
  { label: "Stressed", emoji: "😤", selectedBg: "#F3EEFF", selectedBorder: "#9B72CF" },
  { label: "Angry", emoji: "angry", selectedBg: "#FFEDED", selectedBorder: "#E05C5C" },
  { label: "Fearful", emoji: "😨", selectedBg: "#EEFAF3", selectedBorder: "#52B788" },
  { label: "Tired", emoji: "😴", selectedBg: "#FFFBE6", selectedBorder: "#F4C430" },
];

const getSeverityTip = (value: number): string => {
  if (value <= 2) return "That's manageable! A small break might be all you need. 🌿";
  if (value <= 4) return "You're noticing it — that's self-awareness! Let's find something gentle. 🌱";
  if (value <= 6) return "It's okay to feel this strongly. You're doing great by checking in. 💛";
  if (value <= 8) return "That sounds tough. Let's find something that really helps. 🤗";
  return "I hear you. You're not alone in this. Let's take it one step at a time. 💕";
};

const MapleSpeechBubble: React.FC<{ message: string; expression: "waving" | "attentive" | "gentle" | "happy"; bouncing?: boolean }> = ({
  message,
  bouncing = false,
}) => (
  <div className="flex flex-col items-center mb-6">
    <div className={bouncing ? "animate-bounce" : ""}>
      <Maple expression="waving" className="w-[130px] h-[156px]" />
    </div>
    <div className="relative bg-white rounded-2xl px-6 py-4 mt-2 max-w-[300px] text-center"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 rounded-sm" />
      <p className="relative text-sm font-bold" style={{ color: "#3D2B1F" }}>{message}</p>
    </div>
  </div>
);

/* ─── Brand badge ─── */
const BrandBadge: React.FC = () => (
  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-sm"
    style={{ background: "rgba(255,248,240,0.85)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
    <svg viewBox="0 0 100 120" width="18" height="22">
      <rect x="30" y="48" width="40" height="52" rx="18" fill="hsl(40, 45%, 94%)" />
      <ellipse cx="50" cy="38" rx="38" ry="26" fill="hsl(345, 55%, 35%)" />
      <ellipse cx="50" cy="44" rx="36" ry="5" fill="hsl(345, 50%, 27%)" />
      <ellipse cx="34" cy="28" rx="6" ry="4" fill="hsl(35, 30%, 68%)" transform="rotate(-10 34 28)" />
      <ellipse cx="60" cy="22" rx="5.5" ry="3.5" fill="hsl(35, 30%, 68%)" transform="rotate(8 60 22)" />
    </svg>
    <span className="text-xs font-extrabold tracking-tight" style={{ color: "#3D2B1F" }}>Mood Mapping</span>
  </div>
);

const MoodMapping: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [severity, setSeverity] = useState(5);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [animStep, setAnimStep] = useState(0);
  const hasAnimated = useRef(false);

  // AI response state
  const [aiMessage, setAiMessage] = useState<string>("");
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [escalate, setEscalate] = useState(false);
  const [escalateMessage, setEscalateMessage] = useState<string | null>(null);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const t1 = setTimeout(() => setAnimStep(1), 300);
    const t2 = setTimeout(() => setAnimStep(2), 800);
    const t3 = setTimeout(() => setAnimStep(3), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleShowRecommendations = async () => {
    if (!selectedEmotion) return;
    setScreen("loading");
    try {
      const result = await getMapleResponse(selectedEmotion, severity);
      setAiMessage(result.mapleMessage);
      setAiRecommendations(result.recommendations);
      setEscalate(result.escalate);
      setEscalateMessage(result.escalateMessage);
      setScreen("recommendations");
    } catch (error) {
      console.error("AI call failed, using fallback:", error);
      setAiMessage("Here are some things that might help 💛");
      setAiRecommendations([
        { icon: "📝", title: "Journal it out", description: "Write down your thoughts for 5 minutes. No rules, just let it flow." },
        { icon: "🚶", title: "Take a short walk", description: "Even 10 minutes outside can reset your mood." },
        { icon: "🧘", title: "Try a meditation", description: "Close your eyes, breathe deep, and let go for a few minutes." },
      ]);
      setEscalate(false);
      setEscalateMessage(null);
      setScreen("recommendations");
    }
  };

  const handleReset = () => {
    setScreen("welcome");
    setSelectedEmotion(null);
    setSeverity(5);
    setStreak((s) => s + 1);
    setAiMessage("");
    setAiRecommendations([]);
    setEscalate(false);
    setEscalateMessage(null);
  };

  return (
    <StoryBookBackground>
      <div className="min-h-screen flex flex-col">
        {/* ═══ Screen 1: Welcome ═══ */}
        {screen === "welcome" && (
          <div className="min-h-screen flex flex-col px-4 pb-[12vh]">
            <div className="pt-3 pl-1">
              <BrandBadge />
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div
                className={`${animStep >= 1 ? "anim-maple-enter" : ""}`}
                style={{ opacity: animStep >= 1 ? undefined : 0 }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-[280px] h-[280px] rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(255,180,120,0.3) 0%, transparent 70%)",
                    }} />
                  <div className="relative anim-maple-float" style={{ width: 200, height: 200 }}>
                    <Maple expression="waving" className="w-full h-full drop-shadow-lg" />
                  </div>
                </div>
              </div>
              <div
                className={`mt-4 ${animStep >= 2 ? "anim-bubble-enter" : ""}`}
                style={{ opacity: animStep >= 2 ? undefined : 0 }}
              >
                <div className="relative bg-white rounded-3xl text-center max-w-[340px] mx-auto"
                  style={{ padding: "24px 32px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rotate-45 rounded-sm" />
                  <p className="relative font-bold leading-snug" style={{ color: "#3D2B1F", fontSize: 20 }}>
                    Hey! I'm Maple 🍄
                  </p>
                  <p className="relative mt-1 font-semibold" style={{ color: "#8B6F5E", fontSize: 16 }}>
                    How are you feeling today?
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full max-w-[460px] mx-auto">
              <div className="flex gap-2.5 mb-4 w-full">
                {emotions.map((e, i) => {
                  const isSelected = selectedEmotion === e.label;
                  return (
                    <button
                      key={e.label}
                      onClick={() => setSelectedEmotion(e.label)}
                      className={`flex-1 flex flex-col items-center justify-center gap-2 rounded-[20px] transition-all duration-200
                        ${animStep >= 3 ? "anim-ui-fade-up" : ""}`}
                      style={{
                        minHeight: 100,
                        opacity: animStep >= 3 ? undefined : 0,
                        animationDelay: animStep >= 3 ? `${i * 100}ms` : undefined,
                        animationFillMode: "forwards",
                        background: isSelected ? e.selectedBg : "#FFFAF7",
                        boxShadow: isSelected
                          ? `0 4px 16px rgba(0,0,0,0.1)`
                          : "0 4px 16px rgba(0,0,0,0.07)",
                        borderBottom: isSelected ? `3px solid ${e.selectedBorder}` : "3px solid transparent",
                        transform: isSelected ? "scale(1.03)" : undefined,
                      }}
                    >
                      {e.emoji === "angry" ? (
                        <AngryFace className="w-9 h-9" />
                      ) : (
                        <span style={{ fontSize: 36, lineHeight: 1 }}>{e.emoji}</span>
                      )}
                      <span className="font-bold" style={{ fontSize: 12, color: "#3D2B1F" }}>{e.label}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: e.selectedBorder }}>
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedEmotion && (
                <button
                  onClick={() => setScreen("severity")}
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:opacity-90 transition-all duration-200 hover:scale-[1.02] animate-in slide-in-from-bottom-2 duration-300"
                >
                  Rate your level →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══ Screen 2: Severity ═══ */}
        {screen === "severity" && (
          <div className="min-h-screen flex flex-col items-center justify-center px-5">
            <div className="w-full max-w-[460px]">
              <MapleSpeechBubble
                expression="attentive"
                message={`On a scale of 1–10, how strong is this ${selectedEmotion?.toLowerCase()} feeling?`}
              />
              <div className="w-full bg-white rounded-2xl p-6 border border-border mb-5"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
                <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-3">
                  <span>Barely there</span>
                  <span>Overwhelming</span>
                </div>
                <input
                  type="range" min={1} max={10} value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer accent-primary"
                  style={{ background: "linear-gradient(to right, hsl(140, 25%, 45%) 0%, hsl(0, 45%, 40%) 100%)" }}
                />
                <div className="text-center mt-4">
                  <span className="text-4xl font-extrabold text-primary">{severity}</span>
                  <span className="text-base text-muted-foreground font-semibold"> / 10</span>
                </div>
              </div>
              <div className="w-full rounded-2xl p-5 border border-border mb-6" style={{ background: "#FFFBE6" }}>
                <p className="text-sm font-semibold text-center" style={{ color: "#3D2B1F" }}>🍄 {getSeverityTip(severity)}</p>
              </div>
              <button
                onClick={handleShowRecommendations}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                Show me what helps →
              </button>
            </div>
          </div>
        )}

        {/* ═══ Loading Screen ═══ */}
        {screen === "loading" && (
          <div className="min-h-screen flex flex-col items-center justify-center px-5">
            <div className="w-full max-w-[460px]">
              <MapleSpeechBubble
                expression="gentle"
                message="Let me think of something for you... 🍄"
                bouncing
              />
              <div className="flex justify-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-3 h-3 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-3 h-3 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ Screen 3: Recommendations ═══ */}
        {screen === "recommendations" && (
          <div className="min-h-screen flex flex-col items-center justify-center px-5">
            <div className="w-full max-w-[460px]">
              <MapleSpeechBubble expression="gentle" message={aiMessage || "Here are some things that might help 💛"} />
              <div className="w-full flex flex-col gap-3 mb-6">
                {aiRecommendations.map((r, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 flex gap-4 items-start hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                    style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}>
                    <span className="text-3xl mt-0.5">{r.icon}</span>
                    <div>
                      <h3 className="font-bold text-base" style={{ color: "#3D2B1F" }}>{r.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Escalation banner */}
              {escalate && escalateMessage && (
                <div className="w-full rounded-2xl p-5 mb-6 flex gap-3 items-start"
                  style={{ background: "#FFF0F3", border: "1px solid #F5C6D0" }}>
                  <Heart className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#E05C7A" }} fill="#E05C7A" />
                  <p className="text-sm font-semibold" style={{ color: "#8B3A4A" }}>
                    {escalateMessage}
                  </p>
                </div>
              )}

              <button
                onClick={() => { setXp((x) => x + 10); setScreen("done"); }}
                className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold text-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                I tried something ✓
              </button>
            </div>
          </div>
        )}

        {/* ═══ Screen 4: Done ═══ */}
        {screen === "done" && (
          <div className="min-h-screen flex flex-col items-center justify-center px-5">
            <div className="w-full max-w-[460px]">
              <MapleSpeechBubble expression="happy" message="You did amazing! I'm so proud of you! 🌟" />
              <div className="w-full bg-white rounded-2xl p-8 mb-5 text-center"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
                <p className="text-3xl font-extrabold text-accent">+10 XP earned! 🎉</p>
                <div className="mt-5 w-full bg-muted rounded-full h-5 overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: `${Math.min((xp % 100) + 10, 100)}%` }} />
                </div>
                <p className="text-sm text-muted-foreground mt-3 font-semibold">{xp} / 100 XP to next level</p>
              </div>
              <div className="w-full rounded-2xl p-6 border border-border mb-6 text-center" style={{ background: "#FFFBE6" }}>
                <p className="text-4xl font-extrabold text-accent">🔥 {streak}</p>
                <p className="text-base font-semibold mt-1" style={{ color: "#3D2B1F" }}>Day streak!</p>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                Check in again 🍄
              </button>
            </div>
          </div>
        )}
      </div>
    </StoryBookBackground>
  );
};

export default MoodMapping;