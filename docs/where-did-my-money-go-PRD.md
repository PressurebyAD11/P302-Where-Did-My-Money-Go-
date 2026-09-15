# PRD — "Where Did My Money Go?" (P302)

**One-line:** A single, fully-responsive, scroll-driven page that turns a fictional paycheck into an interactive data story — *paycheck → transactions → guess → reveal → takeaway* — to make invisible small spending feel visible.

**Status:** Draft **v3** · **Owner:** _you_ · **Build target:** React + shadcn/ui, **GSAP ScrollTrigger**, mock data, built in VS Code with GitHub Copilot Agent

> **Decisions locked:** Animation = **GSAP ScrollTrigger** · Layout = **fully responsive, equal weight (mobile ⇄ desktop)** · Data = **three selectable personas, default on first run** · Persona switching is a **replay affordance at the end**, not an entry gate · Reveal chart is **discretionary-only** (fixed bills excluded) · **No audio** in v1. All reflected throughout; nothing left open blocks the build.

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
Each persona has its own reconciled numbers, and crucially a **different #1 category**, so the guess isn't the same twice. **Alex is the default** and runs on the first visit with no picker; the others are reached via "Try a different paycheck" at the end (§4 Part 3d). The #1 category is **internal** — it must never be shown on a persona card, or it spoils the guess. All numbers fictional and internally consistent (full data in Appendix A).

| Persona | Vibe (shown on card) | Paycheck | #1 category *(hidden from viewer)* | Discretionary total | Left over |
|---|---|---|---|---|---|
| **Alex** *(default)* | Young professional | $3,842 | Dining Out ($286) | $847 | $797 |
| **Jordan** | Car-free commuter | $3,410 | Transportation ($305) | $912 | $518 |
| **Sam** | Online shopper | $4,120 | Shopping ($342) | $968 | $792 |

Personas are easily extendable — the data layer is an array (§7).

---

## 4. The experience (narrative spec)

One long vertical scroll of ordered **sections**. Sections animate as they enter/scrub through the viewport via GSAP ScrollTrigger (§8). Native document scroll — short, deliberate **pins** are allowed for dramatic beats (§8), but no free-scroll hijacking.

### Part 0 — Hook (intro)
- Headline: **"Why does my paycheck disappear even when I don't feel like I'm spending that much?"**
- Subtext: *It's often not one big purchase. It's dozens of small decisions that become invisible until we look at them individually.*
- Reassurance: *No account creation. No bank connection. Just scroll.*

> **First run has no persona gate.** The story defaults to the `defaultPersonaId` (Alex) and flows straight from the hook into Part 1 — zero friction, no cold choice before the viewer has any context. Persona switching is a **replay affordance** surfaced only at the end (Part 3d). This keeps the first run's surprise intact; the persona choice appears once the viewer is primed to explore.

### Part 1 — Your paycheck arrives
- Large animated figure: **the active persona's paycheck** ("Your paycheck just hit.")
- Line: *Let's see where it goes.* · START cue.

### Part 2a — The expected expenses (fixed bills)
Predictable bills appear one by one; a **Remaining balance** counter drains from the paycheck amount.
- Bills and order come from the persona (Appendix A). Example (Alex): 🏠 Rent $1,450 · 🚗 Car $420 · 💡 Utilities $186 · 🛡️ Insurance $142 → **$1,644 left.**
- Beat line: *So far, everything looks about right. Continue scrolling.*

### Part 2b — The small purchases begin
The discretionary stream starts — many small transactions appear in sequence (staggered), each nudging the balance down. **Main animation:** the remaining-money number decreases as transactions appear. Pacing feels casual, then slightly relentless.

### Part 3-guess — "Where do you think the most money went?"  *(before the reveal)*
- Prompt: **"Where do you think the most money went?"**
- Fixed chips (single-select): **COFFEE · DINING · SHOPPING · RIDESHARE** (these four categories exist in every persona).
- Records the guess and advances. Optional — skipping yields neutral reveal copy.

### Part 3a — The reveal (pause)
- Everything stops. Whitespace. A beat.
- *Those purchases didn't feel very big. Together, they were…*
- Animated count-up to the persona's **discretionary total** (Alex: $847).

### Part 3b — Guess result  *(now computed per persona)*
Feedback is derived from the **selected persona's** ranked categories, not hardcoded. Logic (`guessFeedback(guess, persona)`):

| Case | Template |
|---|---|
| Guess == #1 | **Nailed it.** {topLabel} was #1 — **${topAmount}**. |
| Guessed category is rank #2 | **Close — but not quite.** #1 was {topLabel} (${topAmount}). {guessLabel} came in second at **${guessAmount}**. |
| Any other rank | **Not quite.** {guessLabel} landed {ordinal} at **${guessAmount}**. #1 was {topLabel} — **${topAmount}**. |
| No guess | **Here's where it actually went.** #1 was {topLabel} — **${topAmount}**. |

