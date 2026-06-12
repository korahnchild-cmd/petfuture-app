// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import OnboardingPage from './pages/OnboardingPage';
import CarePage from './pages/CarePage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';

const BASE = '/petfuture-app/';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={BASE}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/care" element={<CarePage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}