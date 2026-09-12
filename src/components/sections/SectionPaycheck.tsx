import { useStory } from '../../context/StoryProvider';
import { formatMoney } from '../../lib/format';

export default function SectionPaycheck() {
  const { activePersona } = useStory();

  if (!activePersona) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="rounded-[2rem] border border-stone-200 bg-stone-50 p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-stone-500">
          Your paycheck just hit.
        </p>
        <div className="mt-6 text-5xl font-black tracking-[-0.08em] text-stone-900 sm:text-7xl">
          +{formatMoney(activePersona.paycheck)}
        </div>
        <p className="mt-5 text-xl text-stone-700">Let&apos;s see where it goes.</p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stone-700">
          Start
        </div>
      </div>
    </section>
  );
}
