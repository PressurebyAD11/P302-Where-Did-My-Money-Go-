import { useStory } from '../../context/useStory';

export default function SectionHook() {
  const { activePersona } = useStory();

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
      <h1 className="max-w-xl text-3xl font-black tracking-[-0.06em] text-stone-900 sm:text-5xl">
        Why does my paycheck disappear even when I don&apos;t feel like I&apos;m spending that much?
      </h1>
      {activePersona?.intro && (
        <p className="mt-4 max-w-xl text-lg text-stone-600">
          {activePersona.intro}
        </p>
      )}
    </section>
  );
}
