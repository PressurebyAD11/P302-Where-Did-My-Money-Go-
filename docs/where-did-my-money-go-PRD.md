# PRD — "Where Did My Money Go?" (P302)

**One-line:** A single, fully-responsive, scroll-driven page that turns a fictional paycheck into an interactive data story — *pick a persona → START → transactions → guess → guess result → category breakdown → total → takeaway* — to make invisible small spending feel visible.

**Status:** **v4 (as-built)** · **Owner:** _you_ · **Build target:** React + shadcn/ui, **GSAP ScrollTrigger**, mock data, built in VS Code with GitHub Copilot Agent

> **v4 reflects the shipped app.** Changes since v3, all live: persona picker now lives in **Part 0** (Alex pre-selected, optional) and is **removed from the end**; a **START** button initiates the story and smooth-scrolls into it; the reveal sequence is **reordered** (guess → guess result → category bars → total as the closer); each persona has a **spoiler-free intro line**; the category card's closing line dropped its redundant dollar amount; the category bars and the total are **gated behind the guess** via parent-level conditional rendering; the end button is **"Try another paycheck"** (resets state + returns to Part 0). Locked earlier and still true: GSAP ScrollTrigger · fully responsive · three personas · discretionary-only reveal chart · no audio.

---

## 1. Summary

Most people can't explain why their paycheck vanishes even when they don't feel like big spenders. The answer is rarely one large purchase — it's dozens of small, forgettable ones. This app dramatizes that realization as a scroll-driven narrative using **fictional data only**. The viewer just scrolls: a fictional paycheck arrives, money drains away transaction by transaction, they make **one guess** about where the most money went, and then the reveal lands — a handful of "invisible" purchases that quietly added up. At the end they can replay with a different persona whose spending breaks down differently.

This is an **interactive data story**, not a personal-finance app. No account creation, no bank connection, no manual financial input. Interaction (persona pick, guess, animations) is *icing on a linear narrative* — the story must read top-to-bottom on its own.

| It IS | It ISN'T |
|---|---|
| A polished scrollytelling experience, equal-weight on mobile and desktop | A budgeting or expense-tracking product |
| Driven by a small set of fixed fictional personas | Connected to real bank/financial data |
| One meaningful interaction (the guess) before the reveal | A dashboard with many controls |
| Emotionally-paced: setup → tension → payoff | A neutral chart page |

---

## 2. Problem & goals

**Core question:** *"Why does my paycheck disappear even when I don't feel like I'm spending that much?"*

**POV:** It's usually not one big purchase — it's dozens of small decisions that stay invisible until you look at them individually.

### Goals
- **G1 — Deliver the "aha."** The viewer should be surprised the small purchases summed to a big number.
- **G2 — Make it effortless.** Zero setup, no choices up front; just scroll.
- **G3 — One moment of participation.** The guess makes the reveal personal.
- **G4 — Land a hopeful takeaway.** "Your money didn't disappear — it went somewhere. Knowing where gives you power to decide."
- **G5 — Replayable.** Different personas → different #1 category → the guess stays interesting on a second run.

### Non-goals
- No auth, no persistence of real data, no financial advice.
- No real analytics backend (mock event hooks only).
- No user-editable numbers in v1 (personas are pre-authored; free-form editing is a later idea).

### Success signals (qualitative — data is fictional)
- A first-time viewer picks a persona and completes the scroll to the takeaway.
- The reveal reads as a genuine surprise (usability testing).
- The page is fully legible with animations disabled (reduced-motion / progressive enhancement).

---

## 3. Target user & personas

**Viewer:** young professional / everyday consumer, arriving cold from a link, on **any device**.

### In-story fictional personas (v1 ships three)
Each persona has its own reconciled numbers, and crucially a **different #1 category**, so the guess isn't the same twice. **Alex is the default** and pre-selected in the Part 0 picker; the viewer can switch to Jordan or Sam before pressing START (§4 Part 0). The #1 category is **internal** — it must never be shown on a persona card or intro line, or it spoils the guess. Each persona also carries a short **spoiler-free intro line** shown in Part 0. All numbers fictional and internally consistent (full data in Appendix A).

