import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthorProvider } from "@/context/AuthorContext";
import Index from "./pages/Index";
import PostPage from "./pages/PostPage";
import AboutPage from "./pages/AboutPage";
import TimelinePage from "./pages/TimelinePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthorProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/post/:slug" element={<PostPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
