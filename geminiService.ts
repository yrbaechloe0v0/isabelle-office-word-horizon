
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WordAnalysis, Language, AnalysisCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    category: { type: Type.STRING },
    greeting: { type: Type.STRING },
    pronunciation: { type: Type.STRING },
    definition: { type: Type.STRING },
    etymology: { type: Type.STRING },
    wordFamily: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          form: { type: Type.STRING },
          level: { type: Type.STRING },
          meaning: { type: Type.STRING },
          morphology: { type: Type.STRING },
          register: { type: Type.STRING }
        },
        propertyOrdering: ["form", "level", "meaning", "morphology", "register"]
      }
    },
    nookLibrary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phrase: { type: Type.STRING },
          meaning: { type: Type.STRING }
        },
        propertyOrdering: ["phrase", "meaning"]
      }
    },
    twinFlowers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          synonym: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        propertyOrdering: ["synonym", "explanation"]
      }
    },
    oppositeStones: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    soundEffect: { type: Type.STRING },
    example: { type: Type.STRING },
    trickyPairs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          difference: { type: Type.STRING }
        },
        propertyOrdering: ["word", "difference"]
      }
    },
    quiz: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        correctAnswer: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      propertyOrdering: ["question", "correctAnswer", "options"]
    },
    vocabUpgrades: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          level: { type: Type.STRING },
          text: { type: Type.STRING },
          notes: { type: Type.STRING }
        },
        propertyOrdering: ["level", "text", "notes"]
      }
    },
    grammar: {
      type: Type.OBJECT,
      properties: {
        topic: { type: Type.STRING },
        quickMap: { type: Type.ARRAY, items: { type: Type.STRING } },
        memoryTrick: { type: Type.STRING },
        expertTrap: { type: Type.STRING },
        practice: {
          type: Type.OBJECT,
          properties: {
            mcq: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING }
              },
              propertyOrdering: ["question", "options", "correctAnswer"]
            },
            rewrite: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                correctAnswer: { type: Type.STRING }
              },
              propertyOrdering: ["question", "correctAnswer"]
            }
          },
          propertyOrdering: ["mcq", "rewrite"]
        }
      },
      propertyOrdering: ["topic", "quickMap", "memoryTrick", "expertTrap", "practice"]
    }
  },
  required: ["word", "category", "greeting", "pronunciation", "definition", "etymology", "wordFamily", "nookLibrary", "twinFlowers", "oppositeStones", "soundEffect", "example"],
  propertyOrdering: ["word", "category", "greeting", "pronunciation", "definition", "etymology", "wordFamily", "nookLibrary", "twinFlowers", "oppositeStones", "soundEffect", "example", "trickyPairs", "quiz", "vocabUpgrades", "grammar"]
};

export const analyzeWord = async (word: string, language: Language, category: AnalysisCategory): Promise<WordAnalysis> => {
  
  const prompt = `
    Role: You are "Isabelle", the Academic Manager at "Word Horizon" island 🏝️.
    Style: Friendly, sweet, use emojis (🌿, 🍎, ✨, 🐾), sound effects (e.g., *Ta-da!*). Be concise and structured.
    Source: EXCLUSIVELY use Cambridge Dictionary and Academic Grammar resources.
    
    IMPORTANT LANGUAGE RULE:
    - If Language is Vietnamese: ALL greetings, explanations, definitions, meanings, logic breakdowns, and nuances MUST be in Vietnamese 100%.
    - If Language is English: ALL greetings, explanations, definitions, and meanings MUST be in English 100%.
    - Technical values: 'word', 'pronunciation', 'form', 'phrase' remain in English.

    Task: Analyze input "${word}" in category "${category}".

    SPECIFIC RULES PER CATEGORY:
    
    CASE 1: CATEGORY = 'WORD_FORMATION'
       - List EVERY SINGLE variation from A1 to C2 in a vertical list format.
       - MUST include advanced forms & affixes: -hearted, -worthy, -some, -esque, -proof, out-, counter-, over-, under-.
       - **Logic Breakdown**: Explain the affix meaning in 'morphology'.
       - **Nuance**: Specify Formal/Informal/Literary in 'register'.
       - **Quiz**: Create a gap-fill sentence.
    
    CASE 2: CATEGORY = 'IDIOMS_PHRASAL'
       - List 5-10 items (Idioms AND Phrasal Verbs) formatted as vertical entries.
       - **Quiz**: Create a gap-fill sentence.

    CASE 3: CATEGORY = 'GRAMMAR' (Nook Academy)
       - Input is a grammar topic.
       - **Quick Map**: Summarize formulas/rules in bullet points (concise).
       - **Memory Trick**: A mnemonic or "spell" to remember.
       - **Expert Trap**: Common mistakes in specialized exams.
       - **Practice**: 
            - MCQ: One multiple choice question.
            - Rewrite: One sentence rewrite exercise.
       - 'definition' should be a sweet intro.

    CASE 4: CATEGORY = 'CHALLENGE' (Challenge & Upgrade)
       - Input is a sentence.
       - **VocabUpgrades**: Provide a version at C2/Pro level.
         1. { level: "C2/Pro (Native)", text: "[Rewrite the user sentence to Native/C2 level]", notes: "[Explain specific vocab changes]" }
       - You may add a second version if applicable, but prioritize the C2 Native upgrade.
    
    GENERAL RULES:
    - Formatting: Output lists strictly as vertical entries for speed and readability on tablets.
    - Example: Create a sweet, Animal Crossing themed sentence in ${language}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: { thinkingBudget: 2000 }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as WordAnalysis;
      data.category = category;
      return data;
    }
    throw new Error("No response");
  } catch (error) {
    console.error("Gemini Error:", error);
    if (error instanceof Error && error.message.includes('xhr error')) {
       const retryResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: analysisSchema
        }
      });
      if (retryResponse.text) {
        return JSON.parse(retryResponse.text);
      }
    }
    throw error;
  }
};
