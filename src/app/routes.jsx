// src/app/routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import LoginPage from "../pages/login/LoginPage";
import RequestsPage from "../pages/Requests/RequestsPage";
import NewRequestPage from "../pages/NewRequest/NewRequestPage";
import RequestDetailPage from "../pages/RequestDetail/RequestDetailPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import AuthGuard from "../features/auth/AuthGuard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AppShell />}>
        <Route
          path="/requests"
          element={
            <AuthGuard>
              <RequestsPage />
            </AuthGuard>
          }
        />
        <Route
          path="/new-request"
          element={
            <AuthGuard>
              <NewRequestPage />
            </AuthGuard>
          }
        />
        <Route
          path="/requests/:id"
          element={
            <AuthGuard>
              <RequestDetailPage />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <ProfilePage />
            </AuthGuard>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
