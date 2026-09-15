import { useStory } from '../../context/useStory';
import { formatMoney } from '../../lib/format';

export default function SectionCategoryReveal() {
  const { activePersona } = useStory();

  if (!activePersona) {
    return null;
  }

  const maxValue = Math.max(...activePersona.categoryTotals.map((category) => category.amount));

  return (
    <section className="py-10">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8">
        <h3 className="text-2xl font-black tracking-[-0.06em] text-stone-900">
          Where it actually went
        </h3>

        <div className="mt-6 space-y-4">
          {[...activePersona.categoryTotals]
            .sort((a, b) => b.amount - a.amount)
            .map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm font-medium text-stone-700">
                  <span>{category.label}</span>
                  <span>{formatMoney(category.amount)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(category.amount / maxValue) * 100}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        <div className="mt-8 border-t border-stone-200 pt-5">
          <p className="text-lg font-semibold text-stone-700">
            You didn&apos;t make one {formatMoney(activePersona.discretionaryTotal)} purchase.
            You made dozens of small ones.
          </p>
        </div>
      </div>
    </section>
  );
}
