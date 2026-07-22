import MarketingNav from "../components/MarketingNav";
import MarketingFooter from "../components/MarketingFooter";

export const metadata = { title: "Privacy Policy — Solprove" };

const SECTIONS = [
  {
    h: "What we collect",
    body: [
      "Waitlist and contact form: your email address, and your name/message if you use the contact form.",
      "Chat widget and inbound email: the messages you send us, so we (or our AI assistant) can reply.",
      "Once the product launches: the maths questions and attempts you upload (including photos), your marking results and progress history, your account email, and — if you subscribe — payment details, which are handled entirely by our payment processor; we never see or store your card details.",
    ],
  },
  {
    h: "Why we collect it",
    body: [
      "To let you join the waitlist and notify you when we launch.",
      "To respond to questions sent via the contact form, chat widget, or email.",
      "Once launched: to mark your work, track your progress, generate parent reports, and run your subscription.",
      "We do not sell your data, and we do not use it for advertising.",
    ],
  },
  {
    h: "Who we share it with",
    body: [
      "We use a small number of specialist providers to run Solprove, and only share what each one needs to do its job:",
      "Formspree — stores waitlist and contact form submissions.",
      "Resend — sends and receives our emails, including AI-drafted replies.",
      "Anthropic (Claude) — processes chat messages, inbound emails, and (once launched) homework content to generate responses and marking.",
      "Supabase — stores account and progress data once the product launches.",
      "Stripe — processes subscription payments; Solprove never sees full card details.",
      "None of these providers are permitted to use your data for their own purposes.",
    ],
  },
  {
    h: "About children's data",
    body: [
      "Solprove is designed for GCSE students, most of whom are under 18. We only collect what's needed to provide the tutoring and reporting service, we encourage parental involvement (the parent progress report is a core feature), and we don't use children's data for marketing or advertising.",
    ],
  },
  {
    h: "Cookies and tracking",
    body: [
      "We don't currently use tracking cookies or third-party analytics. If that changes, we'll update this page.",
    ],
  },
  {
    h: "How long we keep it",
    body: [
      "We keep waitlist and contact data until launch (or until you ask us to delete it), and account data for as long as your account is active plus a reasonable period afterwards, unless you ask us to delete it sooner.",
    ],
  },
  {
    h: "Your rights",
    body: [
      "Under UK GDPR, you can ask us to access, correct, or delete your data, or object to how we use it. Email hello@solprove.co.uk and we'll action it. You can also complain to the UK Information Commissioner's Office (ico.org.uk) if you're unhappy with how we've handled your data.",
    ],
  },
  {
    h: "Contact",
    body: [
      "Questions about this policy: hello@solprove.co.uk.",
    ],
  },
];

export default function Privacy() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "linear-gradient(180deg,#eef8f3 0%,#faf9f6 22%,#faf9f6 100%)", color: "#12181b", minHeight: "100vh" }}>
      <style>{`
        *{box-sizing:border-box}
        @media(max-width:640px){
          .privacy-hero{padding:52px 20px 32px !important}
          .privacy-h1{font-size:28px !important}
        }
      `}</style>
      <MarketingNav current="privacy" />

      <section className="privacy-hero" style={{ maxWidth: 760, margin: "0 auto", padding: "72px 32px 24px" }}>
        <h1 className="privacy-h1" style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 700, color: "#12181b", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 14, color: "#5b6b6f", margin: 0 }}>Last updated: July 2026</p>
        <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#5b6b6f", margin: "20px 0 0" }}>
          This is a plain-English summary of what we collect and why. Solprove is currently pre-launch — some sections describe how things
          will work once the full product goes live.
        </p>
      </section>

      <section style={{ maxWidth: 760, margin: "0 auto", padding: "16px 32px 96px" }}>
        {SECTIONS.map(s => (
          <div key={s.h} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 19, fontWeight: 700, color: "#12181b", margin: "0 0 12px" }}>{s.h}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {s.body.map((line, i) => (
                <p key={i} style={{ fontSize: 15, lineHeight: 1.7, color: "#5b6b6f", margin: 0 }}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <MarketingFooter />
    </div>
  );
}
