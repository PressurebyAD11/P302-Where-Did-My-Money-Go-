import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getPersona, getStory, type CategoryId, type Persona, type PersonaId, type Story } from '../data/story';

type StoryContextValue = {
  story: Story | null;
  activePersonaId: PersonaId;
  activePersona: Persona | null;
  guess: CategoryId | null;
  setGuess: (guess: CategoryId | null) => void;
  switchPersona: (id: PersonaId) => void;
  replay: () => void;
};

const StoryContext = createContext<StoryContextValue | null>(null);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [story, setStory] = useState<Story | null>(null);
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>('alex');
  const [guess, setGuess] = useState<CategoryId | null>(null);

  useEffect(() => {
    let isMounted = true;

    getStory().then((nextStory) => {
      if (isMounted) {
        setStory(nextStory);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const activePersona = story ? getPersona(story, activePersonaId) : null;

  const value = useMemo<StoryContextValue>(() => ({
    story,
    activePersonaId,
    activePersona,
    guess,
    setGuess,
    switchPersona: (id: PersonaId) => {
      setActivePersonaId(id);
      setGuess(null);
    },
    replay: () => {
      setGuess(null);
    },
  }), [story, activePersonaId, activePersona, guess]);

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

export function useStory() {
  const context = useContext(StoryContext);

  if (!context) {
    throw new Error('useStory must be used within a StoryProvider');
  }

  return context;
}
