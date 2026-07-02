'use client';

import { useState, useEffect } from 'react';

export function HamburgerButton() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
    const mainContent = document.querySelector('.main-content') as HTMLElement;

    if (sidebar) {
      sidebar.classList.toggle('open', isOpen);
    }
    if (overlay) {
      overlay.classList.toggle('active', isOpen);
    }
    if (mainContent) {
      mainContent.classList.toggle('full-width', isOpen);
    }

    // Prevent body scroll when sidebar is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className="hamburger-button lg:hidden"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            // Close icon (X)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            // Hamburger icon
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      
      {/* Overlay for mobile sidebar */}
      <div 
        className="sidebar-overlay"
        onClick={toggleSidebar}
      />
    </>
  );
}
