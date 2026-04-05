import React, { useState, useEffect, useRef } from "react";
import Maple from "./Maple";

type Screen = "welcome" | "severity" | "recommendations" | "done";

interface Emotion {
  label: string;
  emoji: string;
}

const emotions: Emotion[] = [
  { label: "Sad", emoji: "😢" },
  { label: "Stressed", emoji: "😤" },
  { label: "Angry", emoji: "😠" },
  { label: "Fearful", emoji: "😨" },
  { label: "Tired", emoji: "😴" },
];

const recommendations = [
  {
    icon: "📝",
    title: "Journal it out",
    description: "Write down your thoughts for 5 minutes. No rules, just let it flow.",
  },
  {
    icon: "🚶",
    title: "Take a short walk",
    description: "Even 10 minutes outside can reset your mood.",
  },
  {
    icon: "📞",
    title: "Call a friend",
    description: "Hearing a friendly voice can make a big difference.",
  },
  {
    icon: "🧘",
    title: "Try a meditation",
    description: "Close your eyes, breathe deep, and let go for a few minutes.",
  },
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
    <div className="relative bg-card rounded-2xl px-5 py-3 mt-2 shadow-sm border border-border max-w-[300px] text-center">
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-l border-t border-border rotate-45" />
      <p className="relative text-sm font-semibold text-foreground">{message}</p>
    </div>
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
    <div className="min-h-screen bg-background flex justify-center items-center">
      <div className="w-full max-w-[440px] px-6 py-10 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <h1 className="text-2xl font-extrabold text-primary mb-2 tracking-tight">
          Mood Mapping
        </h1>

        {/* Grow area to vertically center content */}
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          {/* Screen 1: Welcome */}
          {screen === "welcome" && (
            <div className="w-full flex flex-col items-center">
              {/* Maple entrance */}
              <div
                className={animStep >= 1 ? "anim-maple-enter" : ""}
                style={{ opacity: animStep >= 1 ? undefined : 0 }}
              >
                <div className="flex flex-col items-center mb-8">
                  <div className="w-32 h-32">
                    <Maple expression="waving" className="w-full h-full" />
                  </div>
                  {/* Speech bubble */}
                  <div
                    className={animStep >= 2 ? "anim-bubble-enter" : ""}
                    style={{ opacity: animStep >= 2 ? undefined : 0 }}
                  >
                    <div className="relative bg-card rounded-2xl px-6 py-4 mt-3 shadow-md border border-border max-w-[340px] text-center">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-l border-t border-border rotate-45" />
                      <p className="relative text-base font-semibold text-foreground">
                        Hey! I'm Maple 🍄 How are you feeling today?
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emotion buttons — larger, more dynamic */}
              <div className="grid grid-cols-5 gap-2 mb-8 w-full">
                {emotions.map((e, i) => (
                  <button
                    key={e.label}
                    onClick={() => setSelectedEmotion(e.label)}
                    className={`flex flex-col items-center gap-1 py-4 px-1 rounded-2xl border-2 transition-all duration-200 font-semibold text-xs ${
                      selectedEmotion === e.label
                        ? "border-primary bg-warm-red-light scale-110 shadow-lg ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:scale-105 hover:shadow-md"
                    } ${animStep >= 3 ? "anim-ui-fade-up" : ""}`}
                    style={{
                      opacity: animStep >= 3 ? undefined : 0,
                      animationDelay: animStep >= 3 ? `${i * 100}ms` : undefined,
                      animationFillMode: "forwards",
                    }}
                  >
                    <span className="text-3xl">{e.emoji}</span>
                    <span className="text-foreground text-xs font-bold mt-1">{e.label}</span>
                  </button>
                ))}
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

          {/* Screen 2: Severity */}
          {screen === "severity" && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
              <MapleSpeechBubble
                expression="attentive"
                message={`On a scale of 1–10, how strong is this ${selectedEmotion?.toLowerCase()} feeling?`}
              />

              <div className="w-full bg-card rounded-2xl p-6 border border-border shadow-md mb-5">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-3">
                  <span>Barely there</span>
                  <span>Overwhelming</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, hsl(140, 25%, 45%) 0%, hsl(0, 45%, 40%) 100%)`,
                  }}
                />
                <div className="text-center mt-4">
                  <span className="text-4xl font-extrabold text-primary">{severity}</span>
                  <span className="text-base text-muted-foreground font-semibold"> / 10</span>
                </div>
              </div>

              <div className="w-full bg-warm-amber-light rounded-2xl p-5 border border-border mb-6">
                <p className="text-sm text-foreground font-semibold text-center">
                  🍄 {getSeverityTip(severity)}
                </p>
              </div>

              <button
                onClick={() => setScreen("recommendations")}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                Show me what helps →
              </button>
            </div>
          )}

          {/* Screen 3: Recommendations */}
          {screen === "recommendations" && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
              <MapleSpeechBubble
                expression="gentle"
                message="Here are some things that might help 💛"
              />

              <div className="w-full flex flex-col gap-3 mb-6">
                {recommendations.map((r, i) => (
                  <div
                    key={i}
                    className="bg-card rounded-2xl p-5 border border-border shadow-sm flex gap-4 items-start hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-3xl mt-0.5">{r.icon}</span>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{r.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setXp((x) => x + 10);
                  setScreen("done");
                }}
                className="w-full py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold text-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
              >
                I tried something ✓
              </button>
            </div>
          )}

          {/* Screen 4: Done */}
          {screen === "done" && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
              <MapleSpeechBubble
                expression="happy"
                message="You did amazing! I'm so proud of you! 🌟"
              />

              <div className="w-full bg-card rounded-2xl p-8 border border-border shadow-md mb-5 text-center">
                <p className="text-3xl font-extrabold text-accent">+10 XP earned! 🎉</p>
                <div className="mt-5 w-full bg-muted rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((xp % 100) + 10, 100)}%` }}
                  />
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
    </div>
  );
};

export default MoodMapping;
