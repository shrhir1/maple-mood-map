import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Maple from "./Maple";
import StoryBookBackground from "./StoryBookBackground";
import { Check, Heart, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { getMapleResponse } from "@/lib/claude";
import HappyFace from "./icons/HappyFace";
import SadFace from "./icons/SadFace";
import AnxiousFace from "./icons/AnxiousFace";
import AngryFaceBalloon from "./icons/AngryFaceBalloon";
import TiredFace from "./icons/TiredFace";


type Screen = "welcome" | "severity" | "loading" | "recommendations" | "done";

interface Emotion {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  selectedBg: string;
  selectedBorder: string;
}

interface AIRecommendation {
  icon: string;
  title: string;
  description: string;
}

interface MoodEntry {
  emotion: string;
  severity: number;
  date: string;
}

const emotionEmojis: Record<string, string> = {
  Happy: "😊", Sad: "😢", Anxious: "😰", Angry: "😠", Tired: "😴",
};

const emotionIcons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Angry: AngryFaceBalloon,
  Anxious: AnxiousFace,
  Tired: TiredFace,
  Sad: SadFace,
  Happy: HappyFace,
};

const getMoodHistory = (): MoodEntry[] => {
  try {
    return JSON.parse(localStorage.getItem("moodHistory") || "[]");
  } catch { return []; }
};

const saveMoodEntry = (emotion: string, severity: number): MoodEntry[] => {
  const history = getMoodHistory();
  history.push({ emotion, severity, date: new Date().toISOString() });
  localStorage.setItem("moodHistory", JSON.stringify(history));
  return history;
};

const getRecurringWarning = (history: MoodEntry[]): string | null => {
  const last7 = history.slice(-7);
  const counts: Record<string, number> = {};
  for (const e of last7) {
    if (e.emotion !== "Happy" && e.severity >= 6) {
      counts[e.emotion] = (counts[e.emotion] || 0) + 1;
    }
  }
  for (const [emotion, count] of Object.entries(counts)) {
    if (count >= 3) return emotion;
  }
  return null;
};

const emotions: Emotion[] = [
  { label: "Angry", icon: AngryFaceBalloon, selectedBg: "#FFEDED", selectedBorder: "#E05C5C" },
  { label: "Anxious", icon: AnxiousFace, selectedBg: "#FFF3E6", selectedBorder: "#F69553" },
  { label: "Tired", icon: TiredFace, selectedBg: "#EEF2FF", selectedBorder: "#6366F1" },
  { label: "Sad", icon: SadFace, selectedBg: "#E8F4FD", selectedBorder: "#5BA4CF" },
  { label: "Happy", icon: HappyFace, selectedBg: "#FFFBE6", selectedBorder: "#F4C430" },
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
const BrandBadge: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="inline-flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center justify-center rounded-full p-3 backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
            style={{ background: "rgba(255,248,240,0.92)", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", color: "#3D2B1F" }}>
            <Menu size={22} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem className="cursor-pointer font-medium" onClick={() => navigate("/mood-history")}>Mood History</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer font-medium">Find Services</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer font-medium">Account Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button className="inline-flex items-center rounded-full px-7 py-3 backdrop-blur-sm text-lg font-extrabold tracking-tight transition-all hover:scale-105 active:scale-95"
        style={{ background: "rgba(255,248,240,0.92)", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", color: "#3D2B1F" }}>
        Mood Mapping
      </button>
    </div>
  );
};

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
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(getMoodHistory());
  const [recurringEmotion, setRecurringEmotion] = useState<string | null>(null);

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
    const currentEmotion = selectedEmotion;
    const currentSeverity = severity;
    console.log(`[MoodMapping] Calling getMapleResponse with emotion="${currentEmotion}", severity=${currentSeverity}`);
    setScreen("loading");
    try {
      const result = await getMapleResponse(currentEmotion, currentSeverity);
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
                  <div className="absolute -top-2 left-6 w-5 h-5 bg-white rotate-45" style={{ boxShadow: "-2px -2px 4px rgba(0,0,0,0.04)" }} />
                  <p className="relative font-bold leading-snug" style={{ color: "#3D2B1F", fontSize: 20 }}>
                    Hi, I'm Maple the Mushroom!
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
                      <e.icon className="w-16 h-16" />
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
                <p className="text-xs text-center mt-2 font-mono text-muted-foreground">Current severity: {severity}</p>
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

              {/* Escalation support card for severity 8+ */}
              {severity >= 8 && (
                <div className="w-full rounded-2xl p-5 mb-5 flex flex-col gap-3"
                  style={{ background: "#FFF0F3", border: "1px solid #F5C6D0" }}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">🌿</span>
                    <p className="text-sm font-semibold" style={{ color: "#5C4A1E" }}>
                      It sounds like you're going through something really hard. Maple wants to help you find real support.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(
                        `Hi Maple, I've been feeling ${selectedEmotion?.toLowerCase() || "unknown"} at a severity of ${severity} out of 10. Can you help me find real mental health resources and therapists near San Diego that I can contact? I need support.`
                      );
                      window.open(`https://asi1.ai/ai/maplemoodmonitor?message=${msg}`, "_blank", "noopener,noreferrer");
                    }}
                    className="w-full py-3 rounded-xl text-white font-bold text-base hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                    style={{ background: "#6B2737" }}
                  >
                    Find support with Maple 🍄
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setXp((x) => x + 10);
                  if (selectedEmotion) {
                    const updated = saveMoodEntry(selectedEmotion, severity);
                    setMoodHistory(updated);
                    setRecurringEmotion(getRecurringWarning(updated));
                  }
                  setScreen("done");
                }}
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


              {/* Mood History pills */}
              {moodHistory.length > 0 && (
                <div className="w-full rounded-2xl p-5 border border-border mb-5 bg-white"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                  <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">Mood History</p>
                  <div className="flex gap-2 flex-wrap">
                    {moodHistory.slice(-3).reverse().map((entry, i) => {
                      const IconComp = emotionIcons[entry.emotion];
                      return (
                        <div key={i} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
                          style={{ background: "#F5F3FF", color: "#3D2B1F" }}>
                          {IconComp ? <IconComp className="w-6 h-6" /> : <span>{emotionEmojis[entry.emotion] || "🫠"}</span>}
                          <span>{entry.severity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recurring emotion warning */}
              {recurringEmotion && (
                <div className="w-full rounded-2xl p-5 mb-5 flex gap-3 items-start"
                  style={{ background: "#FFFBE6", border: "1px solid #F4E3A0" }}>
                  <span className="text-xl flex-shrink-0">🌿</span>
                  <p className="text-sm font-semibold" style={{ color: "#5C4A1E" }}>
                    I've noticed you've been feeling {recurringEmotion.toLowerCase()} a lot lately. It might help to talk to someone you trust.
                  </p>
                </div>
              )}

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