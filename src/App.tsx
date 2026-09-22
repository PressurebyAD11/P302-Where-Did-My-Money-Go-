import { AuthProvider } from './context/AuthProvider';
import { StoryProvider } from './context/StoryProvider';
import { useStory } from './context/useStory';
import SectionHook from './components/sections/SectionHook';
import SectionPaycheck from './components/sections/SectionPaycheck';
import SectionFixedExpenses from './components/sections/SectionFixedExpenses';
import SectionSmallPurchases from './components/sections/SectionSmallPurchases';
import SectionGuess from './components/sections/SectionGuess';
import SectionRevealPause from './components/sections/SectionRevealPause';
import SectionGuessResult from './components/sections/SectionGuessResult';
import SectionCategoryReveal from './components/sections/SectionCategoryReveal';
import SectionTakeaway from './components/sections/SectionTakeaway';

function StoryLayout() {
  const { guess } = useStory();

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
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
    </main>
  );
}

function App() {
  return (
    <AuthProvider>
      <StoryProvider>
        <StoryLayout />
      </StoryProvider>
    </AuthProvider>
  );
}

export default App;
