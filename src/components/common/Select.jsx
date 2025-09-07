import React from "react";
export default function Select({ children, ...props }) {
  return <select className="select" {...props}>{children}</select>;
}