Optional per-category flavor overrides (nice touch): e.g. a Coffee guess → *"Coffee felt constant, but it only added up to ${guessAmount}."* Keep as an override map, defaulting to the templates above.

*Worked example (Alex, guessed SHOPPING):* "Close — but not quite. #1 was Dining Out ($286). Shopping came in second at $173."

### Part 3c — Category reveal (the chart)
Transactions reorganize into an animated horizontal bar chart. Bars grow from 0, staggered longest-first. Bars, amounts, and the max scale come from the **persona's** category totals. Example (Alex): Dining Out $286 (100%) · Shopping $173 · Transportation $142 · Subscriptions $94 · Coffee $87 · Entertainment $65 · **Total $847**.

> **Fixed bills are deliberately excluded from this chart.** The reveal is about the *invisible discretionary spend* only. Rent/car/etc. are the expected expenses the viewer already knows about, and at $1,450 vs. $286 they would dwarf the six discretionary bars and flatten the punchline. The chart shows discretionary categories exclusively; bills live only in Part 2a.

- Key insight: **"You didn't make one ${discretionaryTotal} purchase. You made dozens of small ones."**
- Close: *Your money didn't disappear. It went somewhere. Understanding where gives you the power to decide where it goes next.*
- Optional secondary beat (recommended): for Alex, the "invisible" $847 is **more than the $797 left over** — a quiet, punchy stat. Compute per persona (`discretionaryTotal` vs `remainingFinal`) and only show it when discretionary ≥ remaining.

**Replay / persona switch (this is where personas live):**
- **"Watch it again"** — replays the current persona; resets guess + animation state + scroll.
- **"Try a different paycheck"** — reveals the persona cards **here** (name + one-line vibe; **never the #1 category** — that would spoil the guess). Selecting one swaps the active persona, resets state, and scrolls back to Part 1 to run the story again with different numbers. Because each persona has a different #1 category, the guess stays meaningful on replay.
- This is the **only** place the persona picker appears — there is no upfront gate (see Part 0 note).

---

## 5. Functional requirements

- **FR1** One continuous vertical scroll with ordered sections.
- **FR2** First run uses `defaultPersonaId` with **no picker step**; the story flows straight from the hook into Part 1. All downstream numbers/copy read from the active persona.
- **FR3** Persona switching is offered **only at the end** (Part 3d, "Try a different paycheck"); selecting a persona swaps the active persona, resets state, and re-runs from Part 1. Persona cards must **not** display the #1 category.
- **FR4** Sections animate via GSAP ScrollTrigger on enter/scrub; entrances fire once per run (reset on restart/persona switch).
- **FR5** The **Remaining balance** counter animates as bills/transactions land; final value = persona `remainingFinal`.
- **FR6** Fixed expenses render in the persona's order and reduce balance to `remainingAfterFixed`.
- **FR7** Discretionary transactions stream staggered; per persona they sum exactly to `discretionaryTotal` and to each category subtotal.
- **FR8** The guess prompt offers exactly the four fixed chips (single-select) and is skippable.
- **FR9** The reveal count-up lands on the persona's `discretionaryTotal`.
- **FR10** Guess-result copy is computed by `guessFeedback(guess, persona)` per §4 Part 3b.
- **FR11** The category chart animates six bars proportional to the persona's category amounts (max = that persona's top category). **Fixed bills are excluded from this chart** (discretionary-only).
- **FR12** Restart ("Watch it again") resets guess, animation triggers, and scroll for the current persona; "Try a different paycheck" additionally swaps persona and re-runs.
- **FR13** Fully responsive: mobile and desktop are both first-class (see §11); GSAP behavior branches by breakpoint via `matchMedia`.
- **FR14** `prefers-reduced-motion: reduce` → skip transitions/scrub/pins, render final states; all copy/data still present.
- **FR15** Content is legible and correctly ordered even if animation JS fails (progressive enhancement).
- **FR16** No audio in v1 (no sound effects, no autoplay). Any reveal emphasis is visual/motion only.
- **FR17** No network calls to real services; all data from the mock module (§7).

---

## 6. Information architecture & components (React + shadcn/ui + GSAP)

Stack: **Vite + React + TypeScript + Tailwind + shadcn/ui**, animation via **GSAP + ScrollTrigger + @gsap/react (`useGSAP`)**.

