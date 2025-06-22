import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import StorePage from './pages/StorePage';
import BankPage from './pages/BankPage';
import CampaignPage from './pages/CampaignPage';
import CategoryPage from './pages/CategoryPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="stores" element={<StorePage />} />
        <Route path="banks" element={<BankPage />} />
        <Route path="campaigns" element={<CampaignPage />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route index element={<Navigate to="/stores" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
