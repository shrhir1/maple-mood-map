import React from "react";
import { useNavigate } from "react-router-dom";
import StoryBookBackground from "@/components/StoryBookBackground";
import { ArrowLeft } from "lucide-react";

const resources = [
  {
    icon: "🧠",
    name: "UCSD Counseling & Psychological Services",
    description: "Free same-day counseling for UCSD students.",
    url: "https://caps.ucsd.edu",
  },
  {
    icon: "📞",
    name: "211 San Diego",
    description: "Free 24/7 crisis support line. Call or chat anytime.",
    url: "https://211sandiego.org",
  },
  {
    icon: "💚",
    name: "NAMI San Diego",
    description: "Free peer support groups and mental health programs across San Diego.",
    url: "https://namisandiego.org",
  },
];

const FindServices: React.FC = () => {
  const navigate = useNavigate();

  return (
    <StoryBookBackground>
      <div className="min-h-screen flex flex-col px-4 py-6">
        <button
          onClick={() => navigate("/mood")}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 backdrop-blur-sm font-semibold text-sm transition-all hover:scale-105 active:scale-95 self-start mb-8"
          style={{ background: "rgba(255,248,240,0.92)", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", color: "#3D2B1F" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex-1 flex flex-col items-center">
          <div className="text-5xl mb-3">🍄</div>
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#3D2B1F" }}>
            Real Support Near You 💛
          </h1>
          <p className="text-sm font-medium text-muted-foreground mb-8">
            You deserve help — these resources are free and available now.
          </p>

          <div className="w-full max-w-[460px] flex flex-col gap-4 mb-8">
            {resources.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 flex gap-4 items-start"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
              >
                <span className="text-3xl mt-0.5">{r.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-base" style={{ color: "#3D2B1F" }}>{r.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 px-5 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:scale-[1.02]"
                    style={{ background: "#6B2737", color: "#FFFFFF" }}
                  >
                    Visit
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center max-w-[340px]">
            If you are in immediate danger, please call <strong>988</strong> or <strong>911</strong>.
          </p>
        </div>
      </div>
    </StoryBookBackground>
  );
};

export default FindServices;
