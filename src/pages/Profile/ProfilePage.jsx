// src/pages/profile/ProfilePage.jsx
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetRequestsQuery } from "../../api/requestApi";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Card, Row, Col, ProgressBar } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const user = useSelector((s) => s.auth.user);
  const { data: requests = [], isLoading, error } = useGetRequestsQuery();

  if (!user) {
    return (
      <div className="container container-left" style={{ maxWidth: 900 }}>
        <div className="card">Lütfen giriş yapın.</div>
      </div>
    );
  }

  const userRequests = useMemo(() => {
    if (!requests?.length) return [];
    if (user.role === "admin") return requests;
    return requests.filter((r) => String(r.userId) === String(user.id));
  }, [requests, user]);

  const stats = useMemo(() => {
    const total = userRequests.length;
    let open = 0, inprog = 0, closed = 0;
    let high = 0, med = 0, low = 0;

    const weekAgo = dayjs().subtract(7, "day");
    let last7 = 0;

    for (const r of userRequests) {
      const st = (r.status ?? "").toString().toLowerCase();
      if (st === "açık" || st === "open" || st === "new" || st === "active") open++;
      else if (st.includes("progress") || st.includes("çöz")) inprog++;
      else if (st === "kapalı" || st === "closed" || st === "done" || st === "resolved") closed++;

      const pri = (r.priority ?? "").toString().toLowerCase();
      if (pri === "high" || pri === "yüksek") high++;
      else if (pri === "low" || pri === "düşük") low++;
      else med++;

      if (r.createdAt && dayjs(r.createdAt).isAfter(weekAgo)) last7++;
    }
    return { total, open, inprog, closed, high, med, low, last7 };
  }, [userRequests]);

  const pct = (n) => (stats.total ? Math.round((n / stats.total) * 100) : 0);

  return (
    <div className="profile-page" style={{ background: "#fff", minHeight: "100%" , borderRadius:10}}>
      <div className="container container-left" style={{ padding:20 }}>
        <h2 className="section-title">{t("profile.title")}</h2>
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="toolbar flex-wrap"  style={{ justifyContent: "space-between" }}>
            <div className="card-sub">{t("profile.languageHint")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label className="card-sub" htmlFor="lng" style={{ fontWeight: 600 }}>
                {t("common.language")}
              </label>
              <select
                id="lng"
                className="select"
                value={i18n.language}
                onChange={(e) => {
                  i18n.changeLanguage(e.target.value);
                  localStorage.setItem("i18nextLng", e.target.value);
                }}
                style={{ width: 120 }}
              >
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        <Row className="g-3" style={{ marginBottom: 12 }}>
          <Col xs={12} sm={6} md={3}>
            <SummaryCard title={t("profile.activity.total")} value={stats.total} icon="bi-collection" />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <SummaryCard title={t("requests.status.open")} value={stats.open} icon="bi-envelope-open" color="#3B8AFF" />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <SummaryCard title={t("requests.status.inProgress")} value={stats.inprog} icon="bi-envelope-paper" color="#FAC885" />
          </Col>
          <Col xs={12} sm={6} md={3}>
            <SummaryCard title={t("requests.status.closed")} value={stats.closed} icon="bi-envelope-check" color="#54C104" />
          </Col>
        </Row>

        <Row className="g-3" style={{ marginBottom: 12 }}>
          <Col md={6}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <Card.Title as="h6" className="mb-3">
                  {t("profile.activity.byStatus")}
                </Card.Title>

                <MetricRow
                  label={t("requests.status.open")}
                  count={stats.open}
                  percent={pct(stats.open)}
                  barColor="#3B8AFF"
                  icon="bi-envelope-open"
                />
                <MetricRow
                  label={t("requests.status.inProgress")}
                  count={stats.inprog}
                  percent={pct(stats.inprog)}
                  barColor="#FAC885"
                  icon="bi-envelope-paper"
                />
                <MetricRow
                  label={t("requests.status.closed")}
                  count={stats.closed}
                  percent={pct(stats.closed)}
                  barColor="#54C104"
                  icon="bi-envelope-check"
                />

                <div className="divider" />
                <small className="text-muted">
                  {t("profile.activity.last7days")}: <strong>{stats.last7}</strong>
                </small>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <Card.Title as="h6" className="mb-3">
                  {t("profile.activity.byPriority")}
                </Card.Title>

                <MetricRow
                  label={t("requests.priority.high")}
                  count={stats.high}
                  percent={pct(stats.high)}
                  barColor="var(--pri-high-text)"
                  badgeClass="pri-high"
                  icon="bi-arrow-up-circle"
                />
                <MetricRow
                  label={t("requests.priority.medium")}
                  count={stats.med}
                  percent={pct(stats.med)}
                  barColor="var(--pri-med-text)"
                  badgeClass="pri-medium"
                  icon="bi-dash-circle"
                />
                <MetricRow
                  label={t("requests.priority.low")}
                  count={stats.low}
                  percent={pct(stats.low)}
                  barColor="var(--pri-low-text)"
                  badgeClass="pri-low"
                  icon="bi-arrow-down-circle"
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}


function SummaryCard({ title, value, icon, color }) {
  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div>
          <div className="card-sub mb-1">{title}</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
        </div>
        <div
          className="d-inline-flex align-items-center justify-content-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: color ? `${color}22` : "#eef2ff",
            color: color || "var(--brand)",
          }}
        >
          <i className={`bi ${icon}`} />
        </div>
      </Card.Body>
    </Card>
  );
}

function MetricRow({ label, count, percent, barColor, badgeClass, icon }) {
  return (
    <div className="mb-3">
      <div className="d-flex align-items-center justify-content-between mb-1">
        <div className="d-flex align-items-center gap-2">
          <i className={`bi ${icon}`} style={{ color: barColor }} />
          <span className={`badge ${badgeClass ? `border ${badgeClass}` : "bg-light text-dark"}`}>
            {label}
          </span>
        </div>
        <div className="card-sub">
          <strong>{count}</strong> <span className="text-muted">({percent}%)</span>
        </div>
      </div>
      <ProgressBar now={percent} style={{ height: 8, background: "#eef2ff" }} variant="none">
        <div
          style={{
            width: `${percent}%`,
            background: barColor,
            height: 8,
            borderRadius: 4,
          }}
        />
      </ProgressBar>
    </div>
  );
}
