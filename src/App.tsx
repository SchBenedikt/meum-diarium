import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingScreen } from "@/components/LoadingScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthorProvider } from "@/context/AuthorContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthorHeader } from "./components/layout/AuthorHeader";
import { Header } from "./components/layout/Header";
import { LanguageProvider } from "./context/LanguageContext";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { SWUpdateToast } from "./components/SWUpdateToast";
import { OfflineBanner } from "./components/OfflineBanner";

const Index = lazy(() => import("./pages/Index"));
const PostPage = lazy(() => import("./pages/PostPage"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const SimulationPage = lazy(() => import("./pages/SimulationPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const LexiconPage = lazy(() => import("./pages/LexiconPage"));
const LexiconEntryPage = lazy(() => import("./pages/LexiconEntryPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const PostEditorPage = lazy(() => import("./pages/PostEditorPage"));
const AuthorEditorPage = lazy(() => import("./pages/AuthorEditorPage"));
const LexiconEditorPage = lazy(() => import("./pages/LexiconEditorPage"));
const PageEditorPage = lazy(() => import("./pages/PageEditorPage"));
const WorkEditorPage = lazy(() => import("./pages/WorkEditorPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const DesignGuidePage = lazy(() => import("./pages/DesignGuidePage"));
const LoadingDemoPage = lazy(() => import("./pages/LoadingDemoPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
  const isAuthorRoute = location.pathname.startsWith('/caesar') ||
    location.pathname.startsWith('/cicero') ||
    location.pathname.startsWith('/augustus') ||
    location.pathname.startsWith('/seneca');

  const isPostPage = isAuthorRoute && (
    !location.pathname.endsWith('/about') &&
    !location.pathname.includes('/works/') &&
    location.pathname.split('/').length > 2
  );

  return (
    <>
      <ScrollToTop />
      {/* The z-index here ensures the header is above the PostPage hero image */}
      <div className="relative z-50">
        <Header />
      </div>
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Index /></PageTransition>} />
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
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/timeline" element={<PageTransition><TimelinePage /></PageTransition>} />
            <Route path="/lexicon" element={<PageTransition><LexiconPage /></PageTransition>} />
            <Route path="/lexicon/:slug" element={<PageTransition><LexiconEntryPage /></PageTransition>} />
            <Route path="/search" element={<PageTransition><SearchPage /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminPage /></PageTransition>} />
            <Route path="/admin/post/new" element={<PageTransition><PostEditorPage /></PageTransition>} />
            <Route path="/admin/post/:author/:slug" element={<PageTransition><PostEditorPage /></PageTransition>} />
            <Route path="/admin/author/new" element={<PageTransition><AuthorEditorPage /></PageTransition>} />
            <Route path="/admin/author/:authorId" element={<PageTransition><AuthorEditorPage /></PageTransition>} />
            <Route path="/admin/lexicon/new" element={<PageTransition><LexiconEditorPage /></PageTransition>} />
            <Route path="/admin/lexicon/:slug" element={<PageTransition><LexiconEditorPage /></PageTransition>} />
            <Route path="/admin/work/new" element={<PageTransition><WorkEditorPage /></PageTransition>} />
            <Route path="/admin/work/:slug" element={<PageTransition><WorkEditorPage /></PageTransition>} />
            <Route path="/admin/pages/new" element={<PageTransition><PageEditorPage /></PageTransition>} />
            <Route path="/admin/pages/:slug" element={<PageTransition><PageEditorPage /></PageTransition>} />
            <Route path="/admin/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
            <Route path="/design" element={<PageTransition><DesignGuidePage /></PageTransition>} />
            <Route path="/loading" element={<PageTransition><LoadingDemoPage /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.98 }}
    transition={{
      duration: 0.4,
      ease: [0.4, 0.0, 0.2, 1] // Custom easing curve for smoother transitions
    }}
  >
    {children}
  </motion.div>
);


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <LanguageProvider>
          <AuthorProvider>
            <Toaster richColors />
            <PWAInstallPrompt />
            <SWUpdateToast />
            <OfflineBanner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </AuthorProvider>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
