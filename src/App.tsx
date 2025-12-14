import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthorProvider } from "@/context/AuthorContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthorHeader } from "./components/layout/AuthorHeader";
import { Header } from "./components/layout/Header";
import { LanguageProvider } from "./context/LanguageContext";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { SWUpdateToast } from "./components/SWUpdateToast";

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
        {isAuthorRoute && !isPostPage && <AuthorHeader />}
      </div>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/:authorId" element={<Index />} />
          <Route path="/:authorId/about" element={<AboutPage />} />
          <Route path="/:authorId/works/:slug" element={<WorkPage />} />
          <Route path="/:authorId/chat" element={
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Laden...</div>}>
              <ChatPage />
            </Suspense>
          } />
          <Route path="/:authorId/simulation" element={
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Laden...</div>}>
              <SimulationPage />
            </Suspense>
          } />
          <Route path="/:authorId/:slug" element={<PostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/lexicon" element={<LexiconPage />} />
          <Route path="/lexicon/:slug" element={<LexiconEntryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/post/new" element={<PostEditorPage />} />
          <Route path="/admin/post/:author/:slug" element={<PostEditorPage />} />
          <Route path="/admin/author/new" element={<AuthorEditorPage />} />
          <Route path="/admin/author/:authorId" element={<AuthorEditorPage />} />
          <Route path="/admin/lexicon/new" element={<LexiconEditorPage />} />
          <Route path="/admin/lexicon/:slug" element={<LexiconEditorPage />} />
          <Route path="/admin/pages/new" element={<PageEditorPage />} />
          <Route path="/admin/pages/:slug" element={<PageEditorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <LanguageProvider>
          <AuthorProvider>
            <Toaster richColors />
            <PWAInstallPrompt />
            <SWUpdateToast />
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