### Component tree
```
<App>
  <StoryProvider>                 // activePersona, guess, phase, reset(), choosePersona()
    <ScrollProgressBar />         // thin top progress indicator
    <StoryContainer ref>          // GSAP scope (useGSAP) lives here
      <SectionHook />                 // Part 0    (no persona gate)
      <SectionPaycheck />             // Part 1    (HeroFigure, StartCue)
      <SectionFixedExpenses />        // Part 2a   (BillRow[], RemainingBalance)
      <SectionGuess />                // guess     (GuessChip[])
      <SectionSmallPurchases />       // Part 2b   (TransactionRow[], RemainingBalance)
      <SectionRevealPause />          // Part 3a   (CountUp -> discretionaryTotal)
      <SectionGuessResult />          // Part 3b   (reads guess + persona)
      <SectionCategoryReveal />       // Part 3c   (CategoryBar[], discretionary-only)
      <SectionTakeaway />             // Part 3d   (RestartButton, PersonaCard[] for replay)
    </StoryContainer>
  </StoryProvider>
</App>
```

### Shared / primitive components
- **`PersonaCard`** — selectable card rendered **inside the takeaway** for replay (name + vibe only, **never the #1 category**); `selected`, `onSelect`. (shadcn `Card` + selection ring.)
- **`RemainingBalance`** — animated counting number, `aria-live="polite"`; driven by GSAP (scrub or timeline).
- **`CountUp`** — one-shot number tween (paycheck, discretionary total).
- **`TransactionRow` / `BillRow`** — icon + label + amount; staggered entrance.
- **`GuessChip`** — selectable chip (shadcn `Button`/`Toggle`); `selected`, `onSelect`, `aria-pressed`.
- **`CategoryBar`** — label + animated bar + amount; `amount`, `max`, `color`, `index`.
- **`SectionShell`** — consistent vertical rhythm + max-width + a `data-section` hook GSAP targets.
- **`StoryText` / `SectionHeading`** — typographic primitives.

### shadcn/ui components
`Button`, `Card`, `Badge`, `Progress`, `Separator`, `Tooltip`. Category chart is **hand-rolled animated bars** (GSAP-controlled `div` widths) rather than a chart lib — tighter control over the "grow from zero, staggered" reveal.

### State model
```ts
type StoryState = {
  activePersonaId: PersonaId;         // starts at defaultPersonaId ('alex'); no picker on first run
  guess: CategoryId | null;
  setGuess: (c: CategoryId) => void;
  switchPersona: (id: PersonaId) => void;  // called from the takeaway; swaps persona, resets guess, re-runs
  replay: () => void;                 // "Watch it again" — same persona, reset guess + scroll
};
```
There is no `picking` phase — the first run has no gate. `switchPersona`/`replay` reset guess state, refresh GSAP triggers (§8), and scroll to Part 1. Section entrances are handled by GSAP triggers, not global state. Remaining balance is **derived** from scroll/timeline progress, not stored.

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
  vibe: string;                     // one-liner for the picker (no category spoiler)
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
3. **Persona plumbing** — `StoryProvider` with `activePersonaId` starting at `defaultPersonaId`; all sections read from the active persona. **No upfront picker** — first run just uses the default.
4. **GSAP foundation** — `lib/gsap.ts`, `useGSAP` scope, entrance triggers, `matchMedia` branches (desktop/mobile/reduced-motion), `ScrollTrigger.refresh()` on persona switch.
5. **Money mechanics** — scrubbed balance drain (fixed → `remainingAfterFixed`, discretionary → `remainingFinal`), hero count-ups (paycheck, discretionary total).
6. **Guess interaction** — chips + `guessFeedback(guess, persona)` + result section.
7. **Category reveal** — GSAP bar timeline, staggered longest-first, count-up amounts, pinned reveal beat (desktop). Discretionary categories only.
8. **Takeaway + replay** — closing copy, optional "more than what's left" stat, "Watch it again", and the `PersonaCard[]` switcher (no category shown); switching resets state and re-runs from Part 1.
9. **Polish** — scroll progress bar, responsive pass, loading/empty states, confirm no audio anywhere.
10. **QA & a11y** — keyboard nav, aria-live, contrast, reduced-motion, both breakpoints, all personas.

---

## 14. Testing & QA

- **Unit:** `guessFeedback(guess, persona)` correct across all cases for all personas (incl. no-guess); currency + ordinal formatting; **data-integrity assertions per persona** (category sums, discretionary total, `remainingFinal`).
- **Component:** each section renders active-persona copy/data; the takeaway's persona cards + guess chips are single-select and cards never expose the #1 category; balance region has `aria-live`.
- **Behavioral:** first run shows no picker and uses the default persona; reduced-motion renders final states without scrub/pin; "Watch it again" resets guess + scroll; "Try a different paycheck" swaps persona, resets state, refreshes triggers, and re-runs from Part 1.
- **Manual:** full scroll on phone + desktop; reveal lands as a surprise in informal testing; switch personas from the takeaway and confirm the #1 category (and guess feedback) changes; confirm no audio plays.

---

## 15. Analytics (mock, optional)

No-op `track(event, payload)` (console/in-memory) for: `story_start`, `guess_selected`, `reveal_viewed`, `replay`, `persona_switched` (from the takeaway). Swappable for a real sink later. No real tracking in v1.

---

## 16. Decisions & scope

All prior open questions are **resolved and locked** — nothing here blocks the build:

| Decision | Resolution |
|---|---|
| Animation stack | GSAP + ScrollTrigger + `useGSAP` |
| Layout | Fully responsive, equal weight; `matchMedia` branches |
| Data | Three selectable personas; **Alex is the default** and runs first with no picker |
| Persona picker placement | **End-of-story replay affordance only** (Part 3d); no upfront gate; cards never show the #1 category |
| Fixed bills in the reveal chart | **Excluded** — reveal is discretionary-only |
| Audio | **None** in v1 (no SFX, no autoplay) |

**Explicitly out of scope for v1 (future ideas, not blockers):** user-editable numbers / free-form personas, more than three personas, real analytics sink, shareable result links, localization. Add later without reworking the data layer (it's already an array).

---

## Appendix A — Full mock dataset (all fictional, all reconciled)

### Persona 1 — Alex · paycheck $3,842 · #1 Dining Out · left over $797  *(reference: full transaction list)*

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

**Fixed ($1,980 → remaining $1,430):** Rent $1,300 · Car $380 · Utilities $170 · Insurance $130
**Category totals (sum $912):** Transportation 305 (1) · Dining 210 (2) · Coffee 128 (3) · Shopping 115 (4) · Subscriptions 92 (5) · Entertainment 62 (6)
**Reconciliation:** 3410 − 1980 − 912 = **518**.
*Sample merchants* — Transportation: Uber, Lyft, Gas top-up, Parking, Transit pass, Airport ride · Dining: DoorDash, Lunch, Sushi, Brunch · Coffee: Starbucks, Latte, Cold brew.
> Build note: generate per-category transactions summing to each subtotal (the data-integrity test enforces it), or hand-author like Alex.

### Persona 3 — Sam · paycheck $4,120 · #1 Shopping · left over $792

**Fixed ($2,360 → remaining $1,760):** Rent $1,550 · Car $450 · Utilities $210 · Insurance $150
**Category totals (sum $968):** Shopping 342 (1) · Dining 224 (2) · Subscriptions 118 (3) · Transportation 106 (4) · Coffee 98 (5) · Entertainment 80 (6)
**Reconciliation:** 4120 − 2360 − 968 = **792**.
*Sample merchants* — Shopping: Amazon, Target, Clothing, Home goods, Online marketplace, Electronics · Dining: DoorDash, Dinner out, Brunch · Subscriptions: Streaming x2, Music, Cloud, Fitness app.
> Same build note as Jordan.

**Guess chips (all personas):** COFFEE→coffee · DINING→dining · SHOPPING→shopping · RIDESHARE→transportation

---

## Appendix B — Copy deck

- **Hook:** "Why does my paycheck disappear even when I don't feel like I'm spending that much?" / "It's often not one big purchase. It's dozens of small decisions that become invisible until we look at them individually." / "No account creation. No bank connection. Just scroll." *(flows straight into Paycheck — no persona step here.)*
- **Paycheck:** "Your paycheck just hit." · "+${paycheck}" · "Let's see where it goes." · START
- **Fixed expenses:** "${remainingAfterFixed} left." · "So far, everything looks about right. Continue scrolling."
- **Small purchases:** "Then the small purchases start."
- **Guess:** "Where do you think the most money went?" · [COFFEE] [DINING] [SHOPPING] [RIDESHARE]
- **Reveal pause:** "Those purchases didn't feel very big. Together, they were…" · "${discretionaryTotal}"
- **Guess result:** computed per persona — see §4 Part 3b.
- **Category reveal:** the active persona's six categories, longest-first.
- **Takeaway:** "You didn't make one ${discretionaryTotal} purchase. You made dozens of small ones." · "Your money didn't disappear. It went somewhere. Understanding where gives you the power to decide where it goes next."
- **Replay / persona switch (takeaway only):** [Watch it again] · "Try a different paycheck:" [Alex — young professional] [Jordan — car-free commuter] [Sam — online shopper] *(cards show name + vibe only — never the #1 category)*
