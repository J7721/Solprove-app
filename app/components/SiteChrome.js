"use client";
import { usePathname } from "next/navigation";
import NavAuth from "./NavAuth";

const tabStyle = (active) => ({
  padding: "8px 16px",
  borderRadius: 7,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  textDecoration: "none",
  color: active ? "#12181b" : "rgba(255,255,255,.6)",
  background: active ? "#ffffff" : "transparent",
});

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isLanding = pathname === "/" || ["/pricing", "/about", "/contact", "/privacy", "/terms"].includes(pathname);

  // The marketing pages ship their own full-bleed nav/header/footer,
  // so skip the app's utility nav + constrained width wrapper on those routes.
  if (isLanding) return children;

  const onWorkspace = pathname.startsWith("/app");
  const onReports = pathname.startsWith("/parent");

  return (
    <>
      <div style={{ background: "#0f2740", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <a href="/app" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/solprove-logo.png" alt="Solprove" style={{ width: 30, height: 30, borderRadius: 7, objectFit: "cover" }} />
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 17, color: "#ffffff" }}>Solprove</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginLeft: 4, paddingLeft: 12, borderLeft: "1px solid rgba(255,255,255,.18)" }}>
            <i>Solve It To Prove</i>
          </span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,.08)", borderRadius: 9, padding: 3 }}>
            <a href="/app" style={tabStyle(onWorkspace)}>Workspace</a>
            <a href="/parent" style={tabStyle(onReports)}>Reports</a>
          </div>
          <NavAuth />
        </div>
      </div>
      <main style={{ maxWidth: 1180, margin: "0 auto", padding: "0 32px" }}>{children}</main>
    </>
  );
}
