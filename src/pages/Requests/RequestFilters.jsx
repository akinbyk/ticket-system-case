// src/pages/requests/RequestFilters.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import PrioritySelect from "../../components/common/PrioritySelect.jsx";

export default function RequestFilters({ q, setQ, status, setStatus, priority, setPriority }) {
  const { t } = useTranslation();


  const STATUS_OPTS = useMemo(() => [
    { value:"all",       label:t("requests.filters.allStatuses") },
    { value:"Açık",      label:t("requests.status.open") },
    { value:"Çözülüyor", label:t("requests.status.inProgress") },
    { value:"Kapalı",    label:t("requests.status.closed") },
  ], [t]);


  const PRIORITY_OPTS = useMemo(() => [
    { value:"all",    label:t("requests.filters.allPriorities") },
    { value:"high",   label:t("requests.priority.high") },
    { value:"medium", label:t("requests.priority.medium") },
    { value:"low",    label:t("requests.priority.low") },
  ], [t]);

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="toolbar" style={{ gap: 12, flexWrap: "wrap" }}>
        <input
          className="input filter-input"
          placeholder={t("common.search")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 2, minWidth: 220 }}
        />

        <div style={{ flex: 1, minWidth: 200 }}>
          <label
            className="card-sub"
            style={{ fontWeight: 700, display: "block", marginBottom: 6 }}
          >
            {t("detail.status")}
          </label>
          <PrioritySelect
            id="status-filter"
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            options={STATUS_OPTS}
            ariaLabel={t("detail.status")}
          />
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <label
            className="card-sub"
            style={{ fontWeight: 700, display: "block", marginBottom: 6 }}
          >
            {t("detail.priority")}
          </label>
          <PrioritySelect
            id="priority-filter"
            value={priority}
            onChange={(e)=>setPriority(e.target.value)}
            options={PRIORITY_OPTS}
            ariaLabel={t("detail.priority")}
          />
        </div>
      </div>
    </div>
  );
}
