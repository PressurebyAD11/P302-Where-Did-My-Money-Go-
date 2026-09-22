import { useStory } from '../../context/useStory';

export default function SectionHook() {
  const { activePersona, story, switchPersonaNoScroll } = useStory();

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
      <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-stone-500">
        No account creation. No bank connection. Just scroll.
      </p>
      <h1 className="max-w-xl text-3xl font-black tracking-[-0.06em] text-stone-900 sm:text-5xl">
        Why does my paycheck disappear even when I don&apos;t feel like I&apos;m spending that much?
      </h1>
      {activePersona?.intro && (
        <p className="mt-4 max-w-xl text-lg text-stone-600">
          {activePersona.intro}
        </p>
      )}

      {story && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {story.personas.map((persona) => {
            const selected = persona.id === activePersona?.id;

            return (
              <button
                key={persona.id}
                type="button"
                onClick={() => switchPersonaNoScroll(persona.id)}
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
      )}
    </section>
  );
}
