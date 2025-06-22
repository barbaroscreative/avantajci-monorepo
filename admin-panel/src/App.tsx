import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CampaignPage from './pages/CampaignPage';
import StorePage from './pages/StorePage';
import BankPage from './pages/BankPage';
import CategoryPage from './pages/CategoryPage';
import DashboardLayout from './components/DashboardLayout';

// Force new commit to trigger Vercel webhook
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/campaigns" replace />} />
        <Route path="campaigns" element={<CampaignPage />} />
        <Route path="stores" element={<StorePage />} />
        <Route path="banks" element={<BankPage />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="*" element={<Navigate to="/campaigns" replace />} />
      </Route>
      <Route path="/login" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
