import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import BudgetsPage from './pages/BudgetsPage';
import NotificationsPage from './pages/NotificationsPage';
import RecurringPage from './pages/RecurringPage';
import SignupPage from './pages/SignupPage';
import Navbar from './components/Navbar';
import TransactionsPage from './pages/TransactionsPage';
import StatsPage from './pages/StatsPage';
import CategoriesPage from './pages/CategoriesPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><TransactionsPage /></PrivateRoute>} />
          <Route path="/stats" element={<PrivateRoute><StatsPage /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><CategoriesPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
          <Route path="/budgets" element={<PrivateRoute><BudgetsPage /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/recurring" element={<PrivateRoute><RecurringPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 