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
        return "M 43,88 Q 50,94 57,88";
      case "attentive":
        return "M 44,88 Q 50,92 56,88";
      case "gentle":
        return "M 43,88 Q 50,95 57,88";
      case "happy":
        return "M 41,87 Q 50,98 59,87";
    }
  })();

  const eyeR = expression === "attentive" ? 2.8 : 2.5;

  return (
    <svg
      viewBox="0 0 100 120"
      width="130"
      height="156"
      className={className}
      aria-label="Maple the mushroom mascot"
    >
      {/* Sparkles for happy */}
      {isHappy && (
        <>
          <polygon points="15,10 17,4 19,10 25,12 19,14 17,20 15,14 9,12" fill="hsl(45, 90%, 60%)" />
          <polygon points="82,6 84,0 86,6 92,8 86,10 84,16 82,10 76,8" fill="hsl(45, 90%, 60%)" />
          <polygon points="90,24 91.5,20 93,24 97,25.5 93,27 91.5,31 90,27 86,25.5" fill="hsl(45, 90%, 65%)" />
          <polygon points="7,22 8.5,18 10,22 14,23.5 10,25 8.5,29 7,25 3,23.5" fill="hsl(45, 90%, 65%)" />
        </>
      )}

      {/* === BODY (stem) - tall chubby rounded rect, drawn first so cap overlaps top === */}
      <rect x="30" y="48" width="40" height="52" rx="18" fill="hsl(40, 45%, 94%)" />
      <rect x="34" y="50" width="32" height="48" rx="14" fill="hsl(40, 50%, 97%)" />

      {/* === ARMS - round stubby blobs on sides of body === */}
      {isWaving ? (
        <>
          <circle cx="26" cy="74" r="9" fill="hsl(40, 42%, 93%)" />
          <circle cx="74" cy="58" r="9" fill="hsl(40, 42%, 93%)" />
        </>
      ) : (
        <>
          <circle cx="26" cy="74" r="9" fill="hsl(40, 42%, 93%)" />
          <circle cx="74" cy="74" r="9" fill="hsl(40, 42%, 93%)" />
        </>
      )}

      {/* === CAP - wide dome sitting on top of body === */}
      <ellipse cx="50" cy="38" rx="38" ry="26" fill="hsl(345, 58%, 30%)" />
      <ellipse cx="50" cy="34" rx="34" ry="20" fill="hsl(345, 55%, 35%)" />
      {/* Cap rim */}
      <ellipse cx="50" cy="44" rx="36" ry="5" fill="hsl(345, 50%, 27%)" />

      {/* Cap spots */}
      <ellipse cx="34" cy="28" rx="6" ry="4" fill="hsl(35, 30%, 68%)" transform="rotate(-10 34 28)" />
      <ellipse cx="60" cy="22" rx="5.5" ry="3.5" fill="hsl(35, 30%, 68%)" transform="rotate(8 60 22)" />
      <ellipse cx="70" cy="36" rx="5" ry="3.5" fill="hsl(35, 30%, 68%)" transform="rotate(15 70 36)" />

      {/* === FACE - on the body below the cap === */}
      {/* Eyes */}
      <circle cx="43" cy="72" r={eyeR} fill="hsl(0, 0%, 8%)" />
      <circle cx="57" cy="72" r={eyeR} fill="hsl(0, 0%, 8%)" />
      {/* Eye highlights */}
      <circle cx="44" cy="71" r="1" fill="white" />
      <circle cx="58" cy="71" r="1" fill="white" />

      {/* Blush */}
      <circle cx="37" cy="82" r="4.5" fill="hsl(0, 55%, 80%)" opacity="0.5" />
      <circle cx="63" cy="82" r="4.5" fill="hsl(0, 55%, 80%)" opacity="0.5" />

      {/* Smile */}
      <path d={smilePath} stroke="hsl(20, 25%, 20%)" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Feet */}
      <ellipse cx="42" cy="100" rx="8" ry="4" fill="hsl(35, 30%, 88%)" />
      <ellipse cx="58" cy="100" rx="8" ry="4" fill="hsl(35, 30%, 88%)" />
    </svg>
  );
};

export default Maple;
