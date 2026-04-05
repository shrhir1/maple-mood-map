import React, { useState, useEffect, useRef } from "react";
import Maple from "./Maple";
import StoryBookBackground from "./StoryBookBackground";
import { Check } from "lucide-react";

type Screen = "welcome" | "severity" | "recommendations" | "done";

interface Emotion {
  label: string;
  emoji: string;
  tint: string;
}

const emotions: Emotion[] = [
  { label: "Sad", emoji: "😢", tint: "bg-blue-50" },
  { label: "Stressed", emoji: "😤", tint: "bg-orange-50" },
  { label: "Angry", emoji: "😠", tint: "bg-red-50" },
  { label: "Fearful", emoji: "😨", tint: "bg-purple-50" },
  { label: "Tired", emoji: "😴", tint: "bg-slate-50" },
];

const recommendations = [
  { icon: "📝", title: "Journal it out", description: "Write down your thoughts for 5 minutes. No rules, just let it flow." },
  { icon: "🚶", title: "Take a short walk", description: "Even 10 minutes outside can reset your mood." },
  { icon: "📞", title: "Call a friend", description: "Hearing a friendly voice can make a big difference." },
  { icon: "🧘", title: "Try a meditation", description: "Close your eyes, breathe deep, and let go for a few minutes." },
];

const getSeverityTip = (value: number): string => {
  if (value <= 2) return "That's manageable! A small break might be all you need. 🌿";
  if (value <= 4) return "You're noticing it — that's self-awareness! Let's find something gentle. 🌱";
  if (value <= 6) return "It's okay to feel this strongly. You're doing great by checking in. 💛";
  if (value <= 8) return "That sounds tough. Let's find something that really helps. 🤗";
  return "I hear you. You're not alone in this. Let's take it one step at a time. 💕";
};

const MapleSpeechBubble: React.FC<{ message: string; expression: "waving" | "attentive" | "gentle" | "happy" }> = ({
  message,
  expression,
}) => (
  <div className="flex flex-col items-center mb-6">
    <Maple expression={expression} />
    <div className="relative bg-warm-cream rounded-2xl px-5 py-3 mt-2 shadow-sm border border-border max-w-[300px] text-center">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-warm-cream border-l border-t border-border rotate-45" />
      <p className="relative text-sm font-semibold text-foreground">{message}</p>
    </div>
  </div>
);

