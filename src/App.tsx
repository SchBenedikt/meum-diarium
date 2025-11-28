import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthorProvider } from "@/context/AuthorContext";
import Index from "./pages/Index";
import PostPage from "./pages/PostPage";
import WorkPage from "./pages/WorkPage";
import AboutPage from "./pages/AboutPage";
import TimelinePage from "./pages/TimelinePage";
import LexiconPage from "./pages/LexiconPage";
import LexiconEntryPage from "./pages/LexiconEntryPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthorHeader } from "./components/layout/AuthorHeader";
import { Header } from "./components/layout/Header";
import { useEffect } from "react";

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

  return (
    <>
      <ScrollToTop />
      <Header />
      {isAuthorRoute && <AuthorHeader />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/:authorId" element={<Index />} />
        <Route path="/:authorId/about" element={<AboutPage />} />
        <Route path="/:authorId/works/:slug" element={<WorkPage />} />
        <Route path="/:authorId/:slug" element={<PostPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/lexicon" element={<LexiconPage />} />
        <Route path="/lexicon/:slug" element={<LexiconEntryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthorProvider>
          <Toaster richColors />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthorProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
