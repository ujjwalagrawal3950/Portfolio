import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
// 1. Import Toaster from sonner
import { Toaster } from 'sonner';

// Layout Components
import Navbar from './component/Navbar';
import FrontPage from './component/FrontPage';
import SecondPage from './component/SecondPage';
import WorkPage from './component/WorkPage';
import ConnectPage from './component/ConnectPage';
import AdminLogin from './Admin/AdminLogin';
import Preloader from './component/Preloader';

// Admin Page
import AdminDashboard from './Admin/AdminPortal';

import './App.css';
import Contact from './component/Contact';
import AdminUserList from './Admin/AdminUserList';

const LandingPage = () => (
  <>
    <Navbar />
    <FrontPage />
    <SecondPage />
    <WorkPage />
    <ConnectPage />
    <Contact />
  </>
);



function App() {
  const [isLoading, setIsLoading] = useState(() => {
    // Check if the preloader has already been shown in this session
    return !sessionStorage.getItem('hasLoaded');
  });

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('hasLoaded', 'true');
  };

  const ProtectedAdmin = ({ children }) => {
    // Check for the non-httpOnly hint cookie
    const isAuthenticated = document.cookie.includes('is_admin=true');

    if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      {/* 2. Place Toaster here. Using "richColors" and "dark" theme for that premium look */}
      <Toaster
        position="top-center"
        richColors
        closeButton
        theme="dark"
      />

      <AnimatePresence mode="wait">
        {isLoading && (
          <Preloader onLoadingComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <div className="w-full bg-[#030303] relative min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
          <Route path="/admin/users" element={<ProtectedAdmin><AdminUserList /></ProtectedAdmin>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;