| Persona | Vibe (on card) | Paycheck | #1 category *(hidden)* | Discretionary | Left over | Intro line |
|---|---|---|---|---|---|---|
| **Alex** *(default)* | Young professional | $3,842 | Dining Out ($286) | $847 | $797 | "Meet Alex. Steady paycheck, big city, and a nagging feeling the money vanishes too fast." |
| **Jordan** | Car-free commuter | $3,410 | Transportation ($305) | $912 | $518 | "Meet Jordan. Careful with the big stuff, still somehow short at month's end." |
| **Sam** | Online shopper | $4,120 | Shopping ($342) | $968 | $792 | "Meet Sam. Does everything 'right,' and still can't explain where it all goes." |

Note the intro lines are deliberately **category-neutral** — none hint at dining, transport, shopping, or coffee. Personas are easily extendable — the data layer is an array (§7).

---

## 4. The experience (narrative spec)

One long vertical scroll of ordered **sections**. Sections animate as they enter/scrub through the viewport via GSAP ScrollTrigger (§8). Native document scroll — short, deliberate **pins** are allowed for dramatic beats (§8), but no free-scroll hijacking.

### Part 0 — Hook + persona pick + START
- Headline: **"Why does my paycheck disappear even when I don't feel like I'm spending that much?"**
- Subtext: *It's often not one big purchase. It's dozens of small decisions that become invisible until we look at them individually.*
- Reassurance: *No account creation. No bank connection. Just scroll.*
- **Per-persona intro line** (spoiler-free — see §3): e.g. *"Meet Alex. Steady paycheck, big city, and a nagging feeling the money vanishes too fast."* Plus a small persona-name label.
- **Persona picker** (three cards: Alex / Jordan / Sam — name + vibe only, **never the #1 category**). **Alex is pre-selected**; choosing is **optional**. Tapping a card swaps the active persona and **resets guess state, staying in place** (no scroll — the viewer is already at the top).
- **START button** — begins the story with the currently selected persona and **smooth-scrolls** into Part 2a (the fixed-expenses section, tagged `data-section="fixed-expenses"`). START is a real `<button>` with hover/active states; a viewer who ignores the picker just presses START and runs Alex.

> **Design note (why the picker is here, not at the end).** Earlier drafts placed the picker as an end-of-story replay affordance. It now lives in Part 0 so the persona choice reads as part of the opening, while START stays the single "begin" gate. Because Alex is pre-selected, there's no forced cold choice — the first-run friction the old design avoided is preserved.

### Part 1 — Your paycheck arrives
- Large animated figure: **the active persona's paycheck** ("Your paycheck just hit.")
- Line: *Let's see where it goes.* (START, above, is the affordance that advances here.)

### Part 2a — The expected expenses (fixed bills)
Predictable bills appear one by one; a **Remaining balance** counter drains from the paycheck amount.
- Bills and order come from the persona (Appendix A). Example (Alex): 🏠 Rent $1,450 · 🚗 Car $420 · 💡 Utilities $186 · 🛡️ Insurance $142 → **$1,644 left.**
- Payoff line **"$1,644 left. So far, everything looks about right. Continue scrolling."** is gated to appear only after the drain completes (§8 payoff gating).

### Part 2b — The small purchases begin
The discretionary stream starts — many small transactions appear staggered, each nudging the balance down toward `remainingFinal`. **Main animation:** the remaining-money number decreases as transactions appear. Pacing feels casual, then slightly relentless.

### Part 3-guess — "Where do you think the most money went?"
- Prompt: **"Where do you think the most money went?"**
- Fixed chips (single-select): **COFFEE · DINING · SHOPPING · RIDESHARE** (these four categories exist in every persona).
- **The guess is the gate for everything below it.** Until a chip is clicked, the guess result, the category bars, and the total do **not** render (see gating note below). This makes the reveal something the viewer earns by participating.

### Part 3b — Guess result  *(computed per persona; renders only after a guess)*
Feedback is derived from the **selected persona's** ranked categories, not hardcoded. Logic (`guessFeedback(guess, persona)`):

| Case | Template |
|---|---|
| Guess == #1 | **Nailed it.** {topLabel} was #1 — **${topAmount}**. |
| Guessed category is rank #2 | **Close — but not quite.** #1 was {topLabel} (${topAmount}). {guessLabel} came in second at **${guessAmount}**. |
| Any other rank | **Not quite.** {guessLabel} landed {ordinal} at **${guessAmount}**. #1 was {topLabel} — **${topAmount}**. |
| No guess | **Here's where it actually went.** #1 was {topLabel} — **${topAmount}**. |

Optional per-category flavor overrides: e.g. a Coffee guess → *"Coffee felt constant, but it only added up to ${guessAmount}."* Override map, defaulting to the templates above. *Worked example (Alex, guessed SHOPPING):* "Close — but not quite. #1 was Dining Out ($286). Shopping came in second at $173."

### Part 3c — Category reveal (the bars)  *(renders only after a guess)*
An animated horizontal bar chart. Bars grow from 0 on scroll, staggered longest-first, per-category colors; amounts count up. Bars/amounts/scale come from the **persona's** category totals. Example (Alex): Dining Out $286 (100%) · Shopping $173 · Transportation $142 · Subscriptions $94 · Coffee $87 · Entertainment $65.
- Closing line: **"You didn't make one big purchase. You made dozens of small ones."** (generic — no dollar amount, since the total below carries the number; avoids redundancy).

> **Fixed bills are deliberately excluded from this chart** — discretionary categories only. Rent/car dwarf the six bars and would flatten the punchline; bills live only in Part 2a.
>
> **Implementation caution — bars.** The fill is a colored child element inside each track; animate its **`width`** (Tailwind v4's transform system can override GSAP `scaleX`, and animating a missing/absent fill silently no-ops — both were real bugs). The initial `width:0` must live in `gsap.set`/CSS, **not** as an inline JSX `transform`, or React re-renders stomp it.

### Part 3d — The total  *(the closer; renders only after a guess)*
- Everything stops. Whitespace. A beat. *Those purchases didn't feel very big. Together, they were…*
- Animated count-up to the persona's **discretionary total** (Alex $847 · Jordan $912 · Sam $968), landing as the **final** beat of the reveal — the number is the payoff, so it comes *after* the breakdown, not before.

### Part 3e — Takeaway
- Close: *Your money didn't disappear. It went somewhere. Understanding where gives you the power to decide where it goes next.*
- Optional secondary stat: **"This is more than the ${remainingFinal} left over."** (Alex: $847 discretionary > $797 left) — shown only when `discretionaryTotal ≥ remainingFinal`.
- **"Try another paycheck"** button — **resets all story state (guess cleared) and returns to Part 0**, where the viewer can pick a different persona (or the same one) and run again. This is the sole replay affordance; it doubles as restart + re-pick. (Formerly two buttons, "Watch it again" / "Try a different paycheck"; consolidated into one.)

> **Gating note (how the guess gates the reveal).** `SectionGuessResult`, `SectionCategoryReveal`, and the total (`SectionRevealPause`) are all hidden until `guess` is non-null. This is done by **conditionally rendering them from the parent (`App.tsx`)** — e.g. `{guess && <SectionCategoryReveal />}` — **not** by an early `return null` inside those components. The internal-early-return approach crashes React (Rules of Hooks: an early return placed after `useGSAP`/`useRef` renders fewer hooks on the gated pass). `SectionGuessResult` can use an internal guard because it has no hooks; the hook-heavy sections must be gated by the parent.

---

## 5. Functional requirements

- **FR1** One continuous vertical scroll with ordered sections.
- **FR2** Part 0 shows the persona picker with **Alex pre-selected**; choosing is optional. Tapping a card swaps the active persona and resets guess state **in place** (no scroll). All downstream numbers/copy read from the active persona.
- **FR3** A **START** button in Part 0 begins the story and smooth-scrolls to the fixed-expenses section (`data-section="fixed-expenses"`) with the currently selected persona.
- **FR4** Each persona shows a spoiler-free **intro line** in Part 0; no card or intro line displays the #1 category.
- **FR5** Sections animate via GSAP ScrollTrigger on enter/scrub; entrances fire once per run (reset on "Try another paycheck").
- **FR6** The **Remaining balance** counter animates as bills/transactions land; final value = persona `remainingFinal`.
- **FR7** Fixed expenses render in the persona's order and reduce balance to `remainingAfterFixed`; the "…left / looks about right" payoff line is gated until the drain completes.
- **FR8** Discretionary transactions stream staggered; per persona they sum exactly to `discretionaryTotal` and to each category subtotal.
- **FR9** The guess prompt offers exactly the four fixed chips (single-select).
- **FR10** **The guess gates the reveal:** the guess result, category bars, and total render **only after** a chip is clicked. Implemented via parent-level conditional rendering in `App.tsx` (not internal early-returns in the hook-heavy sections — see §4 gating note).
- **FR11** Reveal order is **guess → guess result → category bars → total**. Guess-result copy is computed by `guessFeedback(guess, persona)` (§4 Part 3b).
- **FR12** The category chart animates six bars (animating **width**, colored fill child) proportional to the persona's category amounts, longest-first; the count-up total lands as the **final** beat. Fixed bills excluded.
- **FR13** "Try another paycheck" **resets all state (guess cleared) and returns to Part 0**; it is the sole replay/restart affordance.
- **FR14** Fully responsive: mobile and desktop are both first-class (see §11); GSAP behavior branches by breakpoint via `matchMedia`.
- **FR15** `prefers-reduced-motion: reduce` → skip transitions/scrub/pins, render final states; all copy/data still present.
- **FR16** Content is legible and correctly ordered even if animation JS fails (progressive enhancement).
- **FR17** No audio in v1 (no sound effects, no autoplay). Any reveal emphasis is visual/motion only.
- **FR18** No network calls to real services; all data from the mock module (§7).

---

## 6. Information architecture & components (React + shadcn/ui + GSAP)

Stack: **Vite + React + TypeScript + Tailwind + shadcn/ui**, animation via **GSAP + ScrollTrigger + @gsap/react (`useGSAP`)**.

### Component tree
```
<App>                              // reads `guess` from context; gates reveal sections below
  <StoryProvider>                  // activePersona, guess, choosePersona(), setGuess(), reset()
    <ScrollProgressBar />          // thin top progress indicator (optional)
    <StoryContainer ref>           // GSAP scope (useGSAP) lives here
      <SectionHook />                  // Part 0  (headline, intro line, PersonaCard[], START)
      <SectionPaycheck />              // Part 1  (HeroFigure; START lives here / in Hook)
      <SectionFixedExpenses />         // Part 2a (BillRow[], RemainingBalance) — data-section="fixed-expenses"
      <SectionSmallPurchases />        // Part 2b (TransactionRow[], RemainingBalance)
      <SectionGuess />                 // guess   (GuessChip[])
      {guess && <SectionGuessResult />}     // Part 3b — gated behind guess
      {guess && <SectionCategoryReveal />}  // Part 3c — gated behind guess (bars, discretionary-only)
      {guess && <SectionRevealPause />}     // Part 3d — gated behind guess (CountUp -> total; the closer)
      <SectionTakeaway />              // Part 3e (takeaway copy + "Try another paycheck")
    </StoryContainer>
  </StoryProvider>
</App>
```
The three `{guess && …}` gates are the parent-level rendering that makes the reveal conditional on the guess without violating the Rules of Hooks (§4 gating note). Note the reveal order: guess result → category bars → total.

### Shared / primitive components
- **`PersonaCard`** — selectable card rendered **in Part 0** (name + vibe only, **never the #1 category**); `selected`, `onSelect`. Alex pre-selected. (shadcn `Card` + selection ring.)
- **`RemainingBalance`** — animated counting number, `aria-live="polite"`; driven by GSAP (scrub or timeline).
- **`CountUp`** — one-shot number tween (paycheck, discretionary total).
- **`TransactionRow` / `BillRow`** — icon + label + amount; staggered entrance.
- **`GuessChip`** — selectable chip (shadcn `Button`/`Toggle`); `selected`, `onSelect`, `aria-pressed`.
- **`CategoryBar`** — label + animated bar (colored **fill child**, animate `width`) + amount; `amount`, `max`, `color`, `index`.
- **`SectionShell`** — consistent vertical rhythm + max-width + a `data-section` hook GSAP/START target.
- **`StoryText` / `SectionHeading`** — typographic primitives.

### shadcn/ui components
`Button`, `Card`, `Badge`, `Progress`, `Separator`, `Tooltip`. Category chart is **hand-rolled animated bars** (GSAP-controlled fill `width`) rather than a chart lib — tighter control over the "grow from zero, staggered" reveal.

### State model
```ts
type StoryState = {
  activePersonaId: PersonaId;         // starts at 'alex' (pre-selected in Part 0)
  guess: CategoryId | null;
  choosePersona: (id: PersonaId) => void;  // Part 0 pick: swap persona, reset guess, stay in place
  setGuess: (c: CategoryId) => void;
  reset: () => void;                  // "Try another paycheck": clear guess + all state, scroll to Part 0
};
```
Section entrances are handled by GSAP triggers, not global state. Remaining balance is **derived** from scroll/timeline progress, not stored. `reset()` returns to Part 0 (where the picker lives), so it doubles as restart + re-pick.

---

## 7. Mock "backend" / data layer

No server. A typed module simulates async fetch and holds all personas.

```ts
// src/data/story.ts
export type CategoryId =
  | 'dining' | 'shopping' | 'transportation'
  | 'subscriptions' | 'coffee' | 'entertainment';
export type PersonaId = 'alex' | 'jordan' | 'sam';

export interface Transaction { id: string; merchant: string; icon: string; amount: number; category: CategoryId; }
export interface Bill        { id: string; label: string; icon: string; amount: number; }
export interface CategoryTotal { category: CategoryId; label: string; amount: number; color: string; rank: number; }
export interface GuessOption { id: string; label: string; category: CategoryId; }

export interface Persona {
  id: PersonaId;
  name: string;
  vibe: string;                     // one-liner for the picker card (no category spoiler)
  intro: string;                    // Part 0 intro line (spoiler-free — no category hint)
  paycheck: number;
  fixedExpenses: Bill[];            // sums to paycheck - remainingAfterFixed
  transactions: Transaction[];      // sums to discretionaryTotal
  categoryTotals: CategoryTotal[];  // sums to discretionaryTotal
  discretionaryTotal: number;
  remainingAfterFixed: number;
  remainingFinal: number;
}

export interface Story { personas: Persona[]; guessOptions: GuessOption[]; defaultPersonaId: PersonaId; }

export async function getStory(): Promise<Story> {
  await new Promise(r => setTimeout(r, 150)); // simulate async
  return STORY; // from ./story.data.ts (Appendix A)
}
```

**Data-integrity rules (enforce with tests, per persona):**
`sum(transactions) === discretionaryTotal`, each category subtotal === its `categoryTotals.amount`, `paycheck − sum(fixedExpenses) === remainingAfterFixed`, and `remainingAfterFixed − discretionaryTotal === remainingFinal`. The four guess chips (dining/shopping/transportation/coffee) must exist in every persona's `categoryTotals`.

---

## 8. Animation & scroll mechanics (GSAP ScrollTrigger)

**Setup**
- Install `gsap` and `@gsap/react`. Register once: `gsap.registerPlugin(ScrollTrigger, useGSAP)`.
- Scope all animation to `StoryContainer` with the **`useGSAP`** hook (handles context + cleanup automatically). Never leak triggers across renders.

**Patterns**
1. **Entrance (toggle) triggers** — section reveals fire on enter: `ScrollTrigger` `start: 'top 70%'`, `toggleActions: 'play none none reverse'`. Used for headings, bill rows, chips, chart section.
2. **Scrubbed money drain** — tie the **Remaining balance** to scroll progress with `scrub: true`, so money visibly drains as the viewer scrolls the transactions section. Animate a proxy object `{ val }` with `onUpdate` writing formatted currency into the DOM. Transactions can reveal at timeline keyframes as the scrub advances.
3. **Pinned reveal beat** — pin the reveal section briefly (`pin: true`, short scroll distance) so the "everything stops → $XXX count-up" lands as a held moment. Keep pins short.
4. **Category bars** — a timeline triggered on the reveal section: bars tween width `0 → target%` with `stagger`, longest-first, amounts counting up alongside.

**Payoff gating (REQUIRED — the core storytelling rule).** Every section's payoff/conclusion must stay hidden until its own scroll animation completes; it is revealed as the **final step of that section's scrubbed timeline** (start it at `opacity: 0`, then `tl.to(payoff, { opacity: 1, y: 0 })` after the last content tween). A conclusion must never be visible before the buildup that earns it — this is a story, and stories don't show the ending first. Because it's part of the scrubbed timeline (not a timer or `toggleActions`), it also hides again when the viewer scrolls back up, staying in sync with scroll position. In reduced-motion, the payoff is simply present with the final values. Apply this to, at minimum:
   - **Fixed expenses** → "${remainingAfterFixed} left. So far, everything looks about right." appears only after the balance lands on `remainingAfterFixed` and all bills have revealed. *(reference implementation — done)*
   - **Small purchases** → the section's closing beat appears only after the stream has run and the balance reaches `remainingFinal`.
   - **Reveal ($847)** → the `discretionaryTotal` count-up stays hidden until the viewer has scrolled through the transaction stream (this is also what prevents the reveal from spoiling the guess).
   - **Category bars** → bars grow from `0`; never render pre-filled.
   - **Takeaway** → the closing insight appears only after the category reveal completes.
   Related interaction gate (not scroll-based): **`SectionGuessResult` renders nothing while `guess === null`** — the result is conditional on the interaction existing, so the answer is never shown before the viewer guesses. *(done)*

**Responsive branching** — wrap setup in **`gsap.matchMedia()`**:
- `(min-width: 768px)` → allow scrub + the pinned reveal.
- `(max-width: 767px)` → lighter scrub, **avoid pinning** (pins feel awkward on short mobile viewports); use plain entrance triggers + timeline count-ups instead.
- `(prefers-reduced-motion: reduce)` → no scrub, no pin; set final states immediately (opacity fade at most).

`matchMedia` auto-cleans each branch on breakpoint/preference change. Refresh `ScrollTrigger.refresh()` after fonts/images load and on persona change (layout height changes when persona data differs).

---

## 9. Visual & content design

- **Layout:** single centered narrative column, max width ~600–720px, generous vertical whitespace (each section ~one viewport). Designed to feel intentional on **both** phone and desktop.
- **Type:** large, editorial. Hero numbers (paycheck, discretionary total) are oversized, tabular figures.
- **Color:** restrained neutral base; one accent for "money in," a muted tone for the draining balance, six distinct-but-harmonious category colors. Calm, not alarmist.
- **Tone:** plain, honest, non-judgmental — a realization, not a scolding. Full copy in Appendix B.
- **Icons:** `lucide-react` (`Coffee`, `ShoppingBag`, `Car`, `Home`, `Zap`, `Shield`, …) or emoji — pick one system and stay consistent.

---

## 10. Accessibility

- Semantic landmarks; each section is a `<section>` with a heading in order.
- Persona cards and guess chips are real buttons: keyboard-focusable, `aria-pressed`, visible focus ring.
- Balance updates in an `aria-live="polite"` region.
- Respect `prefers-reduced-motion` (via `matchMedia` branch).
- Color is never the only signal (bars labeled with category + amount).
- Contrast meets WCAG AA.

---

## 11. Responsive behavior (equal weight)

- **Mobile:** single column, thumb-reachable persona cards + chips, hero numbers scale down but stay dominant, no pinning (§8).
- **Desktop:** same narrative column centered; the extra vertical room is used for the **pinned reveal beat** and slightly richer scrub pacing. Do **not** reflow into the multi-column layout of the concept PDF (that's the design doc, not the app).
- Test the two GSAP `matchMedia` branches independently; verify `ScrollTrigger.refresh()` on resize/orientation change.

---

## 12. Tech stack & project structure

```
src/
  main.tsx
  App.tsx
  index.css                 // Tailwind + tokens
  components/
    ui/                     // shadcn generated
    story/
      PersonaCard.tsx
      RemainingBalance.tsx
      CountUp.tsx
      TransactionRow.tsx
      BillRow.tsx
      GuessChip.tsx
      CategoryBar.tsx
      SectionShell.tsx
    sections/
      SectionHook.tsx
      SectionPaycheck.tsx
      SectionFixedExpenses.tsx
      SectionGuess.tsx
      SectionSmallPurchases.tsx
      SectionRevealPause.tsx
      SectionGuessResult.tsx
      SectionCategoryReveal.tsx
      SectionTakeaway.tsx     // hosts PersonaCard[] for replay
  context/
    StoryProvider.tsx
  lib/
    gsap.ts                 // plugin registration + matchMedia helpers
    guessFeedback.ts        // Part 3b logic (guess + persona -> copy)
    format.ts               // currency formatting, ordinals
  data/
    story.ts                // types + getStory()
    story.data.ts           // Appendix A dataset (all personas)
```

**Setup steps:** Vite React-TS → Tailwind → `npx shadcn@latest init` → add `button card badge progress separator tooltip` → `npm i gsap @gsap/react lucide-react`.

---

## 13. Build plan / milestones (sized for a Copilot Agent)

1. **Scaffold** — Vite + TS + Tailwind + shadcn init, folder structure, `story.ts` + `story.data.ts` (all 3 personas, Appendix A), passing **data-integrity tests** for every persona.
2. **Static story** — all sections rendered in *final-state* with correct copy/data for the default persona; correct order; native scroll; no animation.
3. **Persona plumbing** — `StoryProvider` with `activePersonaId` starting at `'alex'`; all sections read from the active persona. Part 0 persona picker (Alex pre-selected, optional; tapping resets guess in place).
4. **GSAP foundation** — `lib/gsap.ts`, `useGSAP` scope, entrance triggers, `matchMedia` branches (desktop/mobile/reduced-motion), `ScrollTrigger.refresh()` after layout / persona change.
5. **Money mechanics** — scrubbed balance drain (fixed → `remainingAfterFixed`, discretionary → `remainingFinal`), hero count-ups (paycheck, total). Payoff lines gated until each drain completes.
6. **Guess interaction** — chips + `guessFeedback(guess, persona)` + result section. The guess gates the reveal (parent-level `{guess && …}` rendering).
7. **Category reveal** — GSAP bar timeline animating fill **width**, staggered longest-first, count-up amounts, per-category colors. Discretionary only.
8. **START + reveal order + takeaway** — wire START to smooth-scroll into the story; order the reveal guess → result → bars → total; takeaway copy + "Try another paycheck" (resets all state, returns to Part 0).
9. **Polish** — scroll progress bar, responsive pass, loading/empty states, confirm no audio anywhere.
10. **QA & a11y** — keyboard nav, aria-live, contrast, reduced-motion, both breakpoints, all personas.

---

## 14. Testing & QA

- **Unit:** `guessFeedback(guess, persona)` correct across all cases for all personas (incl. no-guess); currency + ordinal formatting; **data-integrity assertions per persona** (category sums, discretionary total, `remainingFinal`).
- **Component:** each section renders active-persona copy/data; the Part 0 persona cards + guess chips are single-select and cards never expose the #1 category; balance region has `aria-live`.
- **Behavioral:** Part 0 defaults to Alex; picking Jordan/Sam then pressing START runs that persona's numbers throughout; the guess result, bars, and total stay hidden until a chip is clicked; reduced-motion renders final states without scrub/pin; "Try another paycheck" clears the guess and returns to Part 0 (so the reveal is hidden again until a new guess).
- **Manual:** full scroll on phone + desktop; pick a non-default persona in Part 0 and confirm every section shows its numbers; reveal lands as a surprise; confirm no audio plays.

---

## 15. Analytics (mock, optional)

No-op `track(event, payload)` (console/in-memory) for: `persona_selected` (Part 0), `story_start` (START), `guess_selected`, `reveal_viewed`, `restart` ("Try another paycheck"). Swappable for a real sink later. No real tracking in v1.

---

## 16. Decisions & scope

All decisions are **resolved and reflected in the shipped app**:

| Decision | Resolution (as built) |
|---|---|
| Animation stack | GSAP + ScrollTrigger + `useGSAP` |
| Layout | Fully responsive, equal weight; `matchMedia` branches |
| Data | Three selectable personas; Alex pre-selected |
| Persona picker placement | **Part 0** (Alex pre-selected, optional); removed from the end; cards never show the #1 category |
| Entry | **START** button begins the story and smooth-scrolls in |
| Reveal order | guess → guess result → category bars → **total (closer)** |
| Reveal gating | guess result, bars, and total render only after a guess (parent-level `{guess && …}`) |
| Persona intro lines | one spoiler-free line per persona in Part 0 |
| Category card closing line | "You didn't make one big purchase…" (no dollar amount) |
| Replay | single **"Try another paycheck"** button: clears state, returns to Part 0 |
| Fixed bills in the reveal chart | **Excluded** — discretionary-only |
| Audio | **None** (no SFX, no autoplay) |

**Explicitly out of scope for v1 (future ideas, not blockers):** user-editable numbers / free-form personas, more than three personas, real analytics sink, shareable result links, localization. Add later without reworking the data layer (it's already an array).

---

## Appendix A — Full mock dataset (all fictional, all reconciled)

### Persona 1 — Alex · paycheck $3,842 · #1 Dining Out · left over $797  *(reference: full transaction list)*

**Vibe:** Young professional · **Intro:** "Meet Alex. Steady paycheck, big city, and a nagging feeling the money vanishes too fast."

**Fixed ($2,198 → remaining $1,644):** Rent $1,450 · Car $420 · Utilities $186 · Insurance $142

**Discretionary transactions (49 items, sum $847.00):**
- *Dining Out — $286.00:* DoorDash 24.16 · Lunch 19.42 · Drinks 37.82 · Chipotle 14.87 · Pizza Night 28.50 · Thai Takeout 32.15 · Brunch 26.40 · Sushi 41.20 · Late-night snack 11.48 · Deli sandwich 9.60 · Tacos 12.90 · Burger 27.50
- *Shopping — $173.00:* Online Shopping 31.84 · Target 43.16 · Amazon 22.99 · Clothing 38.51 · Home goods 19.50 · Impulse buy 17.00
- *Transportation — $142.00:* Uber 18.22 · Uber 21.40 · Lyft 16.85 · Gas top-up 34.10 · Parking 12.00 · Rideshare 23.43 · Transit pass 16.00
- *Subscriptions — $94.00:* Streaming 16.99 · Music 10.99 · Cloud storage 9.99 · News 12.00 · Fitness app 14.99 · Gaming 17.04 · Newsletter 12.00
- *Coffee — $87.00:* Starbucks 7.42 · Coffee 6.91 · Latte 5.75 · Cold brew 6.25 · Cappuccino 5.50 · Coffee shop 8.10 · Starbucks 7.20 · Local roaster 9.40 · Iced coffee 5.60 · Mocha 6.90 · Flat white 5.87 · Drip coffee 4.75 · Espresso 7.35
- *Entertainment — $65.00:* Movie tickets 28.00 · Concert add-on 18.50 · App store game 9.99 · Event fee 8.51

**Category totals:** Dining 286 (1) · Shopping 173 (2) · Transportation 142 (3) · Subscriptions 94 (4) · Coffee 87 (5) · Entertainment 65 (6)
**Reconciliation:** 3842 − 2198 − 847 = **797**.

### Persona 2 — Jordan · paycheck $3,410 · #1 Transportation · left over $518

**Vibe:** Car-free commuter · **Intro:** "Meet Jordan. Careful with the big stuff, still somehow short at month's end."

**Fixed ($1,980 → remaining $1,430):** Rent $1,300 · Car $380 · Utilities $170 · Insurance $130
**Category totals (sum $912):** Transportation 305 (1) · Dining 210 (2) · Coffee 128 (3) · Shopping 115 (4) · Subscriptions 92 (5) · Entertainment 62 (6)
**Reconciliation:** 3410 − 1980 − 912 = **518**.
*Sample merchants* — Transportation: Uber, Lyft, Gas top-up, Parking, Transit pass, Airport ride · Dining: DoorDash, Lunch, Sushi, Brunch · Coffee: Starbucks, Latte, Cold brew.
> Build note: generate per-category transactions summing to each subtotal (the data-integrity test enforces it), or hand-author like Alex.

### Persona 3 — Sam · paycheck $4,120 · #1 Shopping · left over $792

**Vibe:** Online shopper · **Intro:** "Meet Sam. Does everything 'right,' and still can't explain where it all goes."

**Fixed ($2,360 → remaining $1,760):** Rent $1,550 · Car $450 · Utilities $210 · Insurance $150
**Category totals (sum $968):** Shopping 342 (1) · Dining 224 (2) · Subscriptions 118 (3) · Transportation 106 (4) · Coffee 98 (5) · Entertainment 80 (6)
**Reconciliation:** 4120 − 2360 − 968 = **792**.
*Sample merchants* — Shopping: Amazon, Target, Clothing, Home goods, Online marketplace, Electronics · Dining: DoorDash, Dinner out, Brunch · Subscriptions: Streaming x2, Music, Cloud, Fitness app.
> Same build note as Jordan.

**Guess chips (all personas):** COFFEE→coffee · DINING→dining · SHOPPING→shopping · RIDESHARE→transportation

---

## Appendix B — Copy deck

- **Part 0 (Hook + pick + START):** "Why does my paycheck disappear even when I don't feel like I'm spending that much?" / "It's often not one big purchase. It's dozens of small decisions that become invisible until we look at them individually." / "No account creation. No bank connection. Just scroll." / persona intro line (per §3) / persona cards [Alex — Young professional] [Jordan — Car-free commuter] [Sam — Online shopper] *(name + vibe only, Alex pre-selected)* / [START]
- **Paycheck (Part 1):** "Your paycheck just hit." · "+${paycheck}" · "Let's see where it goes."
- **Fixed expenses:** "${remainingAfterFixed} left." · "So far, everything looks about right. Continue scrolling." *(gated until the drain completes)*
- **Small purchases:** "Then the small purchases start."
- **Guess:** "Where do you think the most money went?" · [COFFEE] [DINING] [SHOPPING] [RIDESHARE] *(gates everything below)*
- **Guess result** *(after guess)*: computed per persona — see §4 Part 3b.
- **Category reveal** *(after guess)*: the active persona's six categories, longest-first · closing line "You didn't make one big purchase. You made dozens of small ones." *(generic — no dollar amount)*
- **Total** *(after guess; the closer):* "Those purchases didn't feel very big. Together, they were…" · "${discretionaryTotal}"
- **Takeaway:** "Your money didn't disappear. It went somewhere. Understanding where gives you the power to decide where it goes next." · optional "This is more than the ${remainingFinal} left over." · [Try another paycheck] *(resets all state + returns to Part 0)*
