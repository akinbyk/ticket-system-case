// src/components/layout/Topbar.jsx
import React from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSidebar } from "../../features/ui/uiSlice"; 
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";

/** Bootstrap tarzı user ikonu (inline SVG) */
const BsPerson = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" {...props}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export default function Topbar({ onLogout }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((s) => s.auth.user);
  const lang = (i18n?.language || "tr").toLowerCase();
  const welcome = lang.startsWith("tr") ? "Hoş geldin" : "Welcome";

  const name = user?.name || user?.fullName || user?.username || user?.email || "User";
  const avatar = user?.avatar || user?.photo || user?.image || null;

  const handleProfile = () => navigate("/profile");
  const handleLogout = () => {
    if (typeof onLogout === "function") onLogout();
    else dispatch({ type: "auth/logout" });
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="topbar">
        <div className="tb-left">{welcome}</div>
        <button className="btn btn-brand" onClick={() => navigate("/login")}>
          {t("navbar.login")}
        </button>
      </div>
    );
  }

  return (
    <div className="topbar">
      <div className="mobile-menu-triger">
        <button className="btn btn-outline-primariy" onClick={() => dispatch(toggleSidebar())}>
          <i className="bi bi-list"></i>
        </button>
      </div>
      <div className="tb-left">{welcome}</div>

      <Dropdown align="end">
        <Dropdown.Toggle
          variant="light"
          id="topbar-user"
          className="tb-userbtn tb-userbtn--wide"
        >
          
          {avatar ? (
            <img src={avatar} alt={name} className="tb-avatar" />
          ) : (
            <div className="tb-avatar tb-avatar--icon bg-light border">
              <BsPerson className="tb-avatar-icon" />
            </div>
          )}
          <span className="tb-name">{name}</span>
          <span className="tb-caret">▾</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="tb-menu">
          <Dropdown.Item onClick={handleProfile}>
            {t("navbar.profile")}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>
            {t("navbar.logout")}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
