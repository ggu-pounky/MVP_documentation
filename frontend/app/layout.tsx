"use client";

import { useState, useEffect } from "react";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="fr">
      <body>
        <div className="app-container">
          {/* Bouton hamburger pour mobile */}
          <button
            className="hamburger-button"
            onClick={toggleSidebar}
          >
            ☰
          </button>

          {/* Menu latéral */}
          <div
            className={`sidebar ${isSidebarOpen ? "open" : ""}`}
            style={{ transform: isMobile && !isSidebarOpen ? "translateX(-100%)" : "none" }}
          >
            <Sidebar isMobile={isMobile} />
          </div>

          {/* Contenu principal */}
          <div
            className={`main-content ${isMobile && !isSidebarOpen ? "shifted" : ""}`}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
