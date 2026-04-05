import React from "react";

type MapleExpression = "waving" | "attentive" | "gentle" | "happy";

interface MapleProps {
  expression: MapleExpression;
  className?: string;
}

const Maple: React.FC<MapleProps> = ({ expression, className = "" }) => {
  const isHappy = expression === "happy";
  const isWaving = expression === "waving";

  const smilePath = (() => {
    switch (expression) {
      case "waving":
        return "M 42,75 Q 50,82 58,75";
      case "attentive":
        return "M 43,75 Q 50,79 57,75";
      case "gentle":
        return "M 42,75 Q 50,83 58,75";
      case "happy":
        return "M 40,74 Q 50,86 60,74";
    }
  })();

  const eyeR = expression === "attentive" ? 3.5 : 3;

  return (
    <svg
      viewBox="0 0 120 120"
      width="130"
      height="130"
      className={className}
      aria-label="Maple the mushroom mascot"
    >
      {/* Sparkles for happy */}
      {isHappy && (
        <>
          <polygon points="18,12 20,6 22,12 28,14 22,16 20,22 18,16 12,14" fill="hsl(45, 90%, 60%)" />
          <polygon points="98,8 100,2 102,8 108,10 102,12 100,18 98,12 92,10" fill="hsl(45, 90%, 60%)" />
          <polygon points="105,28 106.5,24 108,28 112,29.5 108,31 106.5,35 105,31 101,29.5" fill="hsl(45, 90%, 65%)" />
          <polygon points="10,26 11.5,22 13,26 17,27.5 13,29 11.5,33 10,29 6,27.5" fill="hsl(45, 90%, 65%)" />
        </>
      )}

      {/* Mushroom cap - wide flat dome like the plush */}
      <ellipse cx="60" cy="34" rx="42" ry="24" fill="hsl(345, 60%, 30%)" />
      {/* Cap highlight for dimension */}
      <ellipse cx="60" cy="30" rx="38" ry="19" fill="hsl(345, 55%, 35%)" />
      {/* Cap rim / underside ruffle */}
      <ellipse cx="60" cy="40" rx="40" ry="6" fill="hsl(345, 50%, 28%)" />

      {/* Cap spots - tan/khaki like the plush */}
      <ellipse cx="38" cy="26" rx="6" ry="4.5" fill="hsl(35, 30%, 65%)" transform="rotate(-10 38 26)" />
      <ellipse cx="72" cy="24" rx="6.5" ry="4" fill="hsl(35, 30%, 65%)" transform="rotate(12 72 24)" />
      <ellipse cx="55" cy="18" rx="5" ry="3.5" fill="hsl(35, 30%, 65%)" transform="rotate(-5 55 18)" />

      {/* Stem body - chubby round like the plush */}
      <rect x="40" y="44" width="40" height="34" rx="16" fill="hsl(40, 40%, 95%)" />
      {/* Slight inner highlight */}
      <rect x="44" y="46" width="32" height="30" rx="13" fill="hsl(40, 50%, 97%)" />

      {/* Arms - round ball hands like the plush */}
      {isWaving ? (
        <>
          <circle cx="36" cy="68" r="8" fill="hsl(40, 40%, 94%)" />
          <circle cx="84" cy="52" r="8" fill="hsl(40, 40%, 94%)" />
        </>
      ) : (
        <>
          <circle cx="36" cy="68" r="8" fill="hsl(40, 40%, 94%)" />
          <circle cx="84" cy="68" r="8" fill="hsl(40, 40%, 94%)" />
        </>
      )}

      {/* Eyes - big round black with white highlights like the plush */}
      <circle cx="51" cy="62" r={eyeR} fill="hsl(0, 0%, 8%)" />
      <circle cx="69" cy="62" r={eyeR} fill="hsl(0, 0%, 8%)" />
      <circle cx="52.2" cy="60.5" r="1.2" fill="white" />
      <circle cx="70.2" cy="60.5" r="1.2" fill="white" />

      {/* Blush - pink circles like the plush */}
      <circle cx="43" cy="70" r="4.5" fill="hsl(0, 55%, 78%)" opacity="0.55" />
      <circle cx="77" cy="70" r="4.5" fill="hsl(0, 55%, 78%)" opacity="0.55" />

      {/* Smile */}
      <path d={smilePath} stroke="hsl(20, 25%, 20%)" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Feet - small round bumps */}
      <ellipse cx="50" cy="80" rx="7" ry="4" fill="hsl(35, 30%, 88%)" />
      <ellipse cx="70" cy="80" rx="7" ry="4" fill="hsl(35, 30%, 88%)" />
    </svg>
  );
};

export default Maple;
