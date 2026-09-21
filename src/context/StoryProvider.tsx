import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getPersona, getStory, type CategoryId, type PersonaId, type Story } from '../data/story';
import { StoryContext } from './useStory';

export function StoryProvider({ children }: { children: ReactNode }) {
  const [story, setStory] = useState<Story | null>(null);
  const [activePersonaId, setActivePersonaId] = useState<PersonaId>('alex');
  const [guess, setGuess] = useState<CategoryId | null>(null);

  useEffect(() => {
    let isMounted = true;

    getStory().then((nextStory) => {
      if (isMounted) {
        setStory(nextStory);
        setActivePersonaId(nextStory.defaultPersonaId);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const resetStoryFlow = useCallback(() => {
    setGuess(null);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  const switchPersona = useCallback(
    (id: PersonaId) => {
      setActivePersonaId(id);
      resetStoryFlow();
    },
    [resetStoryFlow],
  );

  const switchPersonaNoScroll = useCallback(
    (id: PersonaId) => {
      setActivePersonaId(id);
      setGuess(null);
    },
    [],
  );

  const replay = useCallback(() => {
    resetStoryFlow();
  }, [resetStoryFlow]);

  const activePersona = story ? getPersona(story, activePersonaId) : null;

  const value = useMemo(() => ({
    story,
    activePersonaId,
    activePersona,
    guess,
    setGuess,
    switchPersona,
    switchPersonaNoScroll,
    replay,
  }), [story, activePersonaId, activePersona, guess, switchPersona, switchPersonaNoScroll, replay]);

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}
