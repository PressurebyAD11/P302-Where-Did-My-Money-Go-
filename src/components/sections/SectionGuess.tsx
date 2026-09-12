import { useStory } from '../../context/StoryProvider';
import { STORY } from '../../data/story.data';

export default function SectionGuess() {
  const { guess, setGuess } = useStory();

  return (
    <section className="py-10">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-black tracking-[-0.06em] text-stone-900">
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
                    ? 'border-stone-900 bg-stone-900 text-white'
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
