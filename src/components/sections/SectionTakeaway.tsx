import { useEffect, useRef } from 'react';
import { useStory } from '../../context/useStory';
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap';

type ThemeMode = 'light' | 'dark';

export default function SectionTakeaway({ theme = 'light' }: { theme?: ThemeMode }) {
  const { activePersona } = useStory();
  const root = useRef<HTMLElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!activePersona) {
      return;
    }

    ScrollTrigger.refresh();
  }, [activePersona?.id]);

  useGSAP(
    () => {
      const rootEl = root.current;
      const insightEl = insightRef.current;

      if (!activePersona || !rootEl || !insightEl) {
        return;
      }

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
            gsap.set(rootEl, { autoAlpha: 1, y: 0 });
            gsap.set(insightEl, { opacity: 1, y: 0 });
            return;
          }

          gsap.set(insightEl, { opacity: 0, y: 16 });

          gsap.to(insightEl, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: rootEl,
              start: 'top 75%',
              end: isDesktop ? 'bottom 55%' : 'bottom 80%',
              toggleActions: 'play none none reverse',
            },
          });
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
      <div className={['rounded-[2rem] border p-6 sm:p-8', isDark ? 'border-slate-700 bg-slate-900' : 'border-stone-200 bg-stone-50'].join(' ')}>
        <div ref={insightRef}>
          <p className={['text-base font-medium', isDark ? 'text-slate-200' : 'text-stone-700'].join(' ')}>
            Your money didn&apos;t disappear. It went somewhere. Understanding where gives you the power to decide where it goes next.
          </p>
        </div>

        <div className={['mt-8 rounded-2xl border p-4 text-base', isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-stone-200 bg-white text-stone-700'].join(' ')}>
          Keep a small-weekly budget for convenience spending: set a cap for takeout, rideshares, and impulse buys, then move that amount into a "fun money" bucket so the dozen little purchases stop quietly eating the paycheck.
        </div>
      </div>
    </section>
  );
}
