"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Lang } from "@/data/translations";
import { load, save } from "@/lib/storage";

interface LanguageContextType {
  lang: Lang;
  toggle: () => void;
  isDE: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggle: () => {},
  isDE: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    setLang(load<Lang>("lang", "en"));
  }, []);

  const toggle = () => {
    const next: Lang = lang === "en" ? "de" : "en";
    setLang(next);
    save("lang", next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, isDE: lang === "de" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
