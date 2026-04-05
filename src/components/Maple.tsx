import React from "react";
import MushroomMascot from "@/components/icons/MushroomMascot";

type MapleExpression = "waving" | "attentive" | "gentle" | "happy";

interface MapleProps {
  expression: MapleExpression;
  className?: string;
}

const Maple: React.FC<MapleProps> = ({ expression, className = "" }) => {
  return (
    <MushroomMascot className={className} />
  );
};

export default Maple;
