// src/data/story.ts
// Shared types for the "Where Did My Money Go?" data layer + the mock async loader.

export type CategoryId =
  | 'dining'
  | 'shopping'
  | 'transportation'
  | 'subscriptions'
  | 'coffee'
  | 'entertainment';

export type PersonaId = 'alex' | 'jordan' | 'sam';

export interface Transaction {
  id: string;
  merchant: string;
  icon: string;
  amount: number;
  category: CategoryId;
}

export interface Bill {
  id: string;
  label: string;
  icon: string;
  amount: number;
}

export interface CategoryTotal {
  category: CategoryId;
  label: string;
  amount: number;
  color: string;
  /** 1 = highest spend within this persona's discretionary categories. */
  rank: number;
}

export interface GuessOption {
  id: string;
  label: string;
  category: CategoryId;
}

export interface Persona {
  id: PersonaId;
  name: string;
  /** One-line description shown on the replay card. Never expose the #1 category here. */
  vibe: string;
  /** Personalized intro line shown in the hook section. */
  intro?: string;
  paycheck: number;
  fixedExpenses: Bill[];
  transactions: Transaction[];
  categoryTotals: CategoryTotal[];
  discretionaryTotal: number;
  remainingAfterFixed: number;
  remainingFinal: number;
}

export interface Story {
  personas: Persona[];
  guessOptions: GuessOption[];
  defaultPersonaId: PersonaId;
}

/**
 * Mock "backend": returns the reconciled story data with a small artificial delay
 * so the UI can exercise a loading state. No network, no real financial data.
 */
export async function getStory(): Promise<Story> {
  const { STORY } = await import('./story.data');
  await new Promise((r) => setTimeout(r, 150));
  return STORY;
}

/** Convenience lookup used by the provider when switching personas. */
export function getPersona(story: Story, id: PersonaId): Persona {
  const p = story.personas.find((persona) => persona.id === id);
  if (!p) throw new Error(`Unknown persona: ${id}`);
  return p;
}
