import { Button } from './ui/button';
import { useAuth } from '../context/useAuth';

function getInitials(name: string | null | undefined) {
  if (!name) {
    return '?';
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2) || '?';
}

export function Header() {
  const { isAuthenticated, user } = useAuth();

  const handleLoginClick = () => {
    console.log('Log in clicked');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-[0.18em] text-stone-500 uppercase">
            Where Did My Money Go?
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoginClick}
              className="rounded-full border-stone-300 bg-white text-stone-800 shadow-none hover:bg-stone-100"
            >
              Log in
            </Button>
          ) : (
            <div className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-2 py-1.5 shadow-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
                {getInitials(user?.name ?? null)}
              </div>
              <span className="text-sm font-medium text-stone-700">{user?.name}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
