import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage   from './pages/LandingPage';
import LoginPage     from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage  from './pages/NotFoundPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Route guard — redirects to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <LoadingSpinner size="lg" label="Authenticating…" />;
  return admin ? children : <Navigate to="/login" replace />;
};

// Redirect logged-in admins away from /login
const PublicRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return null;
  return admin ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/"          element={<LandingPage />} />
    <Route path="/login"     element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="*"          element={<NotFoundPage />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
