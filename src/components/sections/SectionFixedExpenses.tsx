import { useEffect, useRef } from 'react';
import { useStory } from '../../context/useStory';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { formatMoney } from '../../lib/format';

export default function SectionFixedExpenses() {
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

      const counter = { value: activePersona.paycheck };
      const paintBalance = () => {
        balanceEl.textContent = formatMoney(Math.round(counter.value));
      };

      paintBalance();

      const rows = gsap.utils.toArray<HTMLElement>('.fx-row', rootEl);
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
            counter.value = activePersona.remainingAfterFixed;
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

          let running = activePersona.paycheck;

          rows.forEach((row, index) => {
            const bill = activePersona.fixedExpenses[index];
            running -= bill.amount;

            tl.to(row, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, index * 0.3);
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
      <div className="space-y-6 rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
            The expected expenses
          </p>

          <div className="pt-4">
            <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Remaining
            </span>
            <div
              ref={balanceRef}
              aria-live="polite"
              className="text-5xl font-bold tracking-[-0.06em] text-stone-900 tabular-nums sm:text-6xl"
            >
              {formatMoney(activePersona.paycheck)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {activePersona.fixedExpenses.map((bill) => (
            <div
              key={bill.id}
              className="fx-row flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{bill.icon}</span>
                <span className="text-base font-medium text-stone-700">{bill.label}</span>
              </div>
              <span className="text-base font-semibold text-stone-900 tabular-nums">
                {formatMoney(bill.amount)}
              </span>
            </div>
          ))}
        </div>

        <div ref={payoffGroupRef} className="border-t border-stone-200 pt-4">
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
