import React from "react";
export default function Avatar({ name="U", src="", size=36 }) {
  const style = { width:size, height:size, borderRadius:999, overflow:"hidden", border:"1px solid #e5e7eb", background:"#fff", display:"grid", placeItems:"center" };
  return (
    <div style={style}>
      {src ? <img src={src} alt={name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> :
        <b style={{ fontSize:12, color:"#6b7280" }}>{(name||"U").slice(0,2).toUpperCase()}</b>}
    </div>
  );
}
