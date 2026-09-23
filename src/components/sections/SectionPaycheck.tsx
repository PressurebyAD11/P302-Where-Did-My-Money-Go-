import { useStory } from '../../context/useStory';
import { formatMoney } from '../../lib/format';

type ThemeMode = 'light' | 'dark';

export default function SectionPaycheck({ theme = 'light' }: { theme?: ThemeMode }) {
  const { activePersona } = useStory();
  const isDark = theme === 'dark';

  if (!activePersona) {
    return null;
  }

  const handleStartClick = () => {
    const fixedExpensesSection = document.querySelector('[data-section="fixed-expenses"]');
    if (fixedExpensesSection) {
      fixedExpensesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-10">
      <div className={['rounded-[2rem] border p-6 sm:p-8', isDark ? 'border-slate-700 bg-slate-900' : 'border-stone-200 bg-stone-50'].join(' ')}>
        <p className={['text-sm font-medium uppercase tracking-[0.22em]', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>
          Your paycheck just hit.
        </p>
        <div className={['mt-6 text-5xl font-black tracking-[-0.08em] sm:text-7xl', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>
          +{formatMoney(activePersona.paycheck)}
        </div>
        <p className={['mt-5 text-xl', isDark ? 'text-slate-300' : 'text-stone-700'].join(' ')}>Let&apos;s see where it goes.</p>
        <button
          onClick={handleStartClick}
          className={[
            'mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] transition-colors',
            isDark
              ? 'border-slate-600 bg-slate-800 text-slate-100 hover:bg-slate-700'
              : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50 active:bg-stone-100',
          ].join(' ')}
        >
          Start
        </button>
      </div>
    </section>
  );
}
