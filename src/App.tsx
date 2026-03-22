import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingScreen } from "@/components/LoadingScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthorProvider } from "@/context/AuthorContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthorHeader } from "./components/layout/AuthorHeader";
import { Header } from "./components/layout/Header";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuthors } from "@/hooks/use-authors";
import { CookieBanner } from "@/components/CookieBanner";
const Index = lazy(() => import("./pages/Index"));
const PostPage = lazy(() => import("./pages/PostPage"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const SimulationPage = lazy(() => import("./pages/SimulationPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const CaesarAboutPage = lazy(() => import("./pages/about/CaesarAboutPage").then(m => ({ default: m.CaesarAboutPage })));
const CiceroAboutPage = lazy(() => import("./pages/about/CiceroAboutPage").then(m => ({ default: m.CiceroAboutPage })));
const AugustusAboutPage = lazy(() => import("./pages/about/AugustusAboutPage").then(m => ({ default: m.AugustusAboutPage })));
const SenecaAboutPage = lazy(() => import("./pages/about/SenecaAboutPage").then(m => ({ default: m.SenecaAboutPage })));
const CatilinaAboutPage = lazy(() => import("./pages/about/CatilinaAboutPage").then(m => ({ default: m.CatilinaAboutPage })));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const LexiconPage = lazy(() => import("./pages/LexiconPage"));
const LexiconEntryPage = lazy(() => import("./pages/LexiconEntryPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const PostEditorPage = lazy(() => import("./pages/PostEditorPage"));
const AuthorEditorPage = lazy(() => import("./pages/AuthorEditorPage"));
const LexiconEditorPage = lazy(() => import("./pages/LexiconEditorPage"));
const PageEditorPage = lazy(() => import("./pages/PageEditorPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const DesignGuidePage = lazy(() => import("./pages/DesignGuidePage"));
const LoadingDemoPage = lazy(() => import("./pages/LoadingDemoPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const ImprintPage = lazy(() => import("./pages/ImprintPage"));
const CookiesPage = lazy(() => import("./pages/CookiesPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ApiDocsPage = lazy(() => import("./pages/ApiDocsPage"));
const LatinTools = lazy(() => import('./pages/LatinTools'));
const LatinGrammarPage = lazy(() => import('./pages/LatinGrammarPage'));
const LearnPracticePage = lazy(() => import('./pages/LearnPracticePage'));
const SubstantivePage = lazy(() => import('./pages/grammar/SubstantivePage'));
const VerbenPage = lazy(() => import('./pages/grammar/VerbenPage'));
const AdjektivePage = lazy(() => import('./pages/grammar/AdjektivePage'));
const PronomenPage = lazy(() => import('./pages/grammar/PronomenPage'));
const AdverbienPage = lazy(() => import('./pages/grammar/AdverbienPage'));
const SyntaxPage = lazy(() => import('./pages/grammar/SyntaxPage'));
const PartizipienPage = lazy(() => import('./pages/grammar/PartizipienPage'));
const LatinReader = lazy(() => import('./pages/LatinReaderNew'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const VocabularyPage = lazy(() => import('./pages/VocabularyPage'));
const RhetoricalDevicesPage = lazy(() => import('./pages/RhetoricalDevicesPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AgbPage = lazy(() => import('./pages/AgbPage'));
const OERPage = lazy(() => import('./pages/OERPage'));
const ImagesPage = lazy(() => import('./pages/ImagesPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
// const AIExplanationPage = lazy(() => import('./pages/AIExplanationPage'));
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const queryClient = new QueryClient();
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
const AppContent = () => {
  const location = useLocation();
  const { authors: dbAuthors } = useAuthors();
  const isAuthorRoute = location.pathname.startsWith('/caesar') ||
    location.pathname.startsWith('/cicero') ||
    location.pathname.startsWith('/augustus') ||
    location.pathname.startsWith('/seneca') ||
    location.pathname.startsWith('/catilina');
  const isPostPage = isAuthorRoute && (
    !location.pathname.endsWith('/about') &&
    !location.pathname.includes('/works/') &&
    location.pathname.split('/').length > 2
  );
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthorProvider authorsData={dbAuthors}>
      <>
        <ScrollToTop />
        {/* Hide main header for admin routes */}
        {!isAdminRoute && (
          <div className="relative z-50">
            <Header />
          </div>
        )}
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Index /></PageTransition>} />
              {/* Static routes must come before dynamic :authorId routes */}
              <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
              <Route path="/über" element={<PageTransition><AboutPage /></PageTransition>} />
              <Route path="/api" element={<PageTransition><ApiDocsPage /></PageTransition>} />
              <Route path="/timeline" element={<PageTransition><TimelinePage /></PageTransition>} />
              <Route path="/lexicon" element={<PageTransition><LexiconPage /></PageTransition>} />
              <Route path="/lexikon" element={<PageTransition><LexiconPage /></PageTransition>} />
              <Route path="/lexicon/:slug" element={<PageTransition><LexiconEntryPage /></PageTransition>} />
              <Route path="/search" element={<PageTransition><SearchPage /></PageTransition>} />
              <Route path="/design" element={<PageTransition><DesignGuidePage /></PageTransition>} />
              <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
              <Route path="/datenschutz" element={<PageTransition><PrivacyPage /></PageTransition>} />
              <Route path="/legal" element={<PageTransition><ImprintPage /></PageTransition>} />
              <Route path="/impressum" element={<PageTransition><ImprintPage /></PageTransition>} />
              <Route path="/cookies" element={<PageTransition><CookiesPage /></PageTransition>} />
              <Route path="/cookie-richtlinien" element={<PageTransition><CookiesPage /></PageTransition>} />
              <Route path="/loading" element={<PageTransition><LoadingDemoPage /></PageTransition>} />
              <Route path="/learn" element={<PageTransition><LatinTools /></PageTransition>} />
              <Route path="/lernen" element={<PageTransition><LatinTools /></PageTransition>} />
              <Route path="/learn/grammar" element={<PageTransition><LatinGrammarPage /></PageTransition>} />
              <Route path="/learn/practice" element={<PageTransition><LearnPracticePage /></PageTransition>} />
              <Route path="/learn/grammar/substantive/:topic?" element={<PageTransition><SubstantivePage /></PageTransition>} />
              <Route path="/learn/grammar/verben/:topic?" element={<PageTransition><VerbenPage /></PageTransition>} />
              <Route path="/learn/grammar/adjektive/:topic?" element={<PageTransition><AdjektivePage /></PageTransition>} />
              <Route path="/learn/grammar/pronomen/:topic?" element={<PageTransition><PronomenPage /></PageTransition>} />
              <Route path="/learn/grammar/adverbien/:topic?" element={<PageTransition><AdverbienPage /></PageTransition>} />
              <Route path="/learn/grammar/syntax/:topic?" element={<PageTransition><SyntaxPage /></PageTransition>} />
              <Route path="/learn/grammar/partizipien/:topic?" element={<PageTransition><PartizipienPage /></PageTransition>} />
              <Route path="/learn/vocab" element={<Navigate to="/learn" replace />} />
              <Route path="/learn/rhetoric" element={<PageTransition><RhetoricalDevicesPage /></PageTransition>} />
              <Route path="/vocab" element={<PageTransition><VocabularyPage /></PageTransition>} />
              <Route path="/reader" element={<PageTransition><LatinReader /></PageTransition>} />
              <Route path="/reader/:authorId" element={<PageTransition><LatinReader /></PageTransition>} />
              <Route path="/reader/:authorId/:workSlug" element={<PageTransition><LatinReader /></PageTransition>} />
              {/* User auth routes */}
              <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
              <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
              <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
              <Route path="/profile/edit" element={<PageTransition><ProfileEditPage /></PageTransition>} />
              {/* Legal pages */}
              <Route path="/agb" element={<PageTransition><AgbPage /></PageTransition>} />
              <Route path="/oer" element={<PageTransition><OERPage /></PageTransition>} />
              <Route path="/images" element={<PageTransition><ImagesPage /></PageTransition>} />
              <Route path="/stats" element={<PageTransition><StatisticsPage /></PageTransition>} />
              <Route path="/statistik" element={<PageTransition><StatisticsPage /></PageTransition>} />
              {/* <Route path="/ai-explanation" element={<PageTransition><AIExplanationPage /></PageTransition>} /> */}
              <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
              {/* Admin routes - Notion Style */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminPage />} />
                <Route path="posts/new" element={<PostEditorPage />} />
                <Route path="post/new" element={<PostEditorPage />} />
                <Route path="posts/:author/:slug" element={<PostEditorPage />} />
                <Route path="post/:author/:slug" element={<PostEditorPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="lexicon" element={<LexiconEditorPage />} />
                <Route path="lexicon/new" element={<LexiconEditorPage />} />
                <Route path="lexicon/:slug" element={<LexiconEditorPage />} />
                <Route path="author/new" element={<AuthorEditorPage />} />
                <Route path="author/:id" element={<AuthorEditorPage />} />
              </Route>
              {/* Standalone admin page for direct access */}
              <Route path="/admin/overview" element={<PageTransition><AdminPage /></PageTransition>} />
              <Route path="/admin/login" element={<PageTransition><AdminLoginPage /></PageTransition>} />

              {/* Direct author about page routes */}
              <Route path="/caesar/about" element={<PageTransition><CaesarAboutPage /></PageTransition>} />
              <Route path="/cicero/about" element={<PageTransition><CiceroAboutPage /></PageTransition>} />
              <Route path="/augustus/about" element={<PageTransition><AugustusAboutPage /></PageTransition>} />
              <Route path="/seneca/about" element={<PageTransition><SenecaAboutPage /></PageTransition>} />
              <Route path="/catilina/about" element={<PageTransition><CatilinaAboutPage /></PageTransition>} />

              {/* Dynamic author routes - must come after static routes */}
              <Route path="/:authorId" element={<PageTransition><Index /></PageTransition>} />
              <Route path="/:authorId/about" element={<PageTransition><AboutPage /></PageTransition>} />
              <Route path="/:authorId/works/:slug" element={<PageTransition><WorkPage /></PageTransition>} />
              <Route path="/:authorId/chat" element={
                <Suspense fallback={<LoadingScreen />}>
                  <PageTransition><ChatPage /></PageTransition>
                </Suspense>
              } />
              <Route path="/:authorId/simulation" element={
                <Suspense fallback={<LoadingScreen />}>
                  <PageTransition><SimulationPage /></PageTransition>
                </Suspense>
              } />
              <Route path="/:authorId/:slug" element={<PageTransition><PostPage /></PageTransition>} />
              {/* 404 must be last */}
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
        <CookieBanner />
      </>
    </AuthorProvider>
  );
};
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
    transition={{
      duration: 0.3,
      ease: [0.2, 0.0, 0.0, 1.0] // Snappier cubic-bezier
    }}
  >
    {children}
  </motion.div>
);
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <LanguageProvider>
            <AuthProvider>
              <Toaster richColors />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppContent />
              </BrowserRouter>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;
