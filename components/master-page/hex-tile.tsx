// components/HexTile.tsx
import React from "react";
import Link from "next/link";
import "./hex-tile.css"; // or use styled-components

interface HexTileProps {
  href: string;
  icon: string;
  label: string;
  badge?: number;
}

const HexTile: React.FC<HexTileProps> = ({ href, icon, label, badge }) => (
  <Link href={href} className="hex-tile">
    <div className="hex-inner">
      <i className={icon}></i>
      <span>{label}</span>
      {badge !== undefined && <span className="badge">{badge}</span>}
    </div>
  </Link>
);

export default HexTile;
