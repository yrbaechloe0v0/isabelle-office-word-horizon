
export interface WordFamilyMember {
  form: string;
  level: string;
  meaning: string;
  morphology?: string; // Logic Breakdown (prefix/suffix explanation)
  register?: string;   // Nuance (Formal/Informal/Literary)
}

export interface NookLibraryItem {
  phrase: string;
  meaning: string;
}

export interface TwinFlower {
  synonym: string;
  explanation: string;
}

export interface TrickyPair {
  word: string;
  difference: string;
}

export interface Quiz {
  question: string;
  correctAnswer: string;
  options?: string[]; // Added for MCQ
}

export interface UpgradeVersion {
  level: string; // e.g., "B2/C1" or "C2/Pro"
  text: string;
  notes: string; // Explanation of changes/vocabulary used
}

export interface GrammarData {
  topic: string;
  quickMap: string[]; // List of formulas/points
  memoryTrick: string;
  expertTrap: string;
  practice: {
    mcq: Quiz;
    rewrite: Quiz;
  };
}

export type AnalysisCategory = 'WORD_FORMATION' | 'IDIOMS_PHRASAL' | 'GRAMMAR' | 'CHALLENGE';

export interface WordAnalysis {
  word: string;
  category: AnalysisCategory;
  greeting: string;
  pronunciation: string;
  definition: string;
  etymology: string;
  wordFamily: WordFamilyMember[];
  nookLibrary: NookLibraryItem[]; 
  twinFlowers: TwinFlower[];
  oppositeStones: string[];
  soundEffect: string;
  example: string;
  trickyPairs?: TrickyPair[];
  quiz?: Quiz; // For standard single quiz
  vocabUpgrades?: UpgradeVersion[]; // For Challenge mode
  grammar?: GrammarData; // For Nook Academy
}

export interface HistoryEntry {
  word: string;
  category: AnalysisCategory;
  timestamp: number;
}

export enum Language {
  ENGLISH = 'English',
  VIETNAMESE = 'Vietnamese'
}

export type ViewMode = 'LANG_SELECT' | 'CAT_SELECT' | 'WORD_INPUT' | 'ANALYSIS' | 'LOADING' | 'ERROR';
