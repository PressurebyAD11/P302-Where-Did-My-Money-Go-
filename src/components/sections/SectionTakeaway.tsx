import { useStory } from '../../context/StoryProvider';
import { STORY } from '../../data/story.data';
import { formatMoney } from '../../lib/format';

export default function SectionTakeaway() {
  const { activePersona, switchPersona, replay } = useStory();

  if (!activePersona) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="rounded-[2rem] border border-stone-200 bg-stone-50 p-6 sm:p-8">
        <p className="text-base font-medium text-stone-700">
          You didn&apos;t make one {formatMoney(activePersona.discretionaryTotal)} purchase. You made dozens of small ones.
        </p>
        <p className="mt-4 text-base font-medium text-stone-700">
          Your money didn&apos;t disappear. It went somewhere. Understanding where gives you the power to decide where it goes next.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={replay}
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white"
          >
            Watch it again
          </button>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            Try a different paycheck:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {STORY.personas.map((persona) => {
              const selected = persona.id === activePersona.id;

              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => switchPersona(persona.id)}
                  aria-pressed={selected}
                  className={[
                    'rounded-2xl border p-4 text-left transition-colors',
                    selected
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-300 bg-white text-stone-900 hover:border-stone-400',
                  ].join(' ')}
                >
                  <div className="text-lg font-bold">{persona.name}</div>
                  <div className={selected ? 'mt-2 text-sm text-stone-200' : 'mt-2 text-sm text-stone-600'}>
                    {persona.vibe}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 text-base text-stone-700">
          {activePersona.discretionaryTotal >= activePersona.remainingFinal
            ? `This is more than the ${formatMoney(activePersona.remainingFinal)} left over.`
            : null}
        </div>
      </div>
    </section>
  );
}
