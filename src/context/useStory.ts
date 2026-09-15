import { createContext, useContext } from 'react';
import type { CategoryId, Persona, PersonaId, Story } from '../data/story';

export type StoryContextValue = {
  story: Story | null;
  activePersonaId: PersonaId;
  activePersona: Persona | null;
  guess: CategoryId | null;
  setGuess: (guess: CategoryId | null) => void;
  switchPersona: (id: PersonaId) => void;
  replay: () => void;
};

export const StoryContext = createContext<StoryContextValue | null>(null);

export function useStory() {
  const context = useContext(StoryContext);

  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }

  return context;
}
