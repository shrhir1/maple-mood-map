import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StoryBookBackground from "@/components/StoryBookBackground";
import { ArrowLeft } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

interface MoodEntry {
  emotion: string;
  severity: number;
  date: string;
}

const emotionColors: Record<string, string> = {
  Angry: "hsl(0, 55%, 50%)",
  Anxious: "hsl(25, 80%, 55%)",
  Tired: "hsl(235, 60%, 55%)",
  Sad: "hsl(200, 55%, 50%)",
  Happy: "hsl(45, 85%, 50%)",
};

const getMoodHistory = (): MoodEntry[] => {
  try {
    return JSON.parse(localStorage.getItem("moodHistory") || "[]");
  } catch {
    return [];
  }
};

const MoodHistory: React.FC = () => {
  const navigate = useNavigate();
  const history = getMoodHistory();

  // Group by date (YYYY-MM-DD) and count each emotion per day
  const dailyData = useMemo(() => {
    const grouped: Record<string, Record<string, number>> = {};
    for (const entry of history) {
      const day = new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!grouped[day]) grouped[day] = {};
      grouped[day][entry.emotion] = (grouped[day][entry.emotion] || 0) + 1;
    }
    return Object.entries(grouped).map(([date, emotions]) => ({
      date,
      ...emotions,
    }));
  }, [history]);

  // Timeline data: each entry as a point with severity over time
  const timelineData = useMemo(() => {
    return history.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
      }),
      severity: entry.severity,
      emotion: entry.emotion,
    }));
  }, [history]);

  const allEmotions = useMemo(() => {
    const set = new Set<string>();
    history.forEach((e) => set.add(e.emotion));
    return Array.from(set);
  }, [history]);

  const chartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    allEmotions.forEach((emotion) => {
      config[emotion] = {
        label: emotion,
        color: emotionColors[emotion] || "hsl(0, 0%, 50%)",
      };
    });
    return config;
  }, [allEmotions]);

  // Total counts per emotion
  const totalCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    history.forEach((e) => {
      counts[e.emotion] = (counts[e.emotion] || 0) + 1;
    });
    return counts;
  }, [history]);

  return (
    <StoryBookBackground>
      <div className="min-h-screen flex flex-col items-center px-4 py-6">
        {/* Header */}
        <div className="w-full max-w-lg flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/")}
            className="rounded-full p-2 transition-all hover:scale-110 active:scale-95"
            style={{
              background: "rgba(255,248,240,0.92)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            }}
          >
            <ArrowLeft size={20} style={{ color: "#3D2B1F" }} />
          </button>
          <h1
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "#3D2B1F" }}
          >
            Mood History
          </h1>
        </div>

        {history.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center max-w-md"
            style={{
              background: "rgba(255,255,255,0.85)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            }}
          >
            <p className="text-lg font-bold" style={{ color: "#3D2B1F" }}>
              No mood entries yet
            </p>
            <p className="text-sm mt-2" style={{ color: "#7A6B5D" }}>
              Start a check-in to see your mood data here!
            </p>
          </div>
        ) : (
          <div className="w-full max-w-lg space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              {allEmotions.map((emotion) => (
                <div
                  key={emotion}
                  className="rounded-xl p-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                    borderLeft: `4px solid ${emotionColors[emotion] || "#ccc"}`,
                  }}
                >
                  <p
                    className="text-2xl font-extrabold"
                    style={{ color: emotionColors[emotion] }}
                  >
                    {totalCounts[emotion]}
                  </p>
                  <p
                    className="text-xs font-bold mt-1"
                    style={{ color: "#3D2B1F" }}
                  >
                    {emotion}
                  </p>
                </div>
              ))}
            </div>

            {/* Bar chart - moods per day */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            >
              <h2
                className="text-sm font-extrabold mb-4"
                style={{ color: "#3D2B1F" }}
              >
                Moods Per Day
              </h2>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    fontSize={11}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {allEmotions.map((emotion) => (
                    <Bar
                      key={emotion}
                      dataKey={emotion}
                      stackId="a"
                      fill={emotionColors[emotion]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </div>

            {/* Line chart - severity over time */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.85)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              }}
            >
              <h2
                className="text-sm font-extrabold mb-4"
                style={{ color: "#3D2B1F" }}
              >
                Severity Over Time
              </h2>
              <ChartContainer
                config={{ severity: { label: "Severity", color: "hsl(0, 45%, 40%)" } }}
                className="h-[250px] w-full"
              >
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <YAxis
                    domain={[1, 10]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="severity"
                    stroke="hsl(0, 45%, 40%)"
                    strokeWidth={2}
                    dot={{ fill: "hsl(0, 45%, 40%)", r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        )}
      </div>
    </StoryBookBackground>
  );
};

export default MoodHistory;
