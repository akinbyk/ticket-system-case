
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppShell() {
  const location = useLocation();
  const hideFrame = location.pathname === "/login";
  if (hideFrame) return <Outlet />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
