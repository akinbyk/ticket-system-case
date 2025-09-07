// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink, Link } from "react-router-dom"; // Link eklendi
import { useTranslation } from "react-i18next";
import logo from "../../assets/HelpTicket_Logo.png";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar } from "../../features/ui/uiSlice";



const IconGrid = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);
const IconUser = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconPlusSquare = (props) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export default function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isOpen = useSelector((s) => s.ui.sidebarOpen);

  const items = [
    { to: "/requests",     label: t("navbar.requests"),   Icon: IconGrid },
    { to: "/profile",      label: t("navbar.profile"),    Icon: IconUser },
   
  ];

  return (
    <aside className={`sidebar ${isOpen ? "d-block" : ""}`}>
      
      <Link to="/requests" className="side-brand" aria-label="Requests">
        <img src={logo} alt="HelpTicket Logo" className="side-logo" />
      </Link>

      <nav className="side-nav">
        {items.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => "side-item" + (isActive ? " active" : "")}
            end
          >
            <Icon className="side-icon" />
            <span className="side-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