/* ─── Brand badge ─── */
const BrandBadge: React.FC = () => (
  <div className="flex items-center gap-2 bg-warm-cream/80 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-border">
    <svg viewBox="0 0 100 120" width="18" height="22">
      <rect x="30" y="48" width="40" height="52" rx="18" fill="hsl(40, 45%, 94%)" />
      <ellipse cx="50" cy="38" rx="38" ry="26" fill="hsl(345, 55%, 35%)" />
      <ellipse cx="50" cy="44" rx="36" ry="5" fill="hsl(345, 50%, 27%)" />
      <ellipse cx="34" cy="28" rx="6" ry="4" fill="hsl(35, 30%, 68%)" transform="rotate(-10 34 28)" />
      <ellipse cx="60" cy="22" rx="5.5" ry="3.5" fill="hsl(35, 30%, 68%)" transform="rotate(8 60 22)" />
    </svg>
    <span className="text-xs font-extrabold text-foreground tracking-tight">Mood Mapping</span>
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

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const t1 = setTimeout(() => setAnimStep(1), 300);
    const t2 = setTimeout(() => setAnimStep(2), 800);
    const t3 = setTimeout(() => setAnimStep(3), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleReset = () => {
    setScreen("welcome");
    setSelectedEmotion(null);
    setSeverity(5);
    setStreak((s) => s + 1);
  };

  return (
    <StoryBookBackground>
      <div className="min-h-screen flex flex-col items-center">
        {/* Brand badge - top left, compact */}
        <div className="w-full max-w-[460px] px-5 pt-3 self-start">
          <div className="inline-block">
            <BrandBadge />
          </div>
        </div>

        {/* Main content */}
        <div className="w-full max-w-[460px] px-5 flex-1 flex flex-col items-center justify-center">

          {/* ═══ Screen 1: Welcome ═══ */}
          {screen === "welcome" && (
            <div className="w-full flex-1 flex flex-col items-center justify-between py-2 pb-6">
              {/* Maple — large with glow */}
              <div
                className={animStep >= 1 ? "anim-maple-enter" : ""}
                style={{ opacity: animStep >= 1 ? undefined : 0 }}
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {/* Warm glow behind Maple */}
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{
                      background: "radial-gradient(circle, hsl(35, 70%, 85%) 0%, transparent 70%)",
                      transform: "scale(1.6)",
                    }} />
                    <div className="relative w-40 h-48">
                      <Maple expression="waving" className="w-full h-full drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Speech bubble — warm cream card */}
              <div
                className={animStep >= 2 ? "anim-bubble-enter" : ""}
                style={{ opacity: animStep >= 2 ? undefined : 0 }}
              >
                <div className="relative bg-warm-cream rounded-3xl px-7 py-5 mt-3 shadow-md border border-border max-w-[360px] text-center">
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-warm-cream border-l border-t border-border rotate-45 rounded-tl-sm" />
                  <p className="relative text-lg font-bold text-foreground leading-snug">
                    Hey! I'm Maple 🍄<br/>
                    <span className="text-base font-semibold text-muted-foreground">How are you feeling today?</span>
                  </p>
                </div>
              </div>

              {/* Emotion buttons — warm rounded cards */}
              <div className="grid grid-cols-5 gap-2.5 mt-7 mb-5 w-full">
                {emotions.map((e, i) => {
                  const isSelected = selectedEmotion === e.label;
                  return (
                    <button
                      key={e.label}
                      onClick={() => setSelectedEmotion(e.label)}
                      className={`flex flex-col items-center gap-1.5 py-4 px-1 rounded-[20px] border-2 transition-all duration-200 font-semibold
                        ${isSelected
                          ? `border-primary ${e.tint} shadow-lg ring-2 ring-primary/20 scale-105`
                          : "border-border bg-warm-cream shadow-sm hover:border-primary/30 hover:shadow-md hover:scale-[1.03]"
                        }
                        ${animStep >= 3 ? "anim-ui-fade-up" : ""}`}
                      style={{
                        opacity: animStep >= 3 ? undefined : 0,
                        animationDelay: animStep >= 3 ? `${i * 100}ms` : undefined,
                        animationFillMode: "forwards",
                      }}
                    >
                      <span className="text-[40px] leading-none">{e.emoji}</span>
                      <span className="text-foreground text-[11px] font-bold mt-0.5">{e.label}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />
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
          )}

          {/* ═══ Screen 2: Severity ═══ */}
          {screen === "severity" && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
              <MapleSpeechBubble
                expression="attentive"
                message={`On a scale of 1–10, how strong is this ${selectedEmotion?.toLowerCase()} feeling?`}
              />
              <div className="w-full bg-warm-cream rounded-2xl p-6 border border-border shadow-md mb-5">
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
              <div className="w-full bg-warm-amber-light rounded-2xl p-5 border border-border mb-6">
                <p className="text-sm text-foreground font-semibold text-center">🍄 {getSeverityTip(severity)}</p>
              </div>
              <button
                onClick={() => setScreen("recommendations")}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                Show me what helps →
              </button>
            </div>
          )}

          {/* ═══ Screen 3: Recommendations ═══ */}
          {screen === "recommendations" && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
              <MapleSpeechBubble expression="gentle" message="Here are some things that might help 💛" />
              <div className="w-full flex flex-col gap-3 mb-6">
                {recommendations.map((r, i) => (
                  <div key={i} className="bg-warm-cream rounded-2xl p-5 border border-border shadow-sm flex gap-4 items-start hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer">
                    <span className="text-3xl mt-0.5">{r.icon}</span>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{r.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setXp((x) => x + 10); setScreen("done"); }}
                className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold text-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                I tried something ✓
              </button>
            </div>
          )}

          {/* ═══ Screen 4: Done ═══ */}
          {screen === "done" && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
              <MapleSpeechBubble expression="happy" message="You did amazing! I'm so proud of you! 🌟" />
              <div className="w-full bg-warm-cream rounded-2xl p-8 border border-border shadow-md mb-5 text-center">
                <p className="text-3xl font-extrabold text-accent">+10 XP earned! 🎉</p>
                <div className="mt-5 w-full bg-muted rounded-full h-5 overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: `${Math.min((xp % 100) + 10, 100)}%` }} />
                </div>
                <p className="text-sm text-muted-foreground mt-3 font-semibold">{xp} / 100 XP to next level</p>
              </div>
              <div className="w-full bg-warm-amber-light rounded-2xl p-6 border border-border mb-6 text-center">
                <p className="text-4xl font-extrabold text-accent">🔥 {streak}</p>
                <p className="text-base font-semibold text-foreground mt-1">Day streak!</p>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                Check in again 🍄
              </button>
            </div>
          )}
        </div>
      </div>
    </StoryBookBackground>
  );
};

export default MoodMapping;
