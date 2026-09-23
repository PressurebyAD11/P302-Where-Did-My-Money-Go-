import { useStory } from '../../context/useStory';
import { guessFeedback } from '../../lib/guessFeedback';

type ThemeMode = 'light' | 'dark';

export default function SectionGuessResult({ theme = 'light' }: { theme?: ThemeMode }) {
  const { activePersona, guess } = useStory();
  const isDark = theme === 'dark';

  if (!activePersona || guess === null) {
    return null;
  }

  const result = guessFeedback(guess, activePersona);

  return (
    <section className="py-10">
      <div className={['rounded-[2rem] border p-6 sm:p-8', isDark ? 'border-slate-700 bg-slate-900' : 'border-stone-200 bg-white'].join(' ')}>
        <p className={['text-[0.72rem] font-semibold uppercase tracking-[0.22em]', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>
          Guess result
        </p>
        <h3 className={['mt-4 text-3xl font-black tracking-[-0.06em]', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>
          {result.title}
        </h3>
        <p className={['mt-4 text-lg leading-relaxed', isDark ? 'text-slate-300' : 'text-stone-700'].join(' ')}>{result.body}</p>
      </div>
    </section>
  );
}
