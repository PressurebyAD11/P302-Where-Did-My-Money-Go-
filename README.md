# Where Did My Money Go?

A mock personal finance product demo designed to help users understand how income disappears through recurring bills, small purchases, and hidden spending patterns.

The experience is built as a premium landing page and a personalized app-style dashboard using fictional user data only. There is no real bank integration or live authentication; everything is intentionally mock-driven so the product can be explored and presented as a concept.

## Application premise

Many people feel like their paycheck is disappearing without a clear explanation. This app turns that feeling into a story-driven financial lesson:

- a user sees their paycheck land
- recurring fixed expenses are surfaced
- small purchases begin to stack up
- the hidden cost of convenience spending becomes visible
- the user can make a better estimate and understand where money went

The product frames personal finance education as a guided narrative, blending storytelling with product-style UX.

## Features

### Landing experience
- SaaS-style product landing page
- premium hero section with headline and value proposition
- “See how it works” interactive demo reveal
- trust badges and feature highlights
- CTA flow that leads into the mock login or persona experience

### Mock auth and account access
- mock login flow for demo users
- mock profile and account summary cards
- secure-access UI styling for a product feel
- no real backend, banking, or production auth integration

### Persona-based storytelling
- three fictional users with distinct financial patterns
- persona switcher in the top app bar
- personalized demo content aligned to the selected user
- switch behavior persists while the user remains in the app view

### Interactive financial storytelling
- paycheck reveal
- fixed expense breakdown
- small purchases and transaction list
- category totals and spending bars
- guessing mechanic for where the largest spend went
- result states with narrative feedback
- takeaway section explaining the behavioral insight

### Theme support
- light mode and dark mode variants
- consistent premium card styling across both themes
- polished visual treatment for landing page, auth modal, and account sections

## Core functionality

- Explore the product through a landing page before entering the app flow
- Sign in with a mock user profile
- Switch between personas without losing context
- View a personalized account overview with mock linked accounts
- Walk through a guided story illustrating how money is allocated
- Understand where the “missing” money actually went
- Compare spending patterns and identify the main leak in discretionary spending

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- GSAP + ScrollTrigger
- shadcn-style component patterns
- Vitest + Testing Library
- jsdom for DOM-based tests

## Project structure

- src/App.tsx — app shell, landing page, auth modal, and account view orchestration
- src/components/Header.tsx — top navigation, theme toggle, persona switcher
- src/components/sections — narrative story sections for the financial demo
- src/context — app state and persona switching logic
- src/data — mock persona and story data
- src/lib — formatting, story logic, and demo feedback helpers

## Local development

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm run test:run
```

## Product pitch / elevator summary

Where Did My Money Go? is a product concept for a more emotionally resonant and behaviorally intelligent personal finance experience. Instead of presenting budgeting as a spreadsheet problem, the app turns money awareness into a narrative: users see their paycheck arrive, watch recurring bills absorb it, and discover how small daily purchases quietly create the biggest leaks.

The concept is positioned as a premium financial education and habit-building product that helps users understand their spending patterns without shame or friction. It combines storytelling, mock account data, and interactive product UI to make the insight feel immediate, personalized, and actionable.

This is designed for product and stakeholder conversations as a prototype for a consumer-facing financial wellness experience—especially for users who know they need to improve money habits but do not yet have a clear picture of where their money is going.

## How the app works for end users

1. A visitor lands on a polished finance product homepage and sees the value proposition.
2. They click “See how it works” to reveal a short interactive walkthrough of the core concept.
3. They can log in with a mock profile to explore an app-style dashboard.
4. They switch between personas to compare different money patterns and spending habits.
5. They follow a guided story that walks through paycheck inflow, fixed expenses, and small discretionary purchases.
6. They make a guess about where the main spend went and receive feedback tied to their selected persona.
7. They finish with a clear takeaway about how small purchases compound over time and how to make better budget decisions.

This creates a stronger product story than a static app screen: the user experiences the financial insight as a journey rather than a list of numbers.

## Screenshot section

> Add screenshots in the project docs or product review folder to visually capture the main flows:
>
> - landing page hero and CTA area
> - “See how it works” demo expansion
> - mock sign-in experience
> - profile summary with linked accounts
> - personalized persona story and reveal sequence
> - dark mode version for presentation review

Example placeholder structure:

```md
### Landing page
![Landing page hero](./docs/screenshots/landing-page.png)

### Demo reveal
![Interactive demo](./docs/screenshots/demo-reveal.png)

### Persona account view
![Account summary](./docs/screenshots/profile-summary.png)
```

## Notes

This project is intentionally a UX and product prototype rather than a real finance app. It uses mock data to demonstrate a polished onboarding and behavior-change experience for money awareness and budgeting education.

## Status

The app currently includes:
- landing-page concepting
- persona-driven product storytelling
- mock authentication flow
- app-like profile/account views
- light and dark theme consistency
- interactive demo and spending reveal experience

