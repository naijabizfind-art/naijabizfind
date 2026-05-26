// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx' // Vetted & Imported
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Standalone Landing, Login, and Signup Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Core App Space: Normal Shoppers & Explorers */}
        <Route path="/explore" element={<App />} />

        {/* ✅ FIX: Route the Paystack redirect page to App.jsx so it can extract the URL parameters and verify payment */}
        <Route path="/payment-success" element={<App />} />
        
        {/* The Secured Admin Dashboard Gateway */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Dedicated Business Owner Workspace */}
        <Route path="/dashboard" element={<OwnerDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
