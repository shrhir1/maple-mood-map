import React from "react";

const StoryBookBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-screen w-full overflow-hidden" style={{
    background: "linear-gradient(180deg, #FFE8D6 0%, #FFF5EC 45%, hsl(30, 50%, 96%) 100%)"
  }}>
    {/* Large pastel blob shapes */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Dusty rose - top right */}
      <div className="absolute -top-10 -right-16 w-[220px] h-[200px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #F2C4C4 0%, transparent 70%)" }} />
      {/* Soft yellow - top left */}
      <div className="absolute top-[15%] -left-12 w-[200px] h-[180px] rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #FDE68A 0%, transparent 70%)" }} />
      {/* Pale mint - middle right */}
      <div className="absolute top-[45%] -right-8 w-[180px] h-[180px] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, #A7F3D0 0%, transparent 70%)" }} />
      {/* Light lavender - bottom left */}
      <div className="absolute top-[60%] -left-10 w-[200px] h-[190px] rounded-full opacity-28"
        style={{ background: "radial-gradient(circle, #DDD6FE 0%, transparent 70%)" }} />
      {/* Extra soft peach - center top */}
      <div className="absolute top-[5%] left-[40%] w-[160px] h-[160px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #FECACA 0%, transparent 70%)" }} />
    </div>

    {/* Colorful sparkles */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <polygon points="80,60 82,54 84,60 90,62 84,64 82,70 80,64 74,62" fill="#F5C842" opacity="0.6" />
      <polygon points="320,90 322,84 324,90 330,92 324,94 322,100 320,94 314,92" fill="#F5C842" opacity="0.5" />
      <polygon points="60,300 61.5,296 63,300 67,301.5 63,303 61.5,307 60,303 56,301.5" fill="#F5C842" opacity="0.45" />
      <polygon points="370,200 371.5,196 373,200 377,201.5 373,203 371.5,207 370,203 366,201.5" fill="#F5C842" opacity="0.4" />
      <polygon points="200,40 201.5,36 203,40 207,41.5 203,43 201.5,47 200,43 196,41.5" fill="#F5C842" opacity="0.35" />

      {/* Small clouds */}
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

    {/* Rolling green hills */}
    <div className="absolute bottom-0 left-0 w-full pointer-events-none">
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-[12vh]">
        <ellipse cx="200" cy="80" rx="280" ry="55" fill="hsl(var(--hill-green-light))" opacity="0.5" />
        <ellipse cx="320" cy="85" rx="200" ry="45" fill="hsl(var(--hill-green))" opacity="0.45" />
        <ellipse cx="100" cy="88" rx="220" ry="40" fill="hsl(var(--hill-green))" opacity="0.4" />
      </svg>
    </div>

    {/* Content */}
    <div className="relative z-10 min-h-screen">{children}</div>
  </div>
);

export default StoryBookBackground;
