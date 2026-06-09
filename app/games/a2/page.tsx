"use client";

import GamesPage from "@/components/practice/A1GamesPage";
import { getAllA2Vocab } from "@/data/a2-curriculum";

export default function A2GamesRoute() {
  return (
    <GamesPage
      levelLabel="A2"
      levelHref="/games/a2"
      getVocab={getAllA2Vocab}
    />
  );
}
