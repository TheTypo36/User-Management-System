import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import Header from "./pages/Header.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Profile from "./pages/Profile.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AuditLog from "./pages/AuditLog.tsx";
createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <StrictMode>
        <Header />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auditlog" element={<AuditLog />} />
        </Routes>
      </StrictMode>
    </BrowserRouter>
  </AuthProvider>
);
