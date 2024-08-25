"use client";

import { AudioContextType, AudioProps } from "@/types";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const audioContext = createContext<AudioContextType | undefined>(undefined);

const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [audio, setAudio] = useState<AudioProps | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/create-podcast") {
      setAudio(undefined);
    }
  }, [pathname]);

  return (
    <audioContext.Provider value={{ audio, setAudio }}>
      {children}
    </audioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(audioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

export default AudioProvider;
