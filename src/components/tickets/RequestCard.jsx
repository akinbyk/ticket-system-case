// src/components/tickets/RequestCard.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


function StatusDot({ className }) {
  return <span aria-hidden="true" className={`status-dot ${className || ""}`} />;
}

const norm = (v) => (v ?? "").toString().trim().toLowerCase();


const statusDotClass = (s) => {
  const x = norm(s);
  if (x === "açık" || x === "open" || x === "new" || x === "active") return "status-dot--open";
  if (x === "çözülüyor" || x.includes("progress") || x.includes("devam")) return "status-dot--inprogress";
  if (x === "kapalı" || x === "closed" || x === "resolved" || x === "done") return "status-dot--closed";
  return "status-dot--inprogress"; 
};


const priKey = (p) => {
  const x = norm(p);
  if (x === "high" || x === "yüksek") return "high";
  if (x === "low"  || x === "düşük")  return "low";
  return "medium";
};


const priLabel = (p, t) => {
  const x = norm(p);
  if (x === "high" || x === "yüksek") return t("requests.priority.high");
  if (x === "low"  || x === "düşük")  return t("requests.priority.low");
  return t("requests.priority.medium");
};

export default function RequestCard({
  request,
  owner,
  openLabel,
  onOpen,
}) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const id = request?.id ?? request?._id ?? null;
  const code = request?.code ?? request?.ticketId ?? id ?? "";
  const title = request?.title ?? request?.subject ?? request?.name ?? "";
  const description = request?.description ?? request?.details ?? request?.desc ?? "";
  const status = request?.status ?? request?.state ?? request?.s;
  const priority = request?.priority ?? request?.pri ?? "medium";
  const createdAt =
    request?.createdAt ?? request?.created ?? request?.date ?? request?.created_at ?? null;

  const ownerName = owner?.name ?? owner?.username ?? owner?.fullName ?? "—";
  const avatar = owner?.avatar ?? owner?.photo ?? owner?.image ?? null;

  const locale = i18n.language?.toLowerCase().startsWith("tr") ? "tr-TR" : "en-US";
  const dateText = createdAt ? new Date(createdAt).toLocaleString(locale) : "—";
  const btnText = openLabel || t("detail.view"); // i18n fallback

  const handleOpen = onOpen || (() => { if (id) navigate(`/requests/${id}`); });

  const pKey = priKey(priority);
  const pText = priLabel(priority, t);

  return (
    <Card
      as="li"
      className="shadow-sm mb-3 list-unstyled request-card"
      onClick={handleOpen}
      style={{ cursor: id ? "pointer" : "default" }}
    >
      <Card.Body>
        
        <div className="d-flex flex-wrap align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <StatusDot className={statusDotClass(status)} />
            <Card.Title as="h6" className="mb-0 d-flex align-items-center gap-2">
              <span className="ticket-heading">Ticket # {code || "—"}</span>

              
              <span className={`badge border pri-${pKey}`}>
                {pText}
              </span>
            </Card.Title>
          </div>
          <small className="text-muted">{dateText}</small>
        </div>

        {(title || description) && (
          <div className="mt-2 mb-3">
            {title && <div className="fw-semibold">{title}</div>}
            {description && (
              <Card.Text className="text-secondary small mb-0">{description}</Card.Text>
            )}
          </div>
        )}

        <hr className="my-2" />

        
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="rounded-circle"
                style={{ width: 28, height: 28, objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary"
                style={{ width: 28, height: 28, opacity: 0.25 }}
                aria-hidden="true"
              />
            )}
            <span className="fw-semibold">{ownerName}</span>
          </div>

          <Button
            type="button"
            variant="link"
            size="sm"
            className="p-0 fw-semibold linklike linklike-brand"
            onClick={(e) => { e.stopPropagation(); handleOpen(); }}
            disabled={!id && !onOpen}
            aria-label={t("detail.view")}
          >
            {btnText}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
