import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import AuthPage from "./pages/Auth";
import SelectPathPage from "./pages/SelectPath";
import LoadingScreen from "./pages/LoadingScreen";
import Dashboard from "./pages/Dashboard";
import RoadmapPage from "./pages/Roadmap";
import LessonPage from "./pages/Lesson";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Skill Path Guard
const SkillPathGuard = ({ children }: { children: React.ReactNode }) => {
  const { profile } = useApp();
  return profile.hasSkills ? <>{children}</> : <Navigate to="/select-path" replace />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/select-path" 
          element={
            <ProtectedRoute>
              <SelectPathPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/loading" 
          element={
            <ProtectedRoute>
              <LoadingScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <SkillPathGuard>
                <Dashboard />
              </SkillPathGuard>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/roadmap/:skillId" 
          element={
            <ProtectedRoute>
              <SkillPathGuard>
                <RoadmapPage />
              </SkillPathGuard>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lesson/:skillId/:stageId" 
          element={
            <ProtectedRoute>
              <SkillPathGuard>
                <LessonPage />
              </SkillPathGuard>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <div className="page-bg">
          <AppRoutes />
        </div>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
