# GSAP reference — how to use it

`SectionFixedExpensesRef.tsx` is a **worked, commented example** of the animation approach for the whole app. It isn't meant to replace anything yet — it's the pattern Copilot should copy when you reach **Milestone 4 (GSAP foundation)**.

## Where it goes
Drop it at `src/components/sections/SectionFixedExpensesRef.tsx`. The `Ref` suffix keeps it separate from the static `SectionFixedExpenses.tsx` Copilot already built in Milestone 2, so nothing is overwritten.

## Try it live (optional)
Temporarily render it in `App.tsx` with a persona to see the scrubbed drain:

```tsx
import { SectionFixedExpensesRef } from "@/components/sections/SectionFixedExpensesRef";
import { STORY } from "@/data/story.data";

// somewhere in the tree:
<SectionFixedExpensesRef persona={STORY.personas[0]} />
```

Scroll slowly through it: the four bills fade in one by one and the big "Remaining" number counts down from **$3,842** to **$1,644** locked to your scroll position. Then remove the temporary render.

## Verify it compiles
After adding the file:

```bash
npm run build      # must stay ✓ (this type-checks the JSX too)
npx vitest run     # must stay 15/15 — this file doesn't touch the data layer
```

## The four things to copy from it
1. **`useGSAP(() => {…}, { scope: root, dependencies: [persona.id], revertOnUpdate: true })`** — auto cleanup, and re-runs cleanly on persona switch.
2. **`scrub: true`** on the ScrollTrigger — progress follows the scrollbar.
3. **Number animation** — tween a proxy `{ value }` object and write `formatMoney(Math.round(value))` into the DOM on `onUpdate`.
4. **`gsap.matchMedia()`** — desktop / mobile / `prefers-reduced-motion` branches; the reduced branch lands on the final state with no motion.

## Applying it to the other sections (same skeleton)
- **Small purchases stream** → more rows, finer stagger; drain to `remainingFinal`.
- **Category reveal bars** → tween each bar `width: 0 → (amount / topAmount) * 100%` with a stagger, longest first.
- **Reveal pause ($847)** → add `pin: true` to the ScrollTrigger for the held beat; count a proxy *up* to `discretionaryTotal`.

## Milestone 4 prompt for Copilot

> Read `docs/PRD.md` §8 and study `src/components/sections/SectionFixedExpensesRef.tsx` as the animation reference. Implement **Milestone 4 (GSAP foundation)**: fold that scrubbed `useGSAP` + `ScrollTrigger` + `matchMedia` pattern into the real `SectionFixedExpenses.tsx` (staggered bill reveal + balance drain to `remainingAfterFixed`) and add entrance triggers to the other sections. Keep the reduced-motion and progressive-enhancement behavior from the reference. Call `ScrollTrigger.refresh()` after the active persona changes. Don't modify the tests, `src/data/`, or `src/lib/format.ts` / `guessFeedback.ts`. Run `npm run build` and `npx vitest run` and report both.
