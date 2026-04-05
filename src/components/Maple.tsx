import React from "react";

type MapleExpression = "waving" | "attentive" | "gentle" | "happy";

interface MapleProps {
  expression: MapleExpression;
  className?: string;
}

const Maple: React.FC<MapleProps> = ({ expression, className = "" }) => {
  const isHappy = expression === "happy";
  const isWaving = expression === "waving";

  // Smile path varies by expression
  const smilePath = (() => {
    switch (expression) {
      case "waving":
        return "M 44,72 Q 50,78 56,72"; // gentle smile
      case "attentive":
        return "M 45,72 Q 50,74 55,72"; // slight
      case "gentle":
        return "M 44,72 Q 50,79 56,72"; // warm
      case "happy":
        return "M 42,71 Q 50,82 58,71"; // big grin
    }
  })();

  // Eye size varies
  const eyeR = expression === "attentive" ? 3 : 2.5;

  return (
    <svg
      viewBox="0 0 100 110"
      width="120"
      height="132"
      className={className}
      aria-label="Maple the mushroom mascot"
    >
      {/* Sparkle stars for happy expression */}
      {isHappy && (
        <>
          <polygon points="20,15 22,10 24,15 29,17 24,19 22,24 20,19 15,17" fill="hsl(45, 90%, 60%)" />
          <polygon points="75,12 77,7 79,12 84,14 79,16 77,21 75,16 70,14" fill="hsl(45, 90%, 60%)" />
          <polygon points="85,30 86.5,26 88,30 92,31.5 88,33 86.5,37 85,33 81,31.5" fill="hsl(45, 90%, 65%)" />
          <polygon points="12,28 13.5,24 15,28 19,29.5 15,31 13.5,35 12,31 8,29.5" fill="hsl(45, 90%, 65%)" />
        </>
      )}

      {/* Mushroom cap */}
      <ellipse cx="50" cy="38" rx="32" ry="26" fill="hsl(0, 55%, 35%)" />

      {/* Cap spots */}
      <ellipse cx="35" cy="28" rx="5" ry="3.5" fill="hsl(35, 50%, 88%)" transform="rotate(-15 35 28)" />
      <ellipse cx="55" cy="22" rx="4.5" ry="3" fill="hsl(35, 50%, 88%)" transform="rotate(10 55 22)" />
      <ellipse cx="65" cy="35" rx="4" ry="3" fill="hsl(35, 50%, 88%)" transform="rotate(20 65 35)" />

      {/* Stem body */}
      <rect x="38" y="52" width="24" height="28" rx="10" fill="hsl(35, 40%, 90%)" />
      <rect x="40" y="52" width="20" height="28" rx="8" fill="hsl(35, 45%, 93%)" />

      {/* Arms */}
      {isWaving ? (
        <>
          {/* Left arm normal */}
          <ellipse cx="34" cy="64" rx="6" ry="4" fill="hsl(35, 40%, 90%)" />
          {/* Right arm waving (raised) */}
          <ellipse cx="66" cy="52" rx="6" ry="4" fill="hsl(35, 40%, 90%)" transform="rotate(-30 66 52)" />
        </>
      ) : (
        <>
          <ellipse cx="34" cy="64" rx="6" ry="4" fill="hsl(35, 40%, 90%)" />
          <ellipse cx="66" cy="64" rx="6" ry="4" fill="hsl(35, 40%, 90%)" />
        </>
      )}

      {/* Face */}
      {/* Eyes */}
      <circle cx="44" cy="62" r={eyeR} fill="hsl(0, 0%, 10%)" />
      <circle cx="56" cy="62" r={eyeR} fill="hsl(0, 0%, 10%)" />
      {/* Eye highlights */}
      <circle cx="45" cy="61" r="1" fill="white" />
      <circle cx="57" cy="61" r="1" fill="white" />

      {/* Blush */}
      <ellipse cx="38" cy="68" rx="4" ry="2.5" fill="hsl(0, 60%, 80%)" opacity="0.6" />
      <ellipse cx="62" cy="68" rx="4" ry="2.5" fill="hsl(0, 60%, 80%)" opacity="0.6" />

      {/* Smile */}
      <path d={smilePath} stroke="hsl(20, 30%, 25%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Feet */}
      <ellipse cx="43" cy="82" rx="6" ry="3" fill="hsl(35, 40%, 88%)" />
      <ellipse cx="57" cy="82" rx="6" ry="3" fill="hsl(35, 40%, 88%)" />
    </svg>
  );
};

export default Maple;
