
if (import.meta.env?.DEV) {
  const c = (window.console = window.console || {});
  const methods = [
    "log",
    "warn",
    "error",
    "info",
    "debug",
    "group",
    "groupCollapsed",
    "groupEnd",
    "table",
    "trace",
  ];
  for (const m of methods) {
    if (typeof c[m] !== "function") c[m] = () => {};
  }
}
