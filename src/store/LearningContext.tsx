import { createContext, useContext, type ReactNode } from "react";
import { useLearningStore, type LearningStore } from "./learningStore";

const LearningContext = createContext<LearningStore | null>(null);

export function LearningProvider({ children }: { children: ReactNode }) {
  const store = useLearningStore();
  return (
    <LearningContext.Provider value={store}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error("useLearning must be used inside LearningProvider");
  }
  return context;
}
