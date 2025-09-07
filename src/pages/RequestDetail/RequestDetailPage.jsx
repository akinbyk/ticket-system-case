// src/pages/requests/RequestDetailPage.jsx
import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useGetRequestByIdQuery,
  useAddCommentMutation,
  useUpdateRequestMutation,
  useGetUsersQuery
} from "../../api/requestApi";
import MessageList from "../../components/tickets/MessageList";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PrioritySelect from "../../components/common/PrioritySelect.jsx";

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


function StatusDot({ className }) {
  return <span aria-hidden="true" className={`status-dot ${className || ""}`} />;
}

export default function RequestDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();

  const { data: request, isLoading, error } = useGetRequestByIdQuery(id);
  const { data: users = [] } = useGetUsersQuery(); // <-- mock users
  const [addComment] = useAddCommentMutation();
  const [updateRequest] = useUpdateRequestMutation();
  const user = useSelector((s) => s.auth.user);
  const [msg, setMsg] = useState("");

  // users -> Map
  const userMap = useMemo(() => {
    const m = new Map();
    users.forEach((u) => m.set(String(u.id), u));
    return m;
  }, [users]);

  const isAdmin = user?.role === "admin";
  const isClosed = useMemo(() => {
    const s = norm(request?.status);
    return s === "kapalı" || s === "closed" || s === "resolved" || s === "done";
  }, [request?.status]);

  const dateText = useMemo(
    () => (request?.createdAt ? new Date(request.createdAt).toLocaleString(i18n.language || "tr-TR") : "—"),
    [request?.createdAt, i18n.language]
  );

  const STATUS_OPTS = useMemo(() => ([
    { value: "Açık",      label: t("requests.status.open") },
    { value: "Çözülüyor", label: t("requests.status.inProgress") },
    { value: "Kapalı",    label: t("requests.status.closed") },
  ]), [t]);

  if (isLoading) {
    return (
      <div className="container container-left">
        <div className="card">{t("common.loading")}</div>
      </div>
    );
  }
  if (error || !request) {
    return (
      <div className="container container-left">
        <div className="card" style={{ color: "crimson" }}>{t("common.error")}</div>
      </div>
    );
  }

  const comments = request.comments || [];

  const onChangeStatus = async (e) => {
    if (!isAdmin) return;
    const next = e.target.value; 
    if (!next || next === request.status) return;
    await updateRequest({ id: request.id, status: next });
  };

  const onComment = async (e) => {
    e.preventDefault();
    const text = msg.trim();
    if (!text || !user) return;
    await addComment({
      requestId: request.id,
      authorId: user.id,
      authorName: user.name || user.username,
      text,
      createdAt: new Date().toISOString()
    });
    setMsg("");
  };

  const pKey = priKey(request.priority);

  return (
    <div className="requests-page" style={{ background:"#fff", minHeight:"100%" , borderRadius:10}}>
      <div className="container container-left" style={{ padding:20 }}>
        <h2 className="section-title">{t("detail.title")}</h2>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-row flex-wrap">
            <div className="badges" style={{ marginBottom: 0, alignItems: "center" }}>
              <StatusDot className={statusDotClass(request.status)} />
              <div className="card-title" style={{ fontWeight: 700 }}>
                <span className="ticket-heading">Ticket # {request.code || request.id}</span>
              </div>
              <span className={`badge border pri-${pKey} text-capitalize`} style={{ marginLeft: 6 }}>
                {request.priority || "medium"}
              </span>
            </div>
            {isAdmin && (
              <div style={{ minWidth: 220 }}>
                <label className="card-sub" htmlFor="status" style={{ display:"block", marginBottom:6 }}>
                  {t("detail.status")}
                </label>
                <PrioritySelect
                  id="status"
                  value={request.status}
                  onChange={onChangeStatus}
                  options={STATUS_OPTS}
                  ariaLabel={t("detail.status")}
                />
              </div>
            )}
          </div>
          <div className="divider"></div>
          {request.title ? (
            <p className="card-title" style={{ marginTop: 0, marginBottom: 6, fontWeight: 600 }}>
              {request.title}
            </p>
          ) : null}

          <p style={{ margin: 0 }}>{request.description}</p>

          <p className="card-sub" style={{ marginTop: 8 }}>
            {t("detail.createdBy")}: {request.ownerName || request.userId} • {t("detail.createdAt")}: {dateText}
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>{t("detail.comments")}</h3>
          <MessageList
            items={comments}
            currentUserId={user?.id}
            userMap={userMap}
          />

          {!isClosed && (
            <form onSubmit={onComment} className="comment-form" style={{ marginTop: 12 }}>
              <div className="comment-box">
                <textarea
                  className="input comment-input"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder={t("detail.commentPlaceholder")}
                  aria-label={t("detail.commentPlaceholder")}
                />
                <button className="btn btn-brand comment-send" type="submit">
                  {t("common.send")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
