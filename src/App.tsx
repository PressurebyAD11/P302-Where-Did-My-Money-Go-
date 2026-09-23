import { type FormEvent, useEffect, useRef, useState } from 'react';
import { StoryProvider } from './context/StoryProvider';
import { useStory } from './context/useStory';
import { Header } from './components/Header';
import { ScrollTrigger } from './lib/gsap';
import SectionHook from './components/sections/SectionHook';
import SectionPaycheck from './components/sections/SectionPaycheck';
import SectionFixedExpenses from './components/sections/SectionFixedExpenses';
import SectionSmallPurchases from './components/sections/SectionSmallPurchases';
import SectionGuess from './components/sections/SectionGuess';
import SectionRevealPause from './components/sections/SectionRevealPause';
import SectionGuessResult from './components/sections/SectionGuessResult';
import SectionCategoryReveal from './components/sections/SectionCategoryReveal';
import SectionTakeaway from './components/sections/SectionTakeaway';

type MockBankAccount = {
  bank: string;
  type: string;
  last4: string;
  balance: string;
  status: string;
};

type MockUser = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  profileLabel: string;
  linkedAccounts: MockBankAccount[];
  monthlyIncome: string;
  monthlySpending: string;
  availableCash: string;
};

type AuthMode = 'login' | 'create';

const MOCK_USERS: MockUser[] = [
  {
    id: 'alex-rivera',
    fullName: 'Alex Rivera',
    email: 'alex@example.com',
    password: 'Password123!',
    profileLabel: 'Mock profile',
    monthlyIncome: '$5,600',
    monthlySpending: '$3,940',
    availableCash: '$4,280.72',
    linkedAccounts: [
      {
        bank: 'Chase',
        type: 'Checking',
        last4: '4241',
        balance: '$4,280.72',
        status: 'Connected securely',
      },
      {
        bank: 'Capital One',
        type: 'Savings',
        last4: '1182',
        balance: '$12,640.08',
        status: 'Connected securely',
      },
    ],
  },
  {
    id: 'jordan-lee',
    fullName: 'Jordan Lee',
    email: 'jordan@example.com',
    password: 'Password123!',
    profileLabel: 'Mock profile',
    monthlyIncome: '$7,250',
    monthlySpending: '$4,820',
    availableCash: '$9,410.33',
    linkedAccounts: [
      {
        bank: 'Bank of America',
        type: 'Checking',
        last4: '6194',
        balance: '$9,410.33',
        status: 'Connected securely',
      },
      {
        bank: 'Wells Fargo',
        type: 'Savings',
        last4: '8821',
        balance: '$18,220.91',
        status: 'Connected securely',
      },
    ],
  },
  {
    id: 'sam-patel',
    fullName: 'Sam Patel',
    email: 'sam@example.com',
    password: 'Password123!',
    profileLabel: 'Mock profile',
    monthlyIncome: '$4,900',
    monthlySpending: '$3,710',
    availableCash: '$2,940.76',
    linkedAccounts: [
      {
        bank: 'Capital One',
        type: 'Checking',
        last4: '3360',
        balance: '$2,940.76',
        status: 'Connected securely',
      },
      {
        bank: 'Chase',
        type: 'Savings',
        last4: '7712',
        balance: '$7,805.58',
        status: 'Connected securely',
      },
    ],
  },
];

const EMPTY_FORM = {
  fullName: '',
  email: '',
  password: '',
  bankName: 'Chase',
};

const USER_PERSONA_MAP = {
  'Alex Rivera': 'alex',
  'Jordan Lee': 'jordan',
  'Sam Patel': 'sam',
} as const;

function getMockUserForPersona(personaId: keyof typeof USER_PERSONA_MAP | string | null, fallback: MockUser | null): MockUser | null {
  if (!fallback) {
    return null;
  }

  if (!personaId) {
    return fallback;
  }

  const matchedUser = MOCK_USERS.find((user) => USER_PERSONA_MAP[user.fullName as keyof typeof USER_PERSONA_MAP] === personaId);
  return matchedUser ?? fallback;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2);
}

