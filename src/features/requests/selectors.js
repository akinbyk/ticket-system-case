// src/features/requests/selectors.js
export const selectUi = (s) => s.requestsUi;

export const filterRequests = (requests, ui, user) => {
  const text = ui.q.trim().toLowerCase();
  return (requests || []).filter((r) => {
    const matchesText =
      !text || r.title?.toLowerCase().includes(text) || r.code?.toLowerCase().includes(text);
    const matchesStatus = ui.status === "all" || r.status === ui.status;
    const matchesPriority = ui.priority === "all" || r.priority === ui.priority;
    const matchesOwner = user?.role === "admin" ? true : String(r.userId) === String(user?.id);
    return matchesText && matchesStatus && matchesPriority && matchesOwner;
  });
};
