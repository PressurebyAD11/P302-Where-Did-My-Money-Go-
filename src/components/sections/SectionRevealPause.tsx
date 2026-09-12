import { useStory } from '../../context/StoryProvider';
import { formatMoney } from '../../lib/format';

export default function SectionRevealPause() {
  const { activePersona } = useStory();

  if (!activePersona) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="rounded-[2rem] border border-stone-200 bg-stone-950 p-6 text-stone-50 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-stone-400">
          Those purchases didn&apos;t feel very big. Together, they were…
        </p>
        <div className="mt-6 text-5xl font-black tracking-[-0.08em] text-white sm:text-7xl">
          {formatMoney(activePersona.discretionaryTotal)}
        </div>
      </div>
    </section>
  );
}
