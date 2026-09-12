// src/lib/guessFeedback.ts
// Computes the guess-result copy (PRD §4 Part 3b) from the selected guess and the
// active persona. All copy is derived from the persona's ranked categories, so the
// same four chips produce different feedback per persona.

import type { CategoryId, CategoryTotal, Persona } from '../data/story';
import { formatMoney, ordinal } from './format';

export type GuessOutcome = 'correct' | 'close' | 'off' | 'skipped';

export interface GuessFeedback {
  outcome: GuessOutcome;
  /** Short, emphasized lead-in (e.g. "Nailed it."). Style prominently in the UI. */
  title: string;
  /** Supporting sentence(s). */
  body: string;
  /** The #1 category — handy for highlighting the winning bar. */
  topCategory: CategoryTotal;
  /** The category the viewer guessed, or null if they skipped. */
  guessedCategory: CategoryTotal | null;
}

/**
 * Optional per-category flavor for wrong guesses (rank >= 3). Lets a category that
 * "feels" big but isn't get a knowing line instead of the generic template.
 * Return the leading clause only; the "#1 was X" tail is appended automatically.
 */
const FLAVOR: Partial<Record<CategoryId, (amount: string) => string>> = {
  coffee: (amount) => `Coffee felt constant, but it only added up to ${amount}.`,
};

function topOf(persona: Persona): CategoryTotal {
  const top = persona.categoryTotals.find((c) => c.rank === 1);
  if (!top) throw new Error(`Persona ${persona.id} has no rank-1 category`);
  return top;
}

export function guessFeedback(
  guess: CategoryId | null,
  persona: Persona,
): GuessFeedback {
  const top = topOf(persona);
  const topStr = formatMoney(top.amount);

  // No guess (or an unknown category) -> neutral reveal.
  const guessed =
    guess == null
      ? null
      : persona.categoryTotals.find((c) => c.category === guess) ?? null;

  if (!guessed) {
    return {
      outcome: 'skipped',
      title: "Here's where it actually went.",
      body: `#1 was ${top.label} — ${topStr}.`,
      topCategory: top,
      guessedCategory: null,
    };
  }

  const guessStr = formatMoney(guessed.amount);

  if (guessed.rank === 1) {
    return {
      outcome: 'correct',
      title: 'Nailed it.',
      body: `${top.label} was #1 — ${topStr}.`,
      topCategory: top,
      guessedCategory: guessed,
    };
  }

  if (guessed.rank === 2) {
    return {
      outcome: 'close',
      title: 'Close — but not quite.',
      body: `#1 was ${top.label} (${topStr}). ${guessed.label} came in second at ${guessStr}.`,
      topCategory: top,
      guessedCategory: guessed,
    };
  }

  // Any other rank: use a flavor override if one exists, else the generic template.
  const flavor = FLAVOR[guessed.category];
  const lead = flavor
    ? flavor(guessStr)
    : `${guessed.label} landed ${ordinal(guessed.rank)} at ${guessStr}.`;

  return {
    outcome: 'off',
    title: 'Not quite.',
    body: `${lead} #1 was ${top.label} — ${topStr}.`,
    topCategory: top,
    guessedCategory: guessed,
  };
}
