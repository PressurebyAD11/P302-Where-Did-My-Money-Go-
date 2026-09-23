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

type ThemeMode = 'light' | 'dark';

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

function ProfileSummary({ user, theme }: { user: MockUser; theme: ThemeMode }) {
  const isDark = theme === 'dark';

  return (
    <section
      className={[
        'rounded-[2rem] border p-5 shadow-[rgba(32,41,76,0.10)_0px_12px_30px_0px] sm:p-6',
        isDark ? 'border-slate-700 bg-slate-900' : 'border-stone-200 bg-white',
      ].join(' ')}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={['flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold', isDark ? 'bg-white text-slate-900' : 'bg-stone-900 text-white'].join(' ')}>
            {getInitials(user.fullName)}
          </div>
          <div>
            <p className={['text-xs font-medium tracking-[0.18em] uppercase', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>
              {user.profileLabel}
            </p>
            <h2 className={['text-xl font-semibold', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>{user.fullName}</h2>
          </div>
        </div>

        <div className={['rounded-full border px-3 py-1 text-sm font-medium', isDark ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-emerald-200 bg-emerald-50 text-emerald-700'].join(' ')}>
          Secure sync enabled
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Available cash', value: user.availableCash },
          { label: 'Monthly income', value: user.monthlyIncome },
          { label: 'Monthly spending', value: user.monthlySpending },
        ].map((item) => (
          <div key={item.label} className={['rounded-2xl border p-4', isDark ? 'border-slate-700 bg-slate-800/80' : 'border-stone-200 bg-stone-50'].join(' ')}>
            <p className={['text-xs font-medium tracking-[0.16em] uppercase', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>{item.label}</p>
            <p className={['mt-2 text-2xl font-semibold tracking-tight', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className={['text-sm font-semibold tracking-[0.16em] uppercase', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>Account overview</h3>
          <span className={['text-xs', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>{user.linkedAccounts.length} linked accounts</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {user.linkedAccounts.map((account) => (
            <div key={`${account.bank}-${account.last4}`} className={['rounded-2xl border p-4', isDark ? 'border-slate-700 bg-slate-800/80' : 'border-stone-200 bg-stone-50'].join(' ')}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={['text-sm font-semibold', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>{account.bank}</p>
                  <p className={['text-xs', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>{account.type} •••• {account.last4}</p>
                </div>
                <span className={['rounded-full px-2 py-1 text-[10px] font-medium tracking-wide uppercase', isDark ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white text-emerald-700'].join(' ')}>
                  {account.status}
                </span>
              </div>
              <p className={['mt-3 text-2xl font-semibold tracking-tight', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>{account.balance}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuthModal({
  form,
  error,
  onClose,
  onFormChange,
  onSubmit,
  theme,
}: {
  form: typeof EMPTY_FORM;
  error: string;
  onClose: () => void;
  onFormChange: (field: keyof typeof EMPTY_FORM, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  theme: ThemeMode;
}) {
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/45 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className={['w-full max-w-md rounded-3xl border p-6 shadow-2xl', isDark ? 'border-slate-700 bg-slate-900' : 'border-stone-200 bg-white'].join(' ')}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className={['text-xs font-medium tracking-[0.18em] uppercase', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>Secure access</p>
            <h2 className={['mt-2 text-2xl font-semibold', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>Welcome back</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={['rounded-full border px-2.5 py-1 text-sm transition', isDark ? 'border-slate-600 bg-slate-700 text-slate-100 hover:bg-slate-600' : 'border-stone-200 text-stone-600 hover:bg-stone-100'].join(' ')}
            aria-label="Close account dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className={['block text-sm font-medium', isDark ? 'text-slate-200' : 'text-stone-700'].join(' ')}>Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(event) => onFormChange('email', event.target.value)}
              className={[
                'h-11 w-full rounded-2xl border px-3 text-sm outline-none transition',
                isDark
                  ? 'border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-800'
                  : 'border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:bg-white',
              ].join(' ')}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className={['block text-sm font-medium', isDark ? 'text-slate-200' : 'text-stone-700'].join(' ')}>Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => onFormChange('password', event.target.value)}
              className={[
                'h-11 w-full rounded-2xl border px-3 text-sm outline-none transition',
                isDark
                  ? 'border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:border-sky-400 focus:bg-slate-800'
                  : 'border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:bg-white',
              ].join(' ')}
              placeholder="At least 8 characters"
            />
          </div>

          {error && <p className={['rounded-2xl border px-3 py-2 text-sm', isDark ? 'border-red-500/30 bg-red-500/10 text-red-200' : 'border-red-200 bg-red-50 text-red-700'].join(' ')}>{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className={[
                'rounded-full px-4 py-2.5 text-sm font-semibold transition',
                isDark ? 'bg-sky-500 text-white hover:bg-sky-400' : 'bg-stone-900 text-white hover:bg-stone-700',
              ].join(' ')}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LandingExperience({
  theme,
}: {
  theme: ThemeMode;
}) {
  const [showDemo, setShowDemo] = useState(false);
  const isDark = theme === 'dark';

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
  const demoSteps = [
    {
      number: '01',
      title: 'Track the flow',
      subtitle: 'Money in',
      text: 'See paycheck inflow, fixed bills, and small purchases side by side.',
      mock: [
        { label: 'Income', value: '$5,600', tone: 'bg-stone-900' },
        { label: 'Bills', value: '$2,430', tone: 'bg-stone-200' },
        { label: 'Left', value: '$1,910', tone: 'bg-stone-100' },
      ],
    },
    {
      number: '02',
      title: 'Spot the leak',
      subtitle: 'Hidden costs',
      text: 'Highlight the spending categories that quietly add up without feeling obvious.',
      mock: [
        { label: 'Coffee', value: '$78', tone: 'bg-stone-200' },
        { label: 'Rideshare', value: '$134', tone: 'bg-stone-300' },
        { label: 'Takeout', value: '$412', tone: 'bg-stone-900' },
      ],
    },
    {
      number: '03',
      title: 'Adjust the plan',
      subtitle: 'Smarter habits',
      text: 'Set better guardrails for takeout, rideshares, and impulse purchases.',
      mock: [
        { label: 'Budget', value: '82%', tone: 'bg-emerald-500' },
        { label: 'Saved', value: '$390', tone: 'bg-stone-900' },
        { label: 'Goal', value: '+$120', tone: 'bg-stone-100' },
      ],
    },
  ];

  return (
    <section
      className={[
        'rounded-[2rem] border p-6 shadow-[rgba(32,41,76,0.12)_0px_9px_25px_0px] sm:p-8 lg:p-10',
        isDark ? 'border-[#334155] bg-[#0f172a]' : 'border-[#c7cbdb] bg-[#ffffff]',
      ].join(' ')}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className={['text-[0.68rem] font-semibold uppercase tracking-[0.28em]', isDark ? 'text-[#9bb7ff]' : 'text-[#375390]'].join(' ')}>
            Smarter money habits
          </p>
          <h1 className={['mt-4 text-5xl font-black tracking-[-0.09em] sm:text-6xl lg:text-[100px] lg:leading-[0.91]', isDark ? 'text-white' : 'text-[#20294c]'].join(' ')}>
            See where your money goes before it disappears.
          </h1>
          <p className={['mt-5 max-w-lg text-base leading-7 sm:text-lg', isDark ? 'text-slate-300' : 'text-[#676b89]'].join(' ')}>
            Where Did My Money Go? helps people connect the dots between income, recurring bills, and small decisions that quietly add up.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDemo((current) => !current)}
              className={[
                'inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold shadow-[rgba(32,41,76,0.10)_0px_1px_4px_0px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[rgba(32,41,76,0.12)_0px_9px_25px_0px] focus:outline-none focus:ring-4 focus:ring-[#459af8]/30',
                isDark ? 'bg-white text-[#0f172a]' : 'bg-[#20294c] text-white',
              ].join(' ')}
            >
              <span>See how it works</span>
              <span aria-hidden="true" className={['inline-flex h-6 w-6 items-center justify-center rounded-full text-base', isDark ? 'bg-slate-900 text-white' : 'bg-white/10 text-white'].join(' ')}>
                ↓
              </span>
            </button>
          </div>

          <div className={['mt-6 flex flex-wrap items-center gap-3 text-xs font-medium tracking-[0.14em] uppercase', isDark ? 'text-slate-300' : 'text-stone-500'].join(' ')}>
            {trustPoints.map((point) => (
              <span key={point} className={['rounded-full border px-2.5 py-2', isDark ? 'border-slate-700 bg-slate-800/70 text-slate-200' : 'border-stone-200 bg-stone-50 text-stone-500'].join(' ')}>
                {point}
              </span>
            ))}
          </div>
        </div>

        <div className={['w-full max-w-md rounded-3xl border p-4 sm:p-5', isDark ? 'border-slate-700 bg-slate-800' : 'border-stone-200 bg-stone-50'].join(' ')}>
          <div className={['flex items-center justify-between text-sm', isDark ? 'text-slate-300' : 'text-stone-600'].join(' ')}>
            <span>Weekly snapshot</span>
            <span className={['rounded-full px-2 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase', isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700'].join(' ')}>
              On track
            </span>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <p className={['text-[0.62rem] font-medium tracking-[0.2em] uppercase', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>Income</p>
              <p className={['mt-1 text-3xl font-black tracking-[-0.06em]', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>$5,600</p>
            </div>
            <div className={['h-2 overflow-hidden rounded-full', isDark ? 'bg-slate-700' : 'bg-stone-200'].join(' ')}>
              <div className={['h-full w-[72%] rounded-full', isDark ? 'bg-white' : 'bg-stone-900'].join(' ')} />
            </div>
            <div className={['grid grid-cols-2 gap-3 text-sm', isDark ? 'text-slate-300' : 'text-stone-600'].join(' ')}>
              <div className={['rounded-2xl p-3', isDark ? 'bg-slate-900' : 'bg-white'].join(' ')}>
                <p className={['text-[0.6rem] font-medium tracking-[0.18em] uppercase', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>Bills</p>
                <p className={['mt-2 text-xl font-bold', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>$2,430</p>
              </div>
              <div className={['rounded-2xl p-3', isDark ? 'bg-slate-900' : 'bg-white'].join(' ')}>
                <p className={['text-[0.6rem] font-medium tracking-[0.18em] uppercase', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>Left</p>
                <p className={['mt-2 text-xl font-bold', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>$1,910</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDemo && (
        <div className={['demo-panel-enter mt-10 overflow-hidden rounded-[2rem] border p-5 shadow-[rgba(32,41,76,0.12)_0px_9px_25px_0px] sm:p-6', isDark ? 'border-slate-700 bg-slate-900' : 'border-[#c7cbdb] bg-[#f0f1f5]'].join(' ')}>
          <div className={['flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-end sm:justify-between', isDark ? 'border-slate-700' : 'border-[#c7cbdb]'].join(' ')}>
            <div>
              <p className={['text-[0.62rem] font-semibold uppercase tracking-[0.2em]', isDark ? 'text-[#9bb7ff]' : 'text-[#375390]'].join(' ')}>How it works</p>
              <h2 className={['mt-2 text-2xl font-black tracking-[-0.05em] sm:text-3xl', isDark ? 'text-white' : 'text-[#20294c]'].join(' ')}>See the story behind the numbers</h2>
            </div>
            <span className={['inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-[rgba(32,41,76,0.10)_0px_1px_4px_0px]', isDark ? 'border-slate-700 bg-slate-800 text-slate-100' : 'border-[#c7cbdb] bg-white text-[#20294c]'].join(' ')}>
              <span className="inline-flex h-2 w-2 rounded-full bg-[#459af8]" />
              3-step demo
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {demoSteps.map((step, index) => (
              <div
                key={step.number}
                className={['demo-card group rounded-[12px] border p-4 shadow-[rgba(32,41,76,0.07)_0px_4px_11px_0px,rgba(32,41,76,0.12)_0px_1px_3px_0px]', isDark ? 'border-slate-700 bg-slate-800' : 'border-[#c7cbdb] bg-white'].join(' ')}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className={['text-[0.62rem] font-semibold uppercase tracking-[0.2em]', isDark ? 'text-[#9bb7ff]' : 'text-[#375390]'].join(' ')}>{step.number}</p>
                  <span className={['rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]', isDark ? 'bg-slate-700 text-slate-200' : 'bg-[#f0f1f5] text-[#676b89]'].join(' ')}>
                    {step.subtitle}
                  </span>
                </div>

                <h3 className={['mt-4 text-lg font-semibold', isDark ? 'text-white' : 'text-[#20294c]'].join(' ')}>{step.title}</h3>
                <p className={['mt-2 text-sm leading-6', isDark ? 'text-slate-300' : 'text-[#676b89]'].join(' ')}>{step.text}</p>

                <div className={['mt-4 rounded-[12px] border p-3', isDark ? 'border-slate-700 bg-slate-900' : 'border-[#c7cbdb] bg-[#f0f1f5]'].join(' ')}>
                  <div className={['mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em]', isDark ? 'text-[#9bb7ff]' : 'text-[#375390]'].join(' ')}>
                    <span>Overview</span>
                    <span>{step.subtitle}</span>
                  </div>
                  <div className="space-y-2">
                    {step.mock.map((item) => (
                      <div key={item.label} className={['flex items-center gap-2 text-[11px]', isDark ? 'text-slate-300' : 'text-[#676b89]'].join(' ')}>
                        <span className={`h-2.5 w-2.5 rounded-full ${item.tone}`} />
                        <span className={['w-16', isDark ? 'text-slate-300' : 'text-[#676b89]'].join(' ')}>{item.label}</span>
                        <div className={['h-1.5 flex-1 overflow-hidden rounded-full', isDark ? 'bg-slate-700' : 'bg-[#c7cbdb]'].join(' ')}>
                          <div className={`h-full rounded-full ${item.tone}`} style={{ width: item.label === 'Budget' ? '82%' : item.label === 'Saved' ? '68%' : item.label === 'Goal' ? '76%' : item.label === 'Takeout' ? '72%' : item.label === 'Rideshare' ? '54%' : item.label === 'Coffee' ? '38%' : '100%' }} />
                        </div>
                        <span className={['font-semibold', isDark ? 'text-white' : 'text-[#20294c]'].join(' ')}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={['mt-4 h-1.5 w-full overflow-hidden rounded-full', isDark ? 'bg-slate-700' : 'bg-[#c7cbdb]'].join(' ')}>
                  <div className={['demo-progress h-full rounded-full', isDark ? 'bg-white' : 'bg-[#20294c]'].join(' ')} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {featureCards.map((card) => (
          <div
            key={card.title}
            className={[
              'rounded-[1.7rem] border p-5 shadow-[rgba(32,41,76,0.08)_0px_8px_24px_0px]',
              isDark ? 'border-slate-700 bg-slate-800/80' : 'border-stone-200 bg-stone-50',
            ].join(' ')}
          >
            <div
              className={[
                'mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-base font-bold shadow-sm',
                isDark ? 'bg-slate-700 text-slate-100' : 'bg-white text-stone-700',
              ].join(' ')}
            >
              ✓
            </div>
            <h2 className={['text-[2rem] font-black tracking-[-0.05em]', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>{card.title}</h2>
            <p className={['mt-3 text-base leading-7', isDark ? 'text-slate-300' : 'text-stone-600'].join(' ')}>{card.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PersonaStoryView({ user, theme }: { user: MockUser; theme: ThemeMode }) {
  const { activePersona, guess } = useStory();
  const isDark = theme === 'dark';

  return (
    <section
      className={[
        'rounded-[2rem] border p-5 shadow-[rgba(32,41,76,0.10)_0px_12px_30px_0px] sm:p-6',
        isDark ? 'border-slate-700 bg-slate-900' : 'border-stone-200 bg-white',
      ].join(' ')}
    >
      <div className={['mb-6 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between', isDark ? 'border-slate-700' : 'border-stone-200'].join(' ')}>
        <div>
          <p className={['text-[0.68rem] font-semibold uppercase tracking-[0.22em]', isDark ? 'text-slate-400' : 'text-stone-500'].join(' ')}>
            Personalized demo
          </p>
          <h3 className={['mt-2 text-2xl font-black tracking-[-0.06em]', isDark ? 'text-white' : 'text-stone-900'].join(' ')}>
            Your spending story for {activePersona?.name ?? user.fullName.split(' ')[0]}
          </h3>
        </div>
        <div className={['rounded-full border px-3 py-1 text-xs font-medium', isDark ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-stone-200 bg-stone-50 text-stone-600'].join(' ')}>
          Curated for {activePersona?.name ?? user.fullName}
        </div>
      </div>

      <div id="story" className="mx-auto max-w-3xl space-y-6">
        <SectionHook theme={theme} />
        <SectionPaycheck theme={theme} />
        <SectionFixedExpenses theme={theme} />
        <SectionSmallPurchases theme={theme} />
        <SectionGuess theme={theme} />
        <SectionGuessResult theme={theme} />
        {guess && <SectionCategoryReveal theme={theme} />}
        {guess && <SectionRevealPause theme={theme} />}
        <SectionTakeaway theme={theme} />
      </div>
    </section>
  );
}

function StoryLayout({
  session,
  onOpenAuth,
  onLogout,
  theme,
  onToggleTheme,
}: {
  session: MockUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}) {
  const { activePersonaId } = useStory();
  const displayedSession = session ? getMockUserForPersona(activePersonaId, session) : null;

  return (
    <>
      <Header
        session={displayedSession}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      <main
        className="min-h-screen px-4 pb-8 pt-6 sm:px-6 lg:px-8"
        style={{ backgroundColor: theme === 'dark' ? '#020817' : '#f0f1f5' }}
      >
        <div className="mx-auto max-w-5xl space-y-8">
          {!session && <LandingExperience theme={theme} />}
          {session && displayedSession && (
            <>
              <ProfileSummary user={displayedSession} theme={theme} />
              <PersonaStoryView user={displayedSession} theme={theme} />
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
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  const handleOpenAuth = () => {
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
  };

  const handleLogout = () => {
    setSession(null);
    setIsAuthOpen(false);
  };

  return (
    <StoryProvider>
      <PersonaSessionBridge session={session} />
      <div
        data-theme={theme}
        className="min-h-screen transition-colors duration-200"
        style={{ backgroundColor: theme === 'dark' ? '#020817' : '#f0f1f5', color: theme === 'dark' ? '#e2e8f0' : '#20294c' }}
      >
        <StoryLayout
          session={session}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
        />
        {isAuthOpen && (
          <AuthModal
            form={form}
            error={error}
            onClose={handleCloseAuth}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            theme={theme}
          />
        )}
      </div>
    </StoryProvider>
  );
}

export default App;
