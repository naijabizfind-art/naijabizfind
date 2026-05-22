// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx' // Your existing main page stays completely untouched!
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Normal users get routed here after login: */}
        <Route path="/explore" element={<App />} /> 
        {/* Business owners get routed here after login: */}
        <Route path="/dashboard" element={<OwnerDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
