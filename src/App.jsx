import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoute";
import { useSelector } from "react-redux";
const Layout = lazy(() => import("./components/Layout"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

export default function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Navigate to="/app/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/app" element={<ProtectedRoute />}>
            <Route path="/app/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
