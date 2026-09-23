import { useEffect, useRef } from 'react';
import { useStory } from '../../context/useStory';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { formatMoney } from '../../lib/format';

type ThemeMode = 'light' | 'dark';

export default function SectionRevealPause({ theme = 'light' }: { theme?: ThemeMode }) {
  const { activePersona } = useStory();
  const root = useRef<HTMLElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!activePersona) {
      return;
    }

    ScrollTrigger.refresh();
  }, [activePersona?.id]);

  useGSAP(
    () => {
      const valueEl = valueRef.current;
      const rootEl = root.current;

      if (!activePersona || !valueEl || !rootEl) {
        return;
      }

      const counter = { value: 0 };
      const paintValue = () => {
        valueEl.textContent = formatMoney(Math.round(counter.value));
      };

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
            counter.value = activePersona.discretionaryTotal;
            paintValue();
            gsap.set(rootEl, { autoAlpha: 1, y: 0 });
            gsap.set(valueEl, { opacity: 1, y: 0 });
            return;
          }

          gsap.set(valueEl, { opacity: 0, y: 20 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: rootEl,
              start: 'top 75%',
              end: isDesktop ? '+=60' : 'bottom 90%',
              scrub: true,
              pin: isDesktop,
            },
          });

          tl.to(valueEl, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0);
          tl.to(
            counter,
            { value: activePersona.discretionaryTotal, duration: 1.2, onUpdate: paintValue, ease: 'none' },
            0.2,
          );
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
      <div className={['rounded-[2rem] border p-6 sm:p-8', isDark ? 'border-slate-700 bg-slate-900 text-slate-50' : 'border-stone-200 bg-stone-950 text-stone-50'].join(' ')}>
        <p className={['text-sm font-medium uppercase tracking-[0.22em]', isDark ? 'text-slate-300' : 'text-stone-400'].join(' ')}>
          Those purchases didn&apos;t feel very big. Together, they were…
        </p>
        <div
          ref={valueRef}
          className="mt-6 text-5xl font-black tracking-[-0.08em] text-white tabular-nums sm:text-7xl"
        >
          {formatMoney(activePersona.discretionaryTotal)}
        </div>
      </div>
    </section>
  );
}
