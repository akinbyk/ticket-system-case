// src/pages/requests/NewRequestPage.jsx
import React, { useState, useMemo } from "react";
import { useCreateRequestMutation } from "../../api/requestApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrioritySelect from "../../components/common/PrioritySelect.jsx";
import { useTranslation } from "react-i18next";

export default function NewRequestPage() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [createRequest, { isLoading }] = useCreateRequestMutation();
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const PRIORITY_OPTS = useMemo(
    () => [
      { value: "high",   label: t("requests.priority.high"),   color: "#ef4444" },
      { value: "medium", label: t("requests.priority.medium"), color: "#f59e0b" },
      { value: "low",    label: t("requests.priority.low"),    color: "#10b981" },
    ],
    [t]
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !user) return;
    const body = {
      title: title.trim(),
      description: description.trim(),
      priority,
      code: `TCK-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId: user.id,
      ownerName: user.name || user.username,
      ownerAvatar: user.avatar || "",
      status: "Açık",
    };
    await createRequest(body);
    navigate("/requests");
  };

  return (
    <div className="requests-page" style={{ background: "#fff", minHeight: "100%" }}>
      <div className="container container-left" style={{ maxWidth: 900 }}>
        <h2 className="section-title">{t("navbar.newRequest")}</h2>

        <div className="card">
          <form onSubmit={submit} className="req-form">
            <div className="req-form-grid">
              <div className="req-col">
                <label className="card-sub" style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                  {t("newRequest.fields.title")}
                </label>
                <input
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("newRequest.placeholders.title")}
                  style={{ minHeight: 40 }}
                />
              </div>

              <div className="req-col req-col--right">
                <label
                  className="card-sub"
                  style={{ fontWeight: 700, display: "block", marginBottom: 6, textAlign: "right" }}
                >
                  {t("newRequest.fields.priority")}
                </label>
                <PrioritySelect
                  id="priority-new"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={PRIORITY_OPTS}
                  ariaLabel={t("newRequest.aria.priority")}
                />
              </div>
            </div>

            <div>
              <label className="card-sub" style={{ fontWeight: 700, display: "block", marginBottom: 6 }}>
                {t("newRequest.fields.description")}
              </label>
              <textarea
                className="input"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("newRequest.placeholders.description")}
                style={{ minHeight: 120, lineHeight: 1.45 }}
              />
            </div>

            <div className="req-form-actions">
              <button
                className="btn btn-brand"
                type="submit"
                disabled={isLoading}
                style={{ minHeight: 40, fontWeight: 700 }}
                title={t("common.save")}
              >
                {t("common.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
