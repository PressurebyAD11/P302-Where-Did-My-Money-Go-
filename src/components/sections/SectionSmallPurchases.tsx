import { useStory } from '../../context/StoryProvider';
import { formatMoney } from '../../lib/format';

export default function SectionSmallPurchases() {
  const { activePersona } = useStory();

  if (!activePersona) {
    return null;
  }

  return (
    <section className="py-10">
      <div className="space-y-6 rounded-[2rem] border border-stone-200 bg-stone-50 p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
          Then the small purchases start.
        </p>

        <div className="space-y-2">
          {activePersona.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg" aria-hidden="true">{transaction.icon}</span>
                <div>
                  <div className="text-sm font-medium text-stone-700">{transaction.merchant}</div>
                  <div className="text-[0.68rem] uppercase tracking-[0.18em] text-stone-400">
                    {transaction.category}
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-stone-900">
                {formatMoney(transaction.amount)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-200 pt-4">
          <p className="text-3xl font-black tracking-[-0.07em] text-stone-900">
            {formatMoney(activePersona.remainingFinal)} left
          </p>
        </div>
      </div>
    </section>
  );
}
