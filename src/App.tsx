import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthorProvider } from "@/context/AuthorContext";
import Index from "./pages/Index";
import PostPage from "./pages/PostPage";
import AboutPage from "./pages/AboutPage";
import TimelinePage from "./pages/TimelinePage";
import LexiconPage from "./pages/LexiconPage";
import LexiconEntryPage from "./pages/LexiconEntryPage";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthorProvider>
          <Toaster richColors />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/post/:slug" element={<PostPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/lexicon" element={<LexiconPage />} />
              <Route path="/lexicon/:slug" element={<LexiconEntryPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthorProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
