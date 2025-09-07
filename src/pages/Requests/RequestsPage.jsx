// src/pages/requests/RequestsPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Offcanvas, Pagination } from "react-bootstrap";
import {
  useGetRequestsQuery,
  useGetUsersQuery,
  useCreateRequestMutation,
} from "../../api/requestApi";
import { selectUi } from "../../features/requests/selectors";
import { setQuery, setStatus, setPriority } from "../../features/requests/requestsSlice";
import RequestCard from "../../components/tickets/RequestCard";
import PrioritySelect from "../../components/common/PrioritySelect.jsx";
import { useTranslation } from "react-i18next";
import "bootstrap-icons/font/bootstrap-icons.css";

const PAGE_SIZE = 4;

export default function RequestsPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // UI filtreleri
  const ui = useSelector(selectUi);
  const user = useSelector((s) => s.auth.user);

  // API verileri
  const { data: requests = [], isLoading, error } = useGetRequestsQuery();
  const { data: users = [] } = useGetUsersQuery();

  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [priorityNew, setPriorityNew] = useState("medium");
  const [description, setDescription] = useState("");
  const [createRequest, { isLoading: isSaving }] = useCreateRequestMutation();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [ui.q, ui.status, ui.priority]);

  const userMap = useMemo(() => {
    const m = new Map();
    users.forEach((u) => m.set(String(u.id), u));
    return m;
  }, [users]);

  const STATUS_OPTS = useMemo(
    () => [
      { value: "all", label: t("requests.filters.allStatuses"), color: "#6b7280" },
      { value: "Açık", label: t("requests.status.open"), color: "#3B8AFF" },
      { value: "Çözülüyor", label: t("requests.status.inProgress"), color: "#FAC885" },
      { value: "Kapalı", label: t("requests.status.closed"), color: "#54C104" },
    ],
    [t]
  );

  const PRIORITY_OPTS = useMemo(
    () => [
      { value: "high", label: t("requests.priority.high") },
      { value: "medium", label: t("requests.priority.medium") },
      { value: "low", label: t("requests.priority.low") },
    ],
    [t]
  );

  const filtered = useMemo(() => {
    const text = ui.q.trim().toLowerCase();
    return (requests || []).filter((r) => {
      const matchesText =
        !text || r.title?.toLowerCase().includes(text) || r.code?.toLowerCase().includes(text);
      const matchesStatus = ui.status === "all" || r.status === ui.status;
      const matchesPriority = ui.priority === "all" || r.priority === ui.priority;
      const matchesOwner = user?.role === "admin" ? true : String(r.userId) === String(user?.id);
      return matchesText && matchesStatus && matchesPriority && matchesOwner;
    });
  }, [requests, ui, user]);


  const sorted = useMemo(() => {
    const toTime = (r) => {
      const d = r?.createdAt ? Date.parse(r.createdAt) : NaN;
      return Number.isFinite(d) ? d : -Infinity; 
    };
    return [...filtered].sort((a, b) => toTime(b) - toTime(a));
  }, [filtered]);


  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const pageItems = sorted.slice(startIdx, endIdx);

  const submitNew = async (e) => {
    e?.preventDefault?.();
    if (!title.trim() || !description.trim() || !user) return;
    const nowIso = new Date().toISOString();
    await createRequest({
      title: title.trim(),
      description: description.trim(),
      priority: priorityNew,
      code: `TCK-${Math.floor(Math.random() * 9000 + 1000)}`,
      userId: user.id,
      ownerName: user.name || user.username,
      ownerAvatar: user.avatar || "",
      status: "Açık",
      createdAt: nowIso, 
    });
    setShowNew(false);
    setTitle("");
    setDescription("");
    setPriorityNew("medium");
    setCurrentPage(1); 
  };

  const quickSet = (val) => dispatch(setStatus(val));

  const goTo = (p) => setCurrentPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="requests-page" style={{ background: "#fff", minHeight: "100%",borderRadius:10 }}>
      <div className="" style={{ padding: 20 ,marginLeft: 0, marginRight: 0 }}>
        <h2 className="section-title">{t("requests.title")}</h2>

        <div className="card req-header">
          <div className="toolbar" style={{ gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div className="search-wrap" style={{ flex: "0 0 220px", minWidth: 200 }}>
              <span className="search-icon" aria-hidden="true">
                <i className="bi bi-search" />
              </span>
              <input
                className="input filter-input search-input"
                placeholder={t("common.search")}
                value={ui.q}
                onChange={(e) => dispatch(setQuery(e.target.value))}
                style={{ minHeight: 36 }}
              />
            </div>

            <div className="d-flex align-items-end ms-auto" style={{ gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <div style={{ width: 200 }}>
                <label
                  className="card-sub"
                  style={{ fontWeight: 700, display: "block", marginBottom: 6, textAlign: "right" }}
                >
                  {t("detail.status")}
                </label>
                <PrioritySelect
                  id="status-filter"
                  value={ui.status}
                  onChange={(e) => dispatch(setStatus(e.target.value))}
                  options={STATUS_OPTS}
                  ariaLabel={t("detail.status")}
                />
              </div>

              <div style={{ width: 200 }}>
                <label
                  className="card-sub"
                  style={{ fontWeight: 700, display: "block", marginBottom: 6, textAlign: "right" }}
                >
                  {t("detail.priority")}
                </label>
                <PrioritySelect
                  id="priority-filter"
                  value={ui.priority}
                  onChange={(e) => dispatch(setPriority(e.target.value))}
                  options={[
                    { value: "all", label: t("requests.filters.allPriorities"), color: "#6b7280" },
                    ...PRIORITY_OPTS,
                  ]}
                  ariaLabel={t("detail.priority")}
                />
              </div>

              <div>
                <button
                  className="btn btn-brand d-inline-flex align-items-center"
                  onClick={() => setShowNew(true)}
                >
                  <i className="bi bi-plus-square me-2" aria-hidden="true" />
                  {t("navbar.newRequest")}
                </button>
              </div>
            </div>
          </div>

          <div className="quickf">
            <button
              className={`quickf-item ${ui.status === "all" ? "active" : ""}`}
              onClick={() => quickSet("all")}
              type="button"
            >
              <i className="bi bi-envelope quick-icon" />
              <span>{t("requests.filters.allStatuses")}</span>
            </button>

            <button
              className={`quickf-item ${ui.status === "Açık" ? "active" : ""}`}
              onClick={() => quickSet("Açık")}
              type="button"
            >
              <i className="bi bi-envelope-open quick-icon" />
              <span>{t("requests.status.open")}</span>
            </button>

            <button
              className={`quickf-item ${ui.status === "Çözülüyor" ? "active" : ""}`}
              onClick={() => quickSet("Çözülüyor")}
              type="button"
            >
              <i className="bi bi-envelope-paper quick-icon" />
              <span>{t("requests.status.inProgress")}</span>
            </button>

            <button
              className={`quickf-item ${ui.status === "Kapalı" ? "active" : ""}`}
              onClick={() => quickSet("Kapalı")}
              type="button"
            >
              <i className="bi bi-envelope-check quick-icon" />
              <span>{t("requests.status.closed")}</span>
            </button>
          </div>
        </div>

        {isLoading && <div className="card">{t("common.loading")}</div>}
        {error && <div className="card" style={{ color: "crimson" }}>{t("common.error")}</div>}

        {!isLoading && !error && (
          sorted.length === 0 ? (
            <div className="card">{t("common.noData")}</div>
          ) : (
            <>
              <ul className="list">
                {pageItems.map((r) => {
                  const owner = userMap.get(String(r.userId));
                  return (
                    <RequestCard
                      key={r.id}
                      request={r}
                      owner={owner}
                      openLabel={t("detail.view")}
                    />
                  );
                })}
              </ul>

              {totalPages > 1 && (
              <div className="brand-pagination d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.First onClick={() => goTo(1)} disabled={page === 1} />
                    <Pagination.Prev onClick={() => goTo(page - 1)} disabled={page === 1} />
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Pagination.Item
                        key={p}
                        active={p === page}
                        onClick={() => goTo(p)}
                      >
                        {p}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => goTo(page + 1)} disabled={page === totalPages} />
                    <Pagination.Last onClick={() => goTo(totalPages)} disabled={page === totalPages} />
                  </Pagination>
                </div>
              )}
            </>
          )
        )}
      </div>

      <Offcanvas placement="end" show={showNew} onHide={() => setShowNew(false)} backdrop scroll style={{ width: 420 }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t("navbar.newRequest")}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <form onSubmit={submitNew}>
            <div className="card" style={{ borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,.06)" }}>
              <div style={{ padding: 16 }}>
                <h5 style={{ margin: 0, fontWeight: 700 }}>{t("navbar.newRequest")}</h5>
                <p className="card-sub" style={{ marginTop: 6 }} />
              </div>

              <div className="divider" />

              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label className="card-sub" style={{ fontWeight: 700 }}>
                    {t("newRequest.fields.title")}
                  </label>
                  <input
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("newRequest.placeholders.title")}
                  />
                </div>

                <div>
                  <label className="card-sub" style={{ fontWeight: 700 }}>
                    {t("newRequest.fields.priority")}
                  </label>
                  <PrioritySelect
                    id="priority-new"
                    value={priorityNew}
                    onChange={(e) => setPriorityNew(e.target.value)}
                    options={PRIORITY_OPTS}
                    ariaLabel={t("newRequest.aria.priority")}
                  />
                </div>

                <div>
                  <label className="card-sub" style={{ fontWeight: 700 }}>
                    {t("newRequest.fields.description")}
                  </label>
                  <textarea
                    className="input"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("newRequest.placeholders.description")}
                  />
                </div>

                <div style={{ marginTop: 4 }}>
                  <button
                    type="submit"
                    className="btn btn-brand"
                    style={{ width: "100%", minHeight: 44, fontWeight: 700 }}
                    disabled={isSaving}
                  >
                    {t("common.send")}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
