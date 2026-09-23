import { useStory } from '../../context/useStory';

type ThemeMode = 'light' | 'dark';

export default function SectionHook({ theme = 'light' }: { theme?: ThemeMode }) {
  const { activePersona } = useStory();
  const isDark = theme === 'dark';

  return (
    <section
      className={[
        'rounded-[2rem] border p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10',
        isDark ? 'border-slate-700 bg-slate-900/80' : 'border-stone-200 bg-white/90',
      ].join(' ')}
    >
      <h1 className={['max-w-xl text-3xl font-black tracking-[-0.06em] sm:text-5xl', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>
        Why does my paycheck disappear even when I don&apos;t feel like I&apos;m spending that much?
      </h1>
      {activePersona?.intro && (
        <p className={['mt-4 max-w-xl text-lg', isDark ? 'text-slate-300' : 'text-stone-600'].join(' ')}>
          {activePersona.intro}
        </p>
      )}
    </section>
  );
}
