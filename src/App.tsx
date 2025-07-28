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
import { OwnerGuard } from "./components/OwnerGuard";
import { OwnerLayout } from "./components/OwnerLayout";
import { OwnerDashboard } from "./pages/owner/OwnerDashboard";
import { OwnerTenants } from "./pages/owner/OwnerTenants";
import { OwnerSkills } from "./pages/owner/OwnerSkills";
import { OwnerFeatureFlags } from "./pages/owner/OwnerFeatureFlags";
import { OwnerAnalytics } from "./pages/owner/OwnerAnalytics";
import { OwnerSupport } from "./pages/owner/OwnerSupport";

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
        
        {/* Owner Routes */}
        <Route path="/owner/*" element={
          <ProtectedRoute>
            <OwnerGuard>
              <OwnerLayout>
                <Routes>
                  <Route path="dashboard" element={<OwnerDashboard />} />
                  <Route path="tenants" element={<OwnerTenants />} />
                  <Route path="skills" element={<OwnerSkills />} />
                  <Route path="feature-flags" element={<OwnerFeatureFlags />} />
                  <Route path="analytics" element={<OwnerAnalytics />} />
                  <Route path="support" element={<OwnerSupport />} />
                  <Route path="" element={<Navigate to="/owner/dashboard" replace />} />
                </Routes>
              </OwnerLayout>
            </OwnerGuard>
          </ProtectedRoute>
        } />
        
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
