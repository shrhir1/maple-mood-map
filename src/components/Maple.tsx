import React from "react";
import mushroomImg from "@/assets/mushroom.png";

type MapleExpression = "waving" | "attentive" | "gentle" | "happy";

interface MapleProps {
  expression: MapleExpression;
  className?: string;
}

const Maple: React.FC<MapleProps> = ({ expression, className = "" }) => {
  return (
    <img
      src={mushroomImg}
      alt="Maple the mushroom mascot"
      className={className}
      width="130"
      height="156"
      style={{ objectFit: "contain" }}
    />
  );
};

export default Maple;
