import NavAuth from "./components/NavAuth";

export const metadata = {
  title: "Solprove — AI GCSE Maths Tutor",
  description: "Step-by-step GCSE maths help, marked like a real examiner.",
  icons: { icon: "/solprove-logo.png" },
};

const link = { color: "#c6cde6", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "6px 12px", borderRadius: 8 };

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", background: "#f7f8fc", color: "#1c2340" }}>
        <nav style={{ background: "#0f1b3d", padding: "14px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/solprove-logo.png" alt="Solprove" style={{ width: 34, height: 34, borderRadius: 9, objectFit: "cover" }} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>Solprove</span>
          <span style={{ color: "#8e9bc4", fontSize: 13, marginLeft: 8, fontStyle: "italic" }}>Solve it to prove</span>
          <span style={{ flex: 1 }} />
          <a href="/" style={link}>Student</a>
          <a href="/parent" style={link}>Parent view</a>
          <NavAuth />
        </nav>
        <main style={{ maxWidth: 820, margin: "0 auto", padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}
