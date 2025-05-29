
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider as OIDCAuthProvider } from 'react-oidc-context';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { getOIDCConfig } from '@/services/oidcConfig';
import Index from "./pages/Index";
import Opportunities from "./pages/Opportunities";
import Applications from "./pages/Applications";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const queryClient = new QueryClient();

// Protected route component for admin-only pages
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/admin' }} />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/opportunities" replace />;
  }
  
  return <>{children}</>;
};

// Protected route component for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Dashboard route that redirects unauthenticated users
const DashboardRoute = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/opportunities" replace />;
  }
  
  return <Index />;
};

// App routes component that uses auth context
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardRoute />} />
      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/applications" element={
        <ProtectedRoute>
          <Applications />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// OIDC wrapper component
const OIDCWrapper = ({ children }: { children: React.ReactNode }) => {
  const oidcConfig = getOIDCConfig();

  if (!oidcConfig) {
    // Fallback to mock auth when no OIDC config
    return <>{children}</>;
  }

  return (
    <OIDCAuthProvider {...oidcConfig}>
      {children}
    </OIDCAuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <OIDCWrapper>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </OIDCWrapper>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
