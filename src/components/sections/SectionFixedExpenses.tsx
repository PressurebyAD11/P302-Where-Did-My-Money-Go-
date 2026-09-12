import { useStory } from '../../context/StoryProvider';
import { formatMoney } from '../../lib/format';

export default function SectionFixedExpenses() {
  const { activePersona } = useStory();

  if (!activePersona) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="space-y-6 rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8">
        <div className="space-y-4">
          {activePersona.fixedExpenses.map((bill) => (
            <div
              key={bill.id}
              className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{bill.icon}</span>
                <span className="text-base font-medium text-stone-700">{bill.label}</span>
              </div>
              <span className="text-base font-semibold text-stone-900">{formatMoney(bill.amount)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-200 pt-4">
          <p className="text-2xl font-bold tracking-[-0.04em] text-stone-900">
            {formatMoney(activePersona.remainingAfterFixed)} left.
          </p>
          <p className="mt-2 text-base text-stone-600">
            So far, everything looks about right. Continue scrolling.
          </p>
        </div>
      </div>
    </section>
  );
}
