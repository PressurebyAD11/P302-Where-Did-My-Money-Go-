import { useStory } from '../../context/StoryProvider';

export default function SectionHook() {
  const { activePersona } = useStory();

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
      <p className="mb-5 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-stone-500">
        Part 0
      </p>
      <h1 className="max-w-xl text-3xl font-black tracking-[-0.06em] text-stone-900 sm:text-5xl">
        Why does my paycheck disappear even when I don&apos;t feel like I&apos;m spending that much?
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
        It&apos;s often not one big purchase. It&apos;s dozens of small decisions that become invisible until we look at them individually.
      </p>
      <p className="mt-4 text-base text-stone-500">
        No account creation. No bank connection. Just scroll.
      </p>
      <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-stone-400">
        Default persona: {activePersona?.name ?? 'Alex'}
      </p>
    </section>
  );
}
