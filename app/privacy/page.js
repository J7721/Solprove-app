import MarketingNav from "../components/MarketingNav";
import MarketingFooter from "../components/MarketingFooter";
import { LAUNCHED } from "../../lib/launch";

export const metadata = { title: "Privacy Policy — Solprove" };

// This policy flips automatically with the LAUNCHED switch in lib/launch.js —
// see terms/page.js for the same pattern.
function buildSections(launched) {
  const sections = [
    {
      h: "What we collect",
      body: launched
        ? [
            "Account details: your email address (and a parent/guardian email if you add one for progress reports).",
            "Content you upload: photos or text of maths questions and your working, so we can mark it.",
            "Progress data: your marking results, scores, and mistake-pattern history over time.",
            "Payment details, if you subscribe: handled entirely by our payment processor, Stripe. We never see or store your full card details.",
            "Messages you send us: via the chat widget, email, or the contact form.",
          ]
        : [
            "Waitlist and contact form: your email address, and your name/message if you use the contact form.",
            "Chat widget and inbound email: the messages you send us, so we (or our AI assistant) can reply.",
            "Once the product launches: the maths questions and attempts you upload (including photos), your marking results and progress history, your account email, and — if you subscribe — payment details, which are handled entirely by our payment processor; we never see or store your card details.",
          ],
    },
    {
      h: "Why we collect it",
      body: launched
        ? [
            "To mark your work, track your progress, and generate parent reports.",
            "To run your account and, if you subscribe, your billing.",
            "To respond to questions sent via chat, email, or the contact form.",
            "To understand aggregate usage (see Cookies and analytics below) so we can improve the product.",
            "We do not sell your data, and we do not use it for advertising.",
          ]
        : [
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
        "Anthropic (Claude) — processes chat messages, inbound emails, and homework content to generate responses and marking.",
        "Supabase — stores account and progress data.",
        "Stripe — processes subscription payments; Solprove never sees full card details.",
        "Vercel — hosts the site and provides privacy-focused analytics (see below).",
        "None of these providers are permitted to use your data for their own purposes. Some are based outside the UK; where that's the case, we rely on their standard contractual data protection safeguards.",
      ],
    },
    {
      h: "About children's data",
      body: [
        "Solprove is designed for GCSE students, most of whom are under 18. We only collect what's needed to provide the tutoring and reporting service, we don't profile students for marketing, and we don't show ads.",
        "The weekly parent progress report is a deliberate feature, not an afterthought — it's designed to keep a trusted adult involved. If you're under 18, we recommend a parent or guardian sets up and manages your account. Parents can ask us to access or delete their child's data at any time.",
      ],
    },
    {
      h: "Cookies and analytics",
      body: [
        "We use Vercel Analytics, a privacy-focused analytics tool that measures aggregate visits, referrers, country, and device type. It's cookieless — it doesn't track you across other websites and can't identify you personally.",
        "We don't use advertising or cross-site tracking cookies. If that changes, we'll update this page.",
      ],
    },
    {
      h: "How long we keep it",
      body: launched
        ? [
            "We keep account and progress data for as long as your account is active, plus a reasonable period afterwards in case you resubscribe, unless you ask us to delete it sooner.",
            "Payment records are kept for as long as required by UK accounting and tax law.",
            "Contact and waitlist messages are kept until you ask us to delete them, or after a reasonable period of inactivity.",
          ]
        : [
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
      body: ["Questions about this policy: hello@solprove.co.uk."],
    },
  ];

  return sections;
}

export default function Privacy() {
  const SECTIONS = buildSections(LAUNCHED);

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
        <p style={{ fontSize: 14, color: "#5b6b6f", margin: 0 }}>Last updated: August 2026</p>
        <p style={{ fontSize: 15.5, lineHeight: 1.7, color: "#5b6b6f", margin: "20px 0 0" }}>
          {LAUNCHED
            ? "This is a plain-English summary of what we collect and why."
            : "This is a plain-English summary of what we collect and why. Solprove is currently pre-launch — some sections describe how things will work once the full product goes live."}
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
