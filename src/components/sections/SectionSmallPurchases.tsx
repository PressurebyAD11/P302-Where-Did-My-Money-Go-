import { useEffect, useRef } from 'react';
import { useStory } from '../../context/useStory';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { formatMoney } from '../../lib/format';

export default function SectionSmallPurchases() {
  const { activePersona } = useStory();
  const root = useRef<HTMLElement>(null);
  const balanceRef = useRef<HTMLDivElement>(null);
  const payoffGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activePersona) {
      return;
    }

    ScrollTrigger.refresh();
  }, [activePersona?.id]);

  useGSAP(
    () => {
      const balanceEl = balanceRef.current;
      const rootEl = root.current;
      const payoffGroupEl = payoffGroupRef.current;

      if (!activePersona || !balanceEl || !rootEl || !payoffGroupEl) {
        return;
      }

      const counter = { value: activePersona.remainingAfterFixed };
      const paintBalance = () => {
        balanceEl.textContent = formatMoney(Math.round(counter.value));
      };

      paintBalance();

      const rows = gsap.utils.toArray<HTMLElement>('.sp-row', rootEl);
      const mm = gsap.matchMedia(rootEl);

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { isDesktop, reduced } = ctx.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduced: boolean;
          };

          if (reduced) {
            counter.value = activePersona.remainingFinal;
            paintBalance();
            gsap.set(rootEl, { autoAlpha: 1, y: 0 });
            gsap.set(rows, { opacity: 1, y: 0 });
            gsap.set(payoffGroupEl, { opacity: 1, y: 0 });
            return;
          }

          gsap.set(rootEl, { autoAlpha: 0, y: 16 });
          gsap.set(rows, { opacity: 0, y: 12 });
          gsap.set(payoffGroupEl, { opacity: 0, y: 12 });

          gsap.to(rootEl, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rootEl,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rootEl,
              start: 'top 70%',
              end: isDesktop ? 'bottom 55%' : 'bottom 80%',
              scrub: true,
            },
          });

          let running = activePersona.remainingAfterFixed;

          rows.forEach((row, index) => {
            const transaction = activePersona.transactions[index];
            running -= transaction.amount;

            tl.to(row, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, index * 0.25);
            tl.to(
              counter,
              { value: running, duration: 0.4, onUpdate: paintBalance, ease: 'none' },
              '<',
            );
          });

          tl.to(payoffGroupEl, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [activePersona?.id], revertOnUpdate: true },
  );

  if (!activePersona) {
    return null;
  }

  return (
    <section ref={root} className="py-10">
      <div className="space-y-6 rounded-[2rem] border border-stone-200 bg-stone-50 p-6 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
          Then the small purchases start.
        </p>

        <div className="space-y-2">
          {activePersona.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="sp-row flex items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2"
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
              <span className="text-sm font-semibold text-stone-900 tabular-nums">
                {formatMoney(transaction.amount)}
              </span>
            </div>
          ))}
        </div>

        <div ref={payoffGroupRef} className="border-t border-stone-200 pt-4">
          <p
            ref={balanceRef}
            className="text-3xl font-black tracking-[-0.07em] text-stone-900 tabular-nums"
          >
            {formatMoney(activePersona.remainingAfterFixed)}
          </p>
          <p className="mt-2 text-base text-stone-600">left</p>
        </div>
      </div>
    </section>
  );
}