function ProfileSummary({ user }: { user: MockUser }) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">
            {getInitials(user.fullName)}
          </div>
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">
              {user.profileLabel}
            </p>
            <h2 className="text-xl font-semibold text-stone-900">{user.fullName}</h2>
          </div>
        </div>

        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          Secure sync enabled
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-medium tracking-[0.16em] text-stone-500 uppercase">Available cash</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{user.availableCash}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-medium tracking-[0.16em] text-stone-500 uppercase">Monthly income</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{user.monthlyIncome}</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-medium tracking-[0.16em] text-stone-500 uppercase">Monthly spending</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">{user.monthlySpending}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold tracking-[0.16em] text-stone-500 uppercase">Account overview</h3>
          <span className="text-xs text-stone-500">{user.linkedAccounts.length} linked accounts</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {user.linkedAccounts.map((account) => (
            <div key={`${account.bank}-${account.last4}`} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-stone-900">{account.bank}</p>
                  <p className="text-xs text-stone-500">{account.type} •••• {account.last4}</p>
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-medium tracking-wide text-emerald-700 uppercase">
                  {account.status}
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">{account.balance}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthModal({
  mode,
  form,
  error,
  onModeChange,
  onClose,
  onFormChange,
  onSubmit,
}: {
  mode: AuthMode;
  form: typeof EMPTY_FORM;
  error: string;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onFormChange: (field: keyof typeof EMPTY_FORM, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-stone-500 uppercase">Secure access</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-900">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-200 px-2.5 py-1 text-sm text-stone-600 transition hover:bg-stone-100"
            aria-label="Close account dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === 'create' && (
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="block text-sm font-medium text-stone-700">Full name</label>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(event) => onFormChange('fullName', event.target.value)}
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
                placeholder="Jordan Lee"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-stone-700">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => onFormChange('email', event.target.value)}
              className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => onFormChange('password', event.target.value)}
              className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
              placeholder="At least 8 characters"
            />
          </div>

          {mode === 'create' && (
            <div className="space-y-1.5">
              <label htmlFor="bankName" className="block text-sm font-medium text-stone-700">Linked bank</label>
              <select
                id="bankName"
                value={form.bankName}
                onChange={(event) => onFormChange('bankName', event.target.value)}
                className="h-11 w-full rounded-2xl border border-stone-200 bg-stone-50 px-3 text-sm text-stone-900 outline-none transition focus:border-stone-400 focus:bg-white"
              >
                <option value="Chase">Chase</option>
                <option value="Bank of America">Bank of America</option>
                <option value="Wells Fargo">Wells Fargo</option>
                <option value="Capital One">Capital One</option>
              </select>
            </div>
          )}

          {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => onModeChange(mode === 'login' ? 'create' : 'login')}
              className="text-sm font-medium text-stone-600 transition hover:text-stone-900"
            >
              {mode === 'login' ? 'Create account' : 'Log in'}
            </button>

            <button
              type="submit"
              className="rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              {mode === 'login' ? 'Continue' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LandingExperience({ onOpenAuth }: { onOpenAuth: (mode?: AuthMode) => void }) {
  const featureCards = [
    {
      title: 'Connect your accounts',
      text: 'See cash flow, spending trends, and recurring bills in one clean view.',
    },
    {
      title: 'Follow the story',
      text: 'Explore realistic money scenarios through guided, interactive personas.',
    },
    {
      title: 'Take action',
      text: 'Turn patterns into smarter decisions with clear, motivating next steps.',
    },
  ];

  const trustPoints = ['25k+ habits tracked', 'Bank-level mock security', 'Built for clarity, not guilt'];

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white/95 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-stone-500">
            Smarter money habits
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.07em] text-stone-900 sm:text-5xl lg:text-6xl">
            See where your money goes before it disappears.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
            Where Did My Money Go? helps people connect the dots between income, recurring bills, and small decisions that quietly add up.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenAuth('create')}
              className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Try it today
            </button>
            <a
              href="#story"
              className="rounded-full border border-stone-200 bg-stone-50 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              See how it works
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium tracking-[0.14em] text-stone-500 uppercase">
            {trustPoints.map((point) => (
              <span key={point} className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-2">
                {point}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-stone-50 p-4 sm:p-5">
          <div className="flex items-center justify-between text-sm text-stone-600">
            <span>Weekly snapshot</span>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-emerald-700 uppercase">
              On track
            </span>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-[0.62rem] font-medium tracking-[0.2em] text-stone-500 uppercase">Income</p>
              <p className="mt-1 text-3xl font-black tracking-[-0.06em] text-stone-900">$5,600</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-stone-200">
              <div className="h-full w-[72%] rounded-full bg-stone-900" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-stone-600">
              <div className="rounded-2xl bg-white p-3">
                <p className="text-[0.6rem] font-medium tracking-[0.18em] text-stone-500 uppercase">Bills</p>
                <p className="mt-2 text-xl font-bold text-stone-900">$2,430</p>
              </div>
              <div className="rounded-2xl bg-white p-3">
                <p className="text-[0.6rem] font-medium tracking-[0.18em] text-stone-500 uppercase">Left</p>
                <p className="mt-2 text-xl font-bold text-stone-900">$1,910</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {featureCards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-base shadow-sm">
              ✓
            </div>
            <h2 className="text-lg font-semibold text-stone-900">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PersonaStoryView({ user }: { user: MockUser }) {
  const { activePersona, guess } = useStory();

  return (
    <section className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-3 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
            Personalized demo
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-[-0.06em] text-stone-900">
            Your spending story for {activePersona?.name ?? user.fullName.split(' ')[0]}
          </h3>
        </div>
        <div className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600">
          Curated for {activePersona?.name ?? user.fullName}
        </div>
      </div>

      <div id="story" className="mx-auto max-w-3xl space-y-6">
        <SectionHook />
        <SectionPaycheck />
        <SectionFixedExpenses />
        <SectionSmallPurchases />
        <SectionGuess />
        <SectionGuessResult />
        {guess && <SectionCategoryReveal />}
        {guess && <SectionRevealPause />}
        <SectionTakeaway />
      </div>
    </section>
  );
}

function StoryLayout({
  session,
  onOpenAuth,
  onLogout,
}: {
  session: MockUser | null;
  onOpenAuth: (mode?: AuthMode) => void;
  onLogout: () => void;
}) {
  const { activePersonaId } = useStory();
  const displayedSession = session ? getMockUserForPersona(activePersonaId, session) : null;

  return (
    <>
      <Header session={displayedSession} onOpenAuth={onOpenAuth} onLogout={onLogout} />
      <main className="min-h-screen bg-stone-100 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {!session && <LandingExperience onOpenAuth={onOpenAuth} />}
          {session && displayedSession && (
            <>
              <ProfileSummary user={displayedSession} />
              <PersonaStoryView user={displayedSession} />
            </>
          )}
        </div>
      </main>
    </>
  );
}

function PersonaSessionBridge({ session }: { session: MockUser | null }) {
  const { activePersonaId, switchPersonaNoScroll } = useStory();
  const hasAppliedSessionPersona = useRef(false);

  useEffect(() => {
    if (!session) {
      hasAppliedSessionPersona.current = false;
      return;
    }

    const personaId = USER_PERSONA_MAP[session.fullName as keyof typeof USER_PERSONA_MAP];
    if (!personaId) {
      return;
    }

    if (!hasAppliedSessionPersona.current) {
      hasAppliedSessionPersona.current = true;
      if (activePersonaId !== personaId) {
        switchPersonaNoScroll(personaId);
      }
    }
  }, [session, switchPersonaNoScroll, activePersonaId]);

  return null;
}

function App() {
  const [session, setSession] = useState<MockUser | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  const handleOpenAuth = (mode: AuthMode = 'login') => {
    setAuthMode(mode);
    setError('');
    setForm(EMPTY_FORM);
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
    setError('');
    setForm(EMPTY_FORM);
  };

  const handleFormChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = form.email.trim().toLowerCase();

    if (authMode === 'login') {
      const matchingUser = MOCK_USERS.find(
        (user) => user.email.toLowerCase() === normalizedEmail && user.password === form.password,
      );

      if (!matchingUser) {
        setError('We could not find that account. Try alex@example.com with Password123!.');
        return;
      }

      setSession(matchingUser);
      setIsAuthOpen(false);
      setForm(EMPTY_FORM);
      setError('');
      return;
    }

    if (!form.fullName.trim()) {
      setError('Please add your full name to finish creating an account.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (form.password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }

    const createdUser: MockUser = {
      id: `user-${Date.now()}`,
      fullName: form.fullName.trim(),
      email: normalizedEmail,
      password: form.password,
      profileLabel: 'Mock profile',
      linkedAccounts: [
        {
          bank: form.bankName || 'Chase',
          type: 'Checking',
          last4: '9012',
          balance: '$2,460.91',
          status: 'Connected securely',
        },
        {
          bank: 'Bank of America',
          type: 'Savings',
          last4: '2224',
          balance: '$6,830.55',
          status: 'Connected securely',
        },
      ],
    };

    setSession(createdUser);
    setIsAuthOpen(false);
    setForm(EMPTY_FORM);
    setError('');
  };

  const handleLogout = () => {
    setSession(null);
    setAuthMode('login');
    setIsAuthOpen(false);
  };

  return (
    <StoryProvider>
      <PersonaSessionBridge session={session} />
      <StoryLayout session={session} onOpenAuth={handleOpenAuth} onLogout={handleLogout} />
      {isAuthOpen && (
        <AuthModal
          mode={authMode}
          form={form}
          error={error}
          onModeChange={(nextMode) => {
            setAuthMode(nextMode);
            setError('');
          }}
          onClose={handleCloseAuth}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
        />
      )}
    </StoryProvider>
  );
}

export default App;
