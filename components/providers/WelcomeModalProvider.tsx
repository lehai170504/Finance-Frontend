"use client";

import { useState, useEffect } from "react";
import { WelcomeModal } from "@/components/modals/WelcomeModal";

export function WelcomeModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("wealthtrack-welcome-seen");
    
    if (!hasSeenWelcome) {
      // Show modal after a short delay to allow page to load
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Mark that user has seen the modal
        localStorage.setItem("wealthtrack-welcome-seen", "true");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {children}
      <WelcomeModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
