import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Maple from "@/components/Maple";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1000);
    const t3 = setTimeout(() => setStep(3), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(180deg, #FFE8D6 0%, #FFF5EC 45%, hsl(30, 50%, 96%) 100%)",
      }}
    >
      {/* Pastel blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -right-16 w-[220px] h-[200px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #F2C4C4 0%, transparent 70%)" }} />
        <div className="absolute top-[15%] -left-12 w-[200px] h-[180px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #FDE68A 0%, transparent 70%)" }} />
        <div className="absolute top-[45%] -right-8 w-[180px] h-[180px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #A7F3D0 0%, transparent 70%)" }} />
      </div>

      {/* Sparkles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
        <polygon points="80,60 82,54 84,60 90,62 84,64 82,70 80,64 74,62" fill="#F5C842" opacity="0.6" />
        <polygon points="320,90 322,84 324,90 330,92 324,94 322,100 320,94 314,92" fill="#F5C842" opacity="0.5" />
        <g opacity="0.2">
          <ellipse cx="90" cy="100" rx="28" ry="10" fill="white" />
          <ellipse cx="80" cy="98" rx="16" ry="8" fill="white" />
          <ellipse cx="104" cy="97" rx="14" ry="7" fill="white" />
        </g>
        <g opacity="0.15">
          <ellipse cx="340" cy="70" rx="24" ry="8" fill="white" />
          <ellipse cx="330" cy="68" rx="14" ry="7" fill="white" />
          <ellipse cx="356" cy="67" rx="12" ry="6" fill="white" />
        </g>
      </svg>

      {/* Rolling hills – animated */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none overflow-hidden">
        <svg viewBox="0 0 800 100" preserveAspectRatio="none" className="w-full h-[28vh]">
          <style>{`
            @keyframes landingRoll1 { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-20px); } }
            @keyframes landingRoll2 { 0%,100% { transform: translateX(0); } 50% { transform: translateX(25px); } }
            @keyframes landingRoll3 { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-12px); } }
          `}</style>
          <ellipse cx="400" cy="95" rx="520" ry="55" fill="hsl(130, 35%, 78%)" opacity="0.55"
            style={{ animation: "landingRoll1 6s ease-in-out infinite" }} />
          <ellipse cx="620" cy="100" rx="400" ry="45" fill="hsl(130, 30%, 68%)" opacity="0.5"
            style={{ animation: "landingRoll2 8s ease-in-out infinite" }} />
          <ellipse cx="180" cy="100" rx="440" ry="40" fill="hsl(130, 30%, 68%)" opacity="0.45"
            style={{ animation: "landingRoll3 10s ease-in-out infinite" }} />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Maple mascot */}
        <div
          className={step >= 1 ? "anim-maple-enter" : ""}
          style={{ opacity: step >= 1 ? undefined : 0 }}
        >
          <div className="anim-maple-float" style={{ width: 160, height: 160 }}>
            <Maple expression="waving" className="w-full h-full drop-shadow-lg" />
          </div>
        </div>

        {/* Title */}
        <div
          className={step >= 2 ? "anim-bubble-enter" : ""}
          style={{ opacity: step >= 2 ? undefined : 0 }}
        >
          <h1
            className="text-4xl sm:text-5xl font-black tracking-tight text-center"
            style={{ color: "#3D2B1F" }}
          >
            Mood Mapping
          </h1>
          <p className="text-base sm:text-lg font-semibold text-center mt-2" style={{ color: "#8B6F5E" }}>
            Check in with yourself. Grow with Maple. 🍄
          </p>
        </div>

        {/* CTA */}
        <div
          className={step >= 3 ? "anim-ui-fade-up" : ""}
          style={{ opacity: step >= 3 ? undefined : 0 }}
        >
          <button
            onClick={() => navigate("/auth")}
            className="px-10 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
          >
            Get Started →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
