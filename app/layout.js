import SiteChrome from "./components/SiteChrome";

export const metadata = {
  title: "Solprove — Solve it to prove. AI GCSE Maths Tutor",
  description: "Solve it to prove. Photo your maths homework, get step-by-step help and consistent examiner-style marking — plus a weekly progress report for parents. Join the waitlist.",
  icons: { icon: "/solprove-logo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", background: "#f7f8fc", color: "#1c2340" }}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
