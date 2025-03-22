"use client";

import { useEffect, useState } from "react"; // For state and effects
import { Settings } from "lucide-react"; // Icon for loading state
import { redirect } from "next/navigation"; // For client-side redirect

export default function Loading() {
  const [loadingText, setLoadingText] = useState("Analysing market...");

  // Array of loading texts
  const loadingMessages = [
    "Analysing market...",
    "Finding influencers...",
    "Generating recommendations...",
    "Finding competitive analysis..."
  ];

  // Change loading text every 2 seconds
  useEffect(() => {
    let messageIndex = 0;

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 2000);

    // Redirect to dashboard after 5 seconds
    setTimeout(() => {
      clearInterval(interval);
      redirect("/dashboard"); // Use redirect from next/navigation
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center space-y-4">
      {/* Settings Icon with spinning animation */}
      <Settings className="animate-spin text-primary" />

      {/* Loading text */}
      <p className="text-sm text-gray-600">{loadingText}</p>
    </div>
  );
}
