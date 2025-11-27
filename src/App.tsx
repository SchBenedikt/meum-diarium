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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthorProvider>
        <Toaster richColors />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/post/:slug" element={<PostPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="/lexicon" element={<LexiconPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
