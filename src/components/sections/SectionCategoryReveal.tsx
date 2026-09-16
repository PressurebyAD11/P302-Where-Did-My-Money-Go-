import { useEffect, useRef } from 'react';
import { useStory } from '../../context/useStory';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { formatMoney } from '../../lib/format';

export default function SectionCategoryReveal() {
  const { activePersona } = useStory();
  const root = useRef<HTMLElement>(null);
  const barRowsRef = useRef<HTMLDivElement>(null);
  const payoffRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activePersona) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(frame);
  }, [activePersona?.id]);

  useGSAP(
    () => {
      const rootEl = root.current;
      const payoffEl = payoffRef.current;

      if (!activePersona || !rootEl || !payoffEl) {
        return;
      }

      const ordered = [...activePersona.categoryTotals].sort((a, b) => b.amount - a.amount);
      const maxAmount = ordered[0]?.amount ?? 1;
      const fills = gsap.utils.toArray<HTMLElement>('[data-fill]', rootEl);
      const amounts = gsap.utils.toArray<HTMLElement>('[data-amount]', rootEl);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        ordered.forEach((category, index) => {
          const fill = fills[index];
          const amount = amounts[index];
          if (fill) {
            fill.style.width = `${(category.amount / maxAmount) * 100}%`;
            fill.style.backgroundColor = category.color;
          }
          if (amount) {
            amount.textContent = formatMoney(category.amount);
          }
        });
        gsap.set(payoffEl, { opacity: 1, y: 0 });
        ScrollTrigger.refresh();
        return;
      }

      gsap.set(fills, { width: '0%' });
      gsap.set(amounts, { opacity: 1 });
      gsap.set(payoffEl, { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootEl,
          start: 'top 60%',
          end: 'bottom 85%',
          scrub: true,
        },
      });

      fills.forEach((fill, index) => {
        const category = ordered[index];
        if (!category) {
          return;
        }

        tl.fromTo(
          fill,
          { width: '0%' },
          { width: `${(category.amount / maxAmount) * 100}%`, ease: 'none' },
          index * 0.1,
        );
      });

      tl.to(payoffEl, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [activePersona?.id], revertOnUpdate: true },
  );

  if (!activePersona) {
    return null;
  }

  return (
    <section ref={root} className="py-10">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8">
        <h3 className="text-2xl font-black tracking-[-0.06em] text-stone-900">
          Where it actually went
        </h3>

        <div ref={barRowsRef} className="mt-6 space-y-4">
          {[...activePersona.categoryTotals]
            .sort((a, b) => b.amount - a.amount)
            .map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between gap-4 text-sm font-medium text-stone-700">
                  <span>{category.label}</span>
                  <span data-amount={category.category} className="category-amount tabular-nums">
                    {formatMoney(category.amount)}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-stone-200">
                  <div
                    data-fill
                    className="h-full rounded-full"
                    style={{
                      width: 0,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
        </div>

        <div ref={payoffRef} className="mt-8 border-t border-stone-200 pt-5">
          <p className="text-lg font-semibold text-stone-700">
            You didn&apos;t make one {formatMoney(activePersona.discretionaryTotal)} purchase.
            You made dozens of small ones.
          </p>
        </div>
      </div>
    </section>
  );
}
