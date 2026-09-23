// src/lib/guessFeedback.test.ts
import { describe, it, expect } from 'vitest';
import { guessFeedback } from './guessFeedback';
import { STORY } from '../data/story.data';
import type { Persona, PersonaId } from '../data/story';

const byId = (id: PersonaId): Persona => {
  const p = STORY.personas.find((x) => x.id === id);
  if (!p) throw new Error(`missing persona ${id}`);
  return p;
};

const alex = byId('alex');
const jordan = byId('jordan');
const sam = byId('sam');

describe('guessFeedback — correct guess (#1)', () => {
  it('Alex guesses dining (the #1)', () => {
    const r = guessFeedback('dining', alex);
    expect(r.outcome).toBe('correct');
    expect(r.title).toBe('Nailed it.');
    expect(r.body).toBe('Dining Out was #1 — $286.');
    expect(r.topCategory.category).toBe('dining');
    expect(r.guessedCategory?.category).toBe('dining');
  });

  it('Jordan guesses transportation (the #1)', () => {
    const r = guessFeedback('transportation', jordan);
    expect(r.outcome).toBe('correct');
    expect(r.body).toBe('Transportation was #1 — $305.');
  });

  it('Sam guesses shopping (the #1)', () => {
    const r = guessFeedback('shopping', sam);
    expect(r.outcome).toBe('correct');
    expect(r.body).toBe('Shopping was #1 — $342.');
  });
});

describe('guessFeedback — close guess (#2)', () => {
  it('Alex guesses shopping (rank 2)', () => {
    const r = guessFeedback('shopping', alex);
    expect(r.outcome).toBe('close');
    expect(r.title).toBe('Close — but not quite.');
    expect(r.body).toBe('#1 was Dining Out ($286). Shopping came in second at $173.');
  });

  it('Jordan guesses dining (rank 2)', () => {
    const r = guessFeedback('dining', jordan);
    expect(r.outcome).toBe('close');
    expect(r.body).toBe('#1 was Transportation ($305). Dining Out came in second at $210.');
  });

  it('Sam guesses dining (rank 2)', () => {
    const r = guessFeedback('dining', sam);
    expect(r.outcome).toBe('close');
    expect(r.body).toBe('#1 was Shopping ($342). Dining Out came in second at $224.');
  });
});

describe('guessFeedback — off guess (rank >= 3)', () => {
  it('Alex guesses transportation (rank 3, generic template + ordinal)', () => {
    const r = guessFeedback('transportation', alex);
    expect(r.outcome).toBe('off');
    expect(r.title).toBe('Not quite.');
    expect(r.body).toBe('Transportation landed 3rd at $142. #1 was Dining Out — $286.');
  });

  it('Sam guesses transportation (rank 4 -> "4th")', () => {
    const r = guessFeedback('transportation', sam);
    expect(r.outcome).toBe('off');
    expect(r.body).toBe('Transportation landed 4th at $106. #1 was Shopping — $342.');
  });

  it('Jordan guesses shopping (rank 4 -> "4th")', () => {
    const r = guessFeedback('shopping', jordan);
    expect(r.outcome).toBe('off');
    expect(r.body).toBe('Shopping landed 4th at $115. #1 was Transportation — $305.');
  });
});

describe('guessFeedback — coffee flavor override (rank >= 3)', () => {
  it('Alex guesses coffee (rank 5) uses the flavor line, not the generic ordinal', () => {
    const r = guessFeedback('coffee', alex);
    expect(r.outcome).toBe('off');
    expect(r.body).toBe(
      'Coffee felt constant, but it only added up to $87. #1 was Dining Out — $286.',
    );
    expect(r.body).not.toContain('landed');
  });

  it('Jordan guesses coffee (rank 3) still uses the flavor line', () => {
    const r = guessFeedback('coffee', jordan);
    expect(r.body).toBe(
      'Coffee felt constant, but it only added up to $128. #1 was Transportation — $305.',
    );
  });
});

describe('guessFeedback — skipped', () => {
  it('null guess yields neutral reveal per persona', () => {
    expect(guessFeedback(null, alex)).toMatchObject({
      outcome: 'skipped',
      title: "Here's where it actually went.",
      body: '#1 was Dining Out — $286.',
      guessedCategory: null,
    });
    expect(guessFeedback(null, sam).body).toBe('#1 was Shopping — $342.');
  });
});

// ---- data-integrity sweep (the invariants the PRD requires) ----
describe('story data integrity', () => {
  const cents = (n: number) => Math.round(n * 100);

  it.each(STORY.personas.map((p) => [p.id, p] as const))(
    '%s reconciles: fixed, discretionary, categories, leftover',
    (_id, p) => {
      const fixed = p.fixedExpenses.reduce((s, b) => s + cents(b.amount), 0);
      const disc = p.transactions.reduce((s, t) => s + cents(t.amount), 0);

      expect(cents(p.paycheck) - fixed).toBe(cents(p.remainingAfterFixed));
      expect(disc).toBe(cents(p.discretionaryTotal));
      expect(cents(p.remainingAfterFixed) - disc).toBe(cents(p.remainingFinal));

      // each category subtotal matches its categoryTotals entry
      for (const ct of p.categoryTotals) {
        const sub = p.transactions
          .filter((t) => t.category === ct.category)
          .reduce((s, t) => s + cents(t.amount), 0);
        expect(sub).toBe(cents(ct.amount));
      }

      // ranks are a clean 1..6 permutation
      const ranks = p.categoryTotals.map((c) => c.rank).sort((a, b) => a - b);
      expect(ranks).toEqual([1, 2, 3, 4, 5, 6]);

      // the four guess chips map to categories that exist
      for (const opt of STORY.guessOptions) {
        expect(p.categoryTotals.some((c) => c.category === opt.category)).toBe(true);
      }
    },
  );
});
