import React from "react";
export default function EmptyState({ title="Boş", children }) {
  return <div className="card"><b>{title}</b>{children && <div style={{marginTop:8}}>{children}</div>}</div>;
}
