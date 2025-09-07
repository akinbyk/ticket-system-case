import React from "react";
export default function RequestFooter({ code, username, onOpen, label }) {
  return (
    <>
      <div className="req-divider" />
      <div className="req-bottom">
        <div className="req-meta">
          <span className="card-sub">Kod: {code}</span>
          <span className="dot-sep">•</span>
          <span className="card-sub">{username}</span>
        </div>
        <button className="linklike" onClick={onOpen}>{label}</button>
      </div>
    </>
  );
}
