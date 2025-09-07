// src/components/tickets/MessageList.jsx
import React, { useMemo } from "react";
import { useSelector } from "react-redux";


function tsOf(m) {
  const raw = m?.createdAt || m?.date || m?.created_at || m?.CreatedAt;
  const t = raw ? Date.parse(raw) : Date.now();
  return Number.isFinite(t) ? t : Date.now();
}

function fmt(ts, locale = "tr-TR") {
  try {
    const d = new Date(ts);
    if (isNaN(d)) return "—";
    return d.toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

const sameAuthor = (a, b) =>
  a && b && String(a.authorId ?? a.author?.id) === String(b.authorId ?? b.author?.id);

const closeInTime = (a, b, ms = 5 * 60 * 1000) =>
  Math.abs(tsOf(a) - tsOf(b)) <= ms;

const initials = (name = "") =>
  String(name).trim() ? String(name).trim().charAt(0).toUpperCase() : "?";

const authorIdOf = (m) =>
  String(m?.authorId ?? m?.author?.id ?? m?.author?.email ?? m?.authorName ?? "anon");


function bubbleRadius(isMine, shape) {
  if (shape === "single") {
    return isMine ? "14px 14px 4px 14px" : "14px 14px 14px 4px";
  }
  if (shape === "first") {
    return isMine ? "14px 14px 4px 4px" : "14px 14px 4px 4px";
  }
  if (shape === "middle") {
    return "6px";
  }
  
  return isMine ? "4px 14px 4px 14px" : "14px 4px 14px 4px";
}


export default function MessageList({ items = [], userMap }) {
  const me = useSelector((s) => s.auth.user);
  const locale = useSelector((s) => s.i18n?.language) || "tr-TR";

  const prepared = useMemo(() => {
    const arr = (items || []).map((m) => ({
      ...m,
      __ts: tsOf(m),
    }));

    
    arr.sort((a, b) => a.__ts - b.__ts);

    
    return arr.map((m, idx) => {
      const prev = idx > 0 ? arr[idx - 1] : null;
      const next = idx < arr.length - 1 ? arr[idx + 1] : null;

      const aid = authorIdOf(m);
      const mine = me && String(aid) === String(me.id);

      const joinPrev = prev && sameAuthor(prev, m) && closeInTime(prev, m);
      const joinNext = next && sameAuthor(m, next) && closeInTime(m, next);

      let shape = "single";
      if (joinPrev && joinNext) shape = "middle";
      else if (joinPrev && !joinNext) shape = "last";
      else if (!joinPrev && joinNext) shape = "first";

      const userFromMap = userMap?.get?.(String(aid));
      const name =
        m.authorName ||
        m.author?.name ||
        userFromMap?.name ||
        userFromMap?.username ||
        m.authorId ||
        "Anonim";

      
      const resolvedAvatar =
        m.avatar ||
        m.author?.avatar ||
        userFromMap?.avatar ||
        (mine ? me?.avatar : null) ||
        null;

      return {
        ...m,
        __aid: aid,
        __mine: !!mine,
        __shape: shape,
        __name: name,
        __avatar: resolvedAvatar,
      };
    });
  }, [items, me, userMap]);

  if (!prepared.length) {
    return <p className="card-sub" style={{ margin: 0 }}>Henüz yorum yok.</p>;
  }

  return (
    <ul className="comment-list" style={{ paddingTop: 4 }}>
      {prepared.map((m, idx) => {
        const rowJustify = m.__mine ? "flex-end" : "flex-start";
        const bubbleBg = m.__mine ? "rgba(127,86,216,0.12)" : "#ffffff";
        const bubbleBorder = m.__mine
          ? "1px solid rgba(127,86,216,0.35)"
          : "1px solid var(--border)";
        const timeAlign = m.__mine ? "flex-end" : "flex-start";

        return (
          <li key={m.id || `${m.__aid}-${m.__ts}-${idx}`} style={{ listStyle: "none" }}>
            
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: rowJustify,
                alignItems: "flex-end",
              }}
            >
              
              {!m.__mine &&
                (m.__avatar ? (
                  <img
                    src={m.__avatar}
                    alt={m.__name}
                    className="comment-avatar"
                    style={{ width: 32, height: 32 }}
                  />
                ) : (
                  <div
                    className="comment-avatar placeholder"
                    style={{
                      width: 32,
                      height: 32,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-hidden="true"
                  >
                    {initials(m.__name)}
                  </div>
                ))}

              
              <div
                className={`msg-bubble ${m.__mine ? "mine" : "theirs"}`}
                style={{
                  maxWidth: 560,
                  padding: "8px 10px",
                  background: bubbleBg,
                  border: bubbleBorder,
                  borderRadius: bubbleRadius(m.__mine, m.__shape),
                  color: "#374151",
                  lineHeight: 1.45,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {m.text || m.message || ""}
              </div>

              
              {m.__mine &&
                (m.__avatar ? (
                  <img
                    src={m.__avatar}
                    alt={m.__name}
                    className="comment-avatar"
                    style={{ width: 32, height: 32 }}
                  />
                ) : (
                  <div
                    className="comment-avatar placeholder"
                    style={{
                      width: 32,
                      height: 32,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-hidden="true"
                  >
                    {initials(m.__name)}
                  </div>
                ))}
            </div>

            
            <div
              className="comment-footer"
              style={{ display: "flex", justifyContent: timeAlign, marginTop: 4 }}
            >
              <span className="comment-date" style={{ fontSize: 12, color: "#6b7280" }}>
                {fmt(m.__ts, locale)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
