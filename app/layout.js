import SiteChrome from "./components/SiteChrome";
import ChatWidget from "./components/ChatWidget";

const SITE_URL = "https://www.solprove.co.uk";
const TITLE = "Solprove — Solve it to prove. AI GCSE Maths Tutor";
const DESCRIPTION = "Solve it to prove. Photo your maths homework, get step-by-step help and consistent examiner-style marking — plus a weekly progress report for parents. Join the waitlist.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: "/solprove-logo.png" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Solprove",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Solprove — Solve it to prove. Every time." }],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
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
        <ChatWidget />
      </body>
    </html>
  );
}
