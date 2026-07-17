"use client";
import { usePathname } from "next/navigation";
import NavAuth from "./NavAuth";

const link = { color: "#c6cde6", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "6px 12px", borderRadius: 8 };

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  // The marketing landing page ships its own full-bleed nav/header/footer,
  // so skip the app's utility nav + constrained width wrapper on that route.
  if (isLanding) return children;

  return (
    <>
      <nav style={{ background: "#0f1b3d", padding: "14px 24px", display: "flex", alignItems: "center", gap: 10 }}>
        <a href="/app" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/solprove-logo.png" alt="Solprove" style={{ width: 34, height: 34, borderRadius: 9, objectFit: "cover" }} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>Solprove</span>
          <span style={{ color: "#8e9bc4", fontSize: 13, marginLeft: 8, fontStyle: "italic" }}>Solve it to prove</span>
        </a>
        <span style={{ flex: 1 }} />
        <a href="/app" style={link}>Student</a>
        <a href="/parent" style={link}>Parent view</a>
        <NavAuth />
      </nav>
      <main style={{ maxWidth: 820, margin: "0 auto", padding: 24 }}>{children}</main>
    </>
  );
}
