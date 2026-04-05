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
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[390px] px-5 py-8 flex flex-col items-center">
        {/* Header */}
        <h1 className="text-xl font-extrabold text-primary mb-6 tracking-tight">
          Mood Mapping
        </h1>

        {/* Screen 1: Welcome */}
        {screen === "welcome" && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            <MapleSpeechBubble
              expression="waving"
              message="Hey! I'm Maple 🍄 How are you feeling today?"
            />

            <div className="flex justify-center gap-1.5 mb-6 w-full">
              {emotions.map((e) => (
                <button
                  key={e.label}
                  onClick={() => setSelectedEmotion(e.label)}
                  className={`flex flex-col items-center gap-0.5 px-2.5 py-2.5 rounded-2xl border-2 transition-all duration-200 font-semibold text-xs flex-1 min-w-0 ${
                    selectedEmotion === e.label
                      ? "border-primary bg-warm-red-light scale-105 shadow-md"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <span className="text-xl">{e.emoji}</span>
                  <span className="text-foreground truncate">{e.label}</span>
                </button>
              ))}
            </div>

            {selectedEmotion && (
              <button
                onClick={() => setScreen("severity")}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-md hover:opacity-90 transition-opacity animate-in slide-in-from-bottom-2 duration-300"
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

            <div className="w-full bg-card rounded-2xl p-6 border border-border shadow-sm mb-4">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2">
                <span>Barely there</span>
                <span>Overwhelming</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
                style={{
                  background: `linear-gradient(to right, hsl(140, 25%, 45%) 0%, hsl(0, 45%, 40%) 100%)`,
                }}
              />
              <div className="text-center mt-3">
                <span className="text-3xl font-extrabold text-primary">{severity}</span>
                <span className="text-sm text-muted-foreground font-semibold"> / 10</span>
              </div>
            </div>

            <div className="w-full bg-warm-amber-light rounded-2xl p-4 border border-border mb-6">
              <p className="text-sm text-foreground font-semibold text-center">
                🍄 {getSeverityTip(severity)}
              </p>
            </div>

            <button
              onClick={() => setScreen("recommendations")}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-md hover:opacity-90 transition-opacity"
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
                  className="bg-card rounded-2xl p-4 border border-border shadow-sm flex gap-3 items-start hover:shadow-md transition-shadow"
                >
                  <span className="text-2xl mt-0.5">{r.icon}</span>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{r.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setXp((x) => x + 10);
                setScreen("done");
              }}
              className="w-full py-3 rounded-2xl bg-secondary text-secondary-foreground font-bold text-base shadow-md hover:opacity-90 transition-opacity"
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

            <div className="w-full bg-card rounded-2xl p-6 border border-border shadow-sm mb-4 text-center">
              <p className="text-2xl font-extrabold text-accent">+10 XP earned! 🎉</p>
              <div className="mt-4 w-full bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((xp % 100) + 10, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-semibold">{xp} / 100 XP to next level</p>
            </div>

            <div className="w-full bg-warm-amber-light rounded-2xl p-4 border border-border mb-6 text-center">
              <p className="text-3xl font-extrabold text-accent">🔥 {streak}</p>
              <p className="text-sm font-semibold text-foreground">Day streak!</p>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-md hover:opacity-90 transition-opacity"
            >
              Check in again 🍄
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodMapping;
