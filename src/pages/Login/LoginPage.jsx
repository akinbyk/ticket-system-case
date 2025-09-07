// src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUsersQuery } from "../../api/requestApi";
import { setUser } from "../../features/auth/authSlice";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import logo from "../../assets/HelpTicket_Logo.png";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useSelector((s) => s.auth.user); 

  const { data: users = [], isLoading: usersLoading, error: usersError } = useGetUsersQuery();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const LANGS = [
    { code: "tr", label: "TR" },
    { code: "en", label: "EN" },
  ];
  const cur = (i18n.language || "tr").slice(0, 2).toLowerCase();

  const changeLng = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (usersLoading) return setErr(t("common.loading"));
    if (usersError) return setErr(t("common.error"));

    const u = (users || []).find((x) => x.username === username.trim());
    if (!u) return setErr(t("auth.errorUserNotFound"));
    if (String(u.password) !== String(password)) return setErr(t("auth.errorWrongPassword"));

    localStorage.setItem("auth_user", JSON.stringify(u));
    dispatch(setUser(u));

    const from = location.state?.from || "/requests";
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-overlay" />
      <div className="login-center">
        <div className="login-card card">
          <img src={logo} alt="HelpTicket" className="login-logo" />
          <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
            <div className="field">
              <i className="bi bi-person field-icon" aria-hidden="true" />
              <input
                className="input field-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("auth.username")}
                aria-label={t("auth.username")}
                autoFocus
              />
            </div>

            <div className="field">
              <i className="bi bi-lock field-icon" aria-hidden="true" />
              <input
                className="input field-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("auth.password")}
                aria-label={t("auth.password")}
              />
            </div>

            {err ? (
              <div className="text-danger small" role="alert">
                {err}
              </div>
            ) : null}

            <div className="d-flex align-items-center justify-content-between mt-1">
              <Dropdown onSelect={(key) => key && changeLng(key)}>
                <Dropdown.Toggle
                  variant="light"
                  id="login-lang"
                  className="d-inline-flex align-items-center gap-2 login-lang"
                >
                  <i className="bi bi-globe2" aria-hidden="true" />
                  <span className="fw-semibold">{cur.toUpperCase()}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {LANGS.map((l) => (
                    <Dropdown.Item eventKey={l.code} key={l.code} active={cur === l.code}>
                      {l.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <button className="btn btn-brand px-4" type="submit" disabled={usersLoading}>
                {t("auth.loginButton")}
              </button>
            </div>
          </form>
        </div>

        <footer className="login-foot text-center mt-3">
          <small className="text-muted">© {new Date().getFullYear()} HelpTicket</small>
        </footer>
      </div>
    </div>
  );
}
