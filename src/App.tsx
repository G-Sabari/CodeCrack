import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Dashboard from "./pages/Dashboard";
import LearningPath from "./pages/LearningPath";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Aptitude from "./pages/Aptitude";
import Behavioral from "./pages/Behavioral";
import GroupDiscussion from "./pages/GroupDiscussion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/signup" element={<Navigate to="/auth" replace />} />
              <Route path="/problems" element={<ProtectedRoute><Problems /></ProtectedRoute>} />
              <Route path="/problems/:id" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
              <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
              <Route path="/companies/:id" element={<ProtectedRoute><CompanyDetail /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/learning-path" element={<ProtectedRoute><LearningPath /></ProtectedRoute>} />
              <Route path="/aptitude" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
              <Route path="/aptitude/:category/:topic" element={<ProtectedRoute><Aptitude /></ProtectedRoute>} />
              <Route path="/behavioral" element={<ProtectedRoute><Behavioral /></ProtectedRoute>} />
              <Route path="/group-discussion" element={<ProtectedRoute><GroupDiscussion /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
