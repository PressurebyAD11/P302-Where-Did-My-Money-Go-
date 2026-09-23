import { useStory } from '../context/useStory';

type HeaderProps = {
  session: { fullName: string; email: string } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

export function Header({ session, onOpenAuth, onLogout, theme, onToggleTheme }: HeaderProps) {
  const { activePersonaId, switchPersona } = useStory();
  const personaOptions = [
    { id: 'alex', label: 'Alex' },
    { id: 'jordan', label: 'Jordan' },
    { id: 'sam', label: 'Sam' },
  ] as const;
  const isDark = theme === 'dark';

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b backdrop-blur-sm',
        isDark ? 'border-slate-800 bg-slate-950/85' : 'border-[#c7cbdb] bg-[#f0f1f5]/95',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0 text-left">
          <p className={['truncate text-sm font-semibold tracking-[0.18em] uppercase', isDark ? 'text-slate-100' : 'text-[#20294c]'].join(' ')}>
            WHERE DID MY MONEY GO?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className={[
              'rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition',
              isDark
                ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700'
                : 'border-[#c7cbdb] bg-white text-[#20294c] hover:bg-[#f0f1f5]',
            ].join(' ')}
          >
            {isDark ? 'Light' : 'Dark'}
          </button>

          {session ? (
            <>
              <div
                className={[
                  'hidden items-center gap-2 rounded-full border px-2.5 py-2 shadow-[rgba(32,41,76,0.10)_0px_1px_4px_0px] sm:flex',
                  isDark ? 'border-slate-700 bg-slate-900' : 'border-[#c7cbdb] bg-white',
                ].join(' ')}
              >
                {personaOptions.map((persona) => {
                  const selected = activePersonaId === persona.id;

                  return (
                    <button
                      key={persona.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => switchPersona(persona.id)}
                      className={[
                        'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all',
                        selected
                          ? isDark
                            ? 'bg-slate-100 text-slate-900 shadow-sm'
                            : 'bg-[#20294c] text-white'
                          : isDark
                            ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                            : 'bg-[#f0f1f5] text-[#20294c] hover:bg-[#e9ebf0]',
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
                className={[
                  'rounded-full border px-3 py-2 text-sm font-medium transition',
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700'
                    : 'border-[#c7cbdb] bg-white text-[#20294c] hover:bg-[#f0f1f5]',
                ].join(' ')}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <div
                className={[
                  'hidden items-center gap-2 rounded-full border px-2.5 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase shadow-[rgba(32,41,76,0.10)_0px_1px_4px_0px] sm:flex',
                  isDark ? 'border-slate-700 bg-slate-900 text-slate-200' : 'border-[#c7cbdb] bg-white text-[#20294c]',
                ].join(' ')}
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-[#459af8]" />
                3 demo profiles
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className={[
                  'rounded-full px-3 py-2 text-sm font-semibold transition',
                  isDark ? 'bg-sky-500 text-white hover:bg-sky-400' : 'bg-[#20294c] text-white hover:bg-[#375390]',
                ].join(' ')}
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
