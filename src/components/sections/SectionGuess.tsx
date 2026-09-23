import { useStory } from '../../context/useStory';
import { STORY } from '../../data/story.data';

type ThemeMode = 'light' | 'dark';

export default function SectionGuess({ theme = 'light' }: { theme?: ThemeMode }) {
  const { guess, setGuess } = useStory();
  const isDark = theme === 'dark';

  return (
    <section className="py-10">
      <div className={['rounded-[2rem] border p-6 sm:p-8', isDark ? 'border-slate-700 bg-slate-900' : 'border-stone-200 bg-white'].join(' ')}>
        <h2 className={['text-2xl font-black tracking-[-0.06em]', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>
          Where do you think the most money went?
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {STORY.guessOptions.map((option) => {
            const isSelected = guess === option.category;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setGuess(option.category)}
                className={[
                  'rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] transition-colors',
                  isSelected
                    ? isDark
                      ? 'border-slate-100 bg-slate-100 text-slate-900'
                      : 'border-stone-900 bg-stone-900 text-white'
                    : isDark
                      ? 'border-slate-600 bg-slate-800 text-slate-200 hover:border-slate-500 hover:bg-slate-700'
                      : 'border-stone-300 bg-stone-50 text-stone-700 hover:border-stone-400 hover:bg-stone-100',
                ].join(' ')}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
