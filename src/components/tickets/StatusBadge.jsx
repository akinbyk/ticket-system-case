import React from "react";
const toKey = (s="") => s.toLowerCase();
export default function StatusBadge({ status }) {
  return <span className={`badge status-${toKey(status)}`}>{status}</span>;
}
