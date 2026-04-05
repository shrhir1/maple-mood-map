import React from "react";

const StoryBookBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-screen w-full overflow-hidden bg-background">
    {/* Soft radial glow behind center */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(35, 60%, 95%) 0%, transparent 70%)"
    }} />

    {/* Floating sparkles */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      {/* Stars */}
      <polygon points="80,60 82,54 84,60 90,62 84,64 82,70 80,64 74,62" fill="hsl(45, 80%, 75%)" opacity="0.5" />
      <polygon points="320,90 322,84 324,90 330,92 324,94 322,100 320,94 314,92" fill="hsl(45, 80%, 70%)" opacity="0.4" />
      <polygon points="60,300 61.5,296 63,300 67,301.5 63,303 61.5,307 60,303 56,301.5" fill="hsl(45, 80%, 75%)" opacity="0.35" />

      {/* Small clouds */}
      <g opacity="0.25">
        <ellipse cx="90" cy="120" rx="28" ry="10" fill="white" />
        <ellipse cx="80" cy="118" rx="16" ry="8" fill="white" />
        <ellipse cx="104" cy="117" rx="14" ry="7" fill="white" />
      </g>
      <g opacity="0.2">
        <ellipse cx="340" cy="80" rx="24" ry="8" fill="white" />
        <ellipse cx="330" cy="78" rx="14" ry="7" fill="white" />
        <ellipse cx="356" cy="77" rx="12" ry="6" fill="white" />
      </g>

      {/* Tiny mushrooms in corners */}
      <g opacity="0.3" transform="translate(30, 500)">
        <rect x="6" y="8" width="4" height="8" rx="2" fill="hsl(35, 40%, 88%)" />
        <ellipse cx="8" cy="8" rx="8" ry="5" fill="hsl(345, 45%, 40%)" />
        <ellipse cx="6" cy="6" rx="2" ry="1.2" fill="hsl(35, 30%, 75%)" />
      </g>
      <g opacity="0.25" transform="translate(370, 480)">
        <rect x="4" y="6" width="3" height="6" rx="1.5" fill="hsl(35, 40%, 88%)" />
        <ellipse cx="5.5" cy="6" rx="6" ry="4" fill="hsl(345, 45%, 40%)" />
      </g>

      {/* Small flowers */}
      <g opacity="0.3" transform="translate(350, 540)">
        <circle cx="0" cy="-4" r="3" fill="hsl(0, 50%, 80%)" />
        <circle cx="4" cy="0" r="3" fill="hsl(0, 50%, 80%)" />
        <circle cx="0" cy="4" r="3" fill="hsl(0, 50%, 80%)" />
        <circle cx="-4" cy="0" r="3" fill="hsl(0, 50%, 80%)" />
        <circle cx="0" cy="0" r="2" fill="hsl(45, 70%, 70%)" />
      </g>
      <g opacity="0.25" transform="translate(50, 560)">
        <circle cx="0" cy="-3" r="2.5" fill="hsl(280, 40%, 80%)" />
        <circle cx="3" cy="0" r="2.5" fill="hsl(280, 40%, 80%)" />
        <circle cx="0" cy="3" r="2.5" fill="hsl(280, 40%, 80%)" />
        <circle cx="-3" cy="0" r="2.5" fill="hsl(280, 40%, 80%)" />
        <circle cx="0" cy="0" r="1.8" fill="hsl(45, 70%, 70%)" />
      </g>
    </svg>

    {/* Rolling hills */}
    <div className="absolute bottom-0 left-0 w-full pointer-events-none">
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-[10vh]">
        <ellipse cx="200" cy="80" rx="280" ry="55" fill="hsl(var(--hill-green-light))" opacity="0.5" />
        <ellipse cx="320" cy="85" rx="200" ry="45" fill="hsl(var(--hill-green))" opacity="0.4" />
        <ellipse cx="100" cy="88" rx="220" ry="40" fill="hsl(var(--hill-green))" opacity="0.35" />
      </svg>
    </div>

    {/* Content */}
    <div className="relative z-10 min-h-screen">{children}</div>
  </div>
);

export default StoryBookBackground;
