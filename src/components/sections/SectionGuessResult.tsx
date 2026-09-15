import { useStory } from '../../context/useStory';
import { guessFeedback } from '../../lib/guessFeedback';

export default function SectionGuessResult() {
  const { activePersona, guess } = useStory();

  if (!activePersona || guess === null) {
    return null;
  }

  const result = guessFeedback(guess, activePersona);

  return (
    <section className="py-10">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
          Guess result
        </p>
        <h3 className="mt-4 text-3xl font-black tracking-[-0.06em] text-stone-900">
          {result.title}
        </h3>
        <p className="mt-4 text-lg leading-relaxed text-stone-700">{result.body}</p>
      </div>
    </section>
  );
}
