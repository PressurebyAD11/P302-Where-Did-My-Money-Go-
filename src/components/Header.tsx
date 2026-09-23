import { useStory } from '../context/useStory';

type HeaderProps = {
  session: { fullName: string; email: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
};

export function Header({ session, onOpenAuth, onLogout }: HeaderProps) {
  const { activePersonaId, switchPersona } = useStory();
  const personaOptions = [
    { id: 'alex', label: 'Alex' },
    { id: 'jordan', label: 'Jordan' },
    { id: 'sam', label: 'Sam' },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0 text-left">
          <p className="truncate text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
            WHERE DID MY MONEY GO?
          </p>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-2 sm:flex">
                {personaOptions.map((persona) => {
                  const selected = activePersonaId === persona.id;

                  return (
                    <button
                      key={persona.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => switchPersona(persona.id)}
                      className={[
                        'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
                        selected
                          ? 'bg-stone-900 text-white'
                          : 'bg-white text-stone-700 hover:bg-stone-200',
                      ].join(' ')}
                    >
                      {persona.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-stone-200 bg-stone-100 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-200"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-stone-200 bg-stone-100 px-2.5 py-1.5 text-[10px] font-medium tracking-[0.14em] text-stone-600 uppercase sm:flex">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                3 demo profiles
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="rounded-full bg-stone-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
