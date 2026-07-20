import SiteChrome from "./components/SiteChrome";

export const metadata = {
  title: "Solprove — Solve it to prove. AI GCSE Maths Tutor",
  description: "Solve it to prove. Photo your maths homework, get step-by-step help and consistent examiner-style marking — plus a weekly progress report for parents. Join the waitlist.",
  icons: { icon: "/solprove-logo.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
        />
      </head>
      <body style={{ margin: 0, fontFamily: "'Inter', system-ui, sans-serif", background: "#f4f3ef", color: "#12181b" }}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
