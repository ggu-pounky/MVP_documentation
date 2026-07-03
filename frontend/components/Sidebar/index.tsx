"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isMobile?: boolean;
}

export const Sidebar = ({ isMobile }: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <>
      <div className="logo">Gestion des Besoins</div>
      <div className="menu">
        <Link
          href="/besoins"
          className={`menu-item ${isActive("/besoins") ? "active" : ""}`}
        >
          <span className="icon">📋</span>
          <span className="text">Besoins</span>
        </Link>
        <Link
          href="/settings"
          className={`menu-item ${isActive("/settings") ? "active" : ""}`}
        >
          <span className="icon">⚙️</span>
          <span className="text">Paramètres</span>
        </Link>
      </div>
    </>
  );
};
