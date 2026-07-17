export default function Landing() {
  return (
    <>
      <style>{`
        :root{
          --navy:#0f1b3d; --navy2:#16244f; --ink:#1c2340; --slate:#5a6482;
          --green:#18b57a; --green-d:#0e9c67; --amber:#ffb648;
          --bg:#f7f8fc; --card:#ffffff; --line:#e6e9f2;
          --radius:16px;
        }
        html{scroll-behavior:smooth}
        h1,h2,h3{font-family:'Sora','Inter',sans-serif;line-height:1.15}
        .wrap{max-width:1080px;margin:0 auto;padding:0 24px}
        .btn{display:inline-block;background:var(--green);color:#fff;font-weight:700;padding:15px 30px;border-radius:12px;text-decoration:none;border:none;font-size:16px;cursor:pointer;transition:transform .15s, background .15s;box-shadow:0 6px 20px rgba(24,181,122,.35)}
        .btn:hover{background:var(--green-d);transform:translateY(-2px)}
        .btn.ghost{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.35);box-shadow:none}
        .btn.ghost:hover{background:rgba(255,255,255,.08)}
        .pill{display:inline-flex;align-items:center;gap:8px;background:rgba(24,181,122,.12);color:var(--green-d);font-weight:600;font-size:13.5px;padding:7px 14px;border-radius:999px}
        .pill.light{background:rgba(255,255,255,.12);color:#c9f5e3}

        .site-nav{background:var(--navy);position:sticky;top:0;z-index:50}
        .nav-in{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;max-width:1080px;margin:0 auto}
        .logo{display:flex;align-items:center;gap:10px;color:#fff;font-family:'Sora';font-weight:800;font-size:21px;text-decoration:none}
        .nav-cta{font-size:14px;padding:10px 20px}

        .site-header{background:linear-gradient(160deg,var(--navy) 0%,var(--navy2) 55%,#1b2f6b 100%);color:#fff;padding:72px 0 88px;position:relative;overflow:hidden}
        .site-header::after{content:"";position:absolute;right:-140px;top:-140px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(24,181,122,.25),transparent 65%)}
        .hero{display:grid;grid-template-columns:1.15fr .85fr;gap:56px;align-items:center;position:relative;z-index:1}
        .hero h1{font-size:clamp(32px,4.6vw,50px);font-weight:800;margin:20px 0 18px}
        .hero h1 em{font-style:normal;color:var(--green);white-space:nowrap}
        .hero p.sub{font-size:18px;color:#c6cdE6;max-width:520px;margin-bottom:30px}
        .hero .micro{font-size:13.5px;color:#93a0c9;margin-top:14px}
        .mock{background:#fff;border-radius:20px;padding:26px;color:var(--ink);box-shadow:0 30px 60px rgba(4,10,35,.45);transform:rotate(1.5deg)}
        .mock .q{font-size:14px;color:var(--slate);border-bottom:1px dashed var(--line);padding-bottom:12px;margin-bottom:14px}
        .mock .q b{color:var(--ink)}
        .row{display:flex;justify-content:space-between;align-items:center;padding:9px 12px;border-radius:10px;font-size:14.5px;margin-bottom:8px}
        .row.ok{background:#eafaf2}
        .row.miss{background:#fff4e3}
        .row .m{font-weight:700}
        .row.ok .m{color:var(--green-d)}
        .row.miss .m{color:#c77700}
        .mock .total{display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding-top:14px;border-top:2px solid var(--ink);font-weight:800;font-size:17px}
        .mock .badge{font-size:11.5px;background:var(--navy);color:#9ef0cd;padding:5px 10px;border-radius:999px;letter-spacing:.4px}

        .land-section{padding:76px 0}
        .kicker{color:var(--green-d);font-weight:700;font-size:13.5px;letter-spacing:1.4px;text-transform:uppercase}
        h2.title{font-size:clamp(26px,3.4vw,36px);margin:12px 0 14px}
        .lead{color:var(--slate);max-width:640px;font-size:17px}

        .grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:44px}
        .feat{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:26px 22px;transition:transform .2s,box-shadow .2s}
        .feat:hover{transform:translateY(-4px);box-shadow:0 16px 34px rgba(15,27,61,.09)}
        .feat .ico{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;font-size:22px;margin-bottom:16px;background:rgba(24,181,122,.12)}
        .feat h3{font-size:17px;margin-bottom:8px}
        .feat p{font-size:14.5px;color:var(--slate)}

        .compare{background:var(--navy);color:#fff;border-radius:24px;padding:52px 48px}
        .compare table{width:100%;border-collapse:collapse;margin-top:30px;font-size:15px}
        .compare th,.compare td{padding:14px 12px;text-align:center;border-bottom:1px solid rgba(255,255,255,.12)}
        .compare th:first-child,.compare td:first-child{text-align:left}
        .compare th{color:#9aa7cf;font-weight:600;font-size:13.5px;text-transform:uppercase;letter-spacing:.8px}
        .compare td.us{background:rgba(24,181,122,.14);font-weight:700;color:#aef3d6}
        .compare .x{color:#ff8f8f}.compare .y{color:var(--green)}

        .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:44px}
        .step{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:30px 24px;position:relative}
        .step .n{position:absolute;top:-16px;left:24px;width:34px;height:34px;border-radius:10px;background:var(--green);color:#fff;font-weight:800;display:grid;place-items:center;font-size:16px}
        .step h3{font-size:17px;margin:10px 0 8px}
        .step p{font-size:14.5px;color:var(--slate)}

        .land-section details{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px 24px;margin-bottom:12px}
        .land-section summary{font-weight:700;cursor:pointer;font-size:15.5px}
        .land-section details p{margin-top:10px;color:var(--slate);font-size:14.5px}

        .waitlist{background:linear-gradient(150deg,var(--green-d),var(--green));border-radius:24px;padding:56px 48px;text-align:center;color:#fff}
        .waitlist h2{font-size:clamp(24px,3vw,32px);margin-bottom:10px}
        .waitlist p{opacity:.92;max-width:520px;margin:0 auto 28px}
        .wl-form{display:flex;gap:10px;max-width:480px;margin:0 auto;flex-wrap:wrap;justify-content:center}
        .wl-form input{flex:1;min-width:240px;padding:15px 18px;border-radius:12px;border:none;font-size:15.5px;font-family:inherit}
        .wl-form button{background:var(--navy);box-shadow:none}
        .wl-form button:hover{background:#000}
        .waitlist .tiny{font-size:12.5px;opacity:.85;margin-top:16px}

        .site-footer{background:var(--navy);color:#8e9bc4;padding:36px 0;font-size:13.5px;text-align:center}
        .site-footer a{color:#c6cdE6}

        @media(max-width:860px){
          .hero{grid-template-columns:1fr;gap:40px}
          .grid4{grid-template-columns:1fr 1fr}
          .steps{grid-template-columns:1fr}
          .compare{padding:36px 22px;overflow-x:auto}
        }
        @media(max-width:520px){.grid4{grid-template-columns:1fr}}
      `}</style>

      <nav className="site-nav">
        <div className="nav-in">
          <a className="logo" href="#" aria-label="Solprove home">
            <img src="/solprove-logo.png" alt="Solprove" style={{ height: 34, width: 34, borderRadius: 9, objectFit: "cover", display: "block" }} />
            <span>Solprove</span>
            <span style={{ color: "#7de8bd", fontSize: 12.5, fontWeight: 600, fontStyle: "italic", marginLeft: 2, fontFamily: "Inter" }}>Solve it to prove</span>
          </a>
          <a className="btn nav-cta" href="#waitlist">Join the waitlist</a>
        </div>
      </nav>

      <header className="site-header">
        <div className="wrap hero">
          <div>
            <span className="pill light">🇬🇧 Built for AQA GCSE Maths · Launching September</span>
            <h1>Solve it to prove. <em>Every time.</em></h1>
            <p className="sub" style={{ fontSize: 19, color: "#e8ecfa" }}>The AI maths tutor that marks like a real examiner — your child photographs their GCSE maths homework, works through it, and <strong style={{ color: "#7de8bd" }}>proves</strong> they've got it.</p>
            <p className="sub">Step-by-step help matched to the AQA spec, plus a weekly report showing exactly where they're improving.</p>
            <a className="btn" href="#waitlist">Join the waitlist — it&apos;s free</a>
            <a className="btn ghost" href="#how" style={{ marginLeft: 10 }}>How it works</a>
            <p className="micro">£11.99/month at launch · 7-day free trial · Cancel in two clicks, always</p>
          </div>
          <div className="mock" aria-hidden="true">
            <p className="q">Q7. Solve <b>x² − 5x + 6 = 0</b> &nbsp;·&nbsp; <b>Maya&apos;s answer:</b> x = 2, x = 3 (working shown)</p>
            <div className="row ok"><span>Factorising method chosen correctly</span><span className="m">M1 ✓</span></div>
            <div className="row ok"><span>Correct factors (x−2)(x−3)</span><span className="m">M1 ✓</span></div>
            <div className="row miss"><span>Final answers stated — one sign slip in working</span><span className="m">A0 ✗</span></div>
            <div className="total"><span className="badge">MARKED LIKE AQA</span><span>2 / 3 marks</span></div>
          </div>
        </div>
      </header>

      <section className="land-section">
        <div className="wrap">
          <span className="kicker">Why Solprove</span>
          <h2 className="title">Not another answer machine.<br />A tutor that shows the marks.</h2>
          <p className="lead">ChatGPT gives answers. Tutors cost £35–40 an hour. Solprove marks your child&apos;s <strong>own working</strong> the way examiners do — and never changes its mind.</p>
          <div className="grid4">
            <div className="feat"><div className="ico">📸</div><h3>Snap, don&apos;t struggle</h3><p>Stuck at 9pm on question 7? Photo it. Get the method explained step-by-step at the right tier — Foundation or Higher.</p></div>
            <div className="feat"><div className="ico">✅</div><h3>Examiner-style marking</h3><p>Method marks, accuracy marks, and exactly where each mark was won or lost. The same answer always gets the same score — guaranteed.</p></div>
            <div className="feat"><div className="ico">📊</div><h3>Parents see progress</h3><p>A plain-English email every Sunday: topics practised, accuracy trend, and the two areas to focus on next. Chats stay private.</p></div>
            <div className="feat"><div className="ico">🎯</div><h3>100% on-spec</h3><p>Every question maps to the official AQA 8300 specification. No wasted evenings on topics that will never appear in the exam.</p></div>
          </div>
        </div>
      </section>

      <section className="land-section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="compare">
            <span className="kicker" style={{ color: "#7de8bd" }}>The honest comparison</span>
            <h2 className="title">Same goal. Very different value.</h2>
            <table>
              <tbody>
                <tr><th></th><th>Private tutor</th><th>Big-name AI apps</th><th>Solprove</th></tr>
                <tr><td>Cost per month</td><td>£150+</td><td>£17–25</td><td className="us">£11.99</td></tr>
                <tr><td>Available 9pm Sunday</td><td className="x">✗</td><td className="y">✓</td><td className="us">✓</td></tr>
                <tr><td>Consistent marking</td><td className="y">✓</td><td className="x">✗ documented failures</td><td className="us">✓ guaranteed &amp; tested nightly</td></tr>
                <tr><td>Weekly parent report</td><td>Sometimes</td><td className="x">✗</td><td className="us">✓</td></tr>
                <tr><td>Marks your child&apos;s own working</td><td className="y">✓</td><td className="x">Hit &amp; miss</td><td className="us">✓ mark-by-mark</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="how" className="land-section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <span className="kicker">How it works</span>
          <h2 className="title">Three steps to unstuck</h2>
          <div className="steps">
            <div className="step"><span className="n">1</span><h3>Photo the question</h3><p>Homework, revision guide or practice paper — snap it and Solprove reads it, then confirms the question before solving. No silent misreads.</p></div>
            <div className="step"><span className="n">2</span><h3>Learn the method</h3><p>A clear, step-by-step walkthrough at your child&apos;s tier — built to show working the way teachers and examiners want to see it.</p></div>
            <div className="step"><span className="n">3</span><h3>Get marked &amp; improve</h3><p>Their own attempt is marked like the real exam. Weak topics are tracked automatically and turned into targeted practice.</p></div>
          </div>
        </div>
      </section>

      <section className="land-section" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <span className="kicker">Questions parents ask</span>
          <h2 className="title" style={{ marginBottom: 28 }}>Fair questions. Straight answers.</h2>
          <details open><summary>Which exam boards do you cover?</summary><p>AQA (8300) at launch, Foundation and Higher tiers. Edexcel is next — waitlist members vote on priority.</p></details>
          <details><summary>Is this just ChatGPT in a wrapper?</summary><p>No. ChatGPT gives answers; Solprove marks your child&apos;s own working against exam-style mark schemes, tracks weak topics over time, and reports progress to you. And the same answer always gets the same mark — we test this automatically every night.</p></details>
          <details><summary>Is my child&apos;s data safe?</summary><p>Parent-owned accounts, UK GDPR compliant, no data ever sold. Conversations are private from everyone — including you. Your weekly report shows topics and progress, never chats.</p></details>
          <details><summary>What if it&apos;s not for us?</summary><p>7-day free trial, cancel in two clicks from your account page, and we email you before every renewal. No dark patterns — we want to be the trustworthy option in this market.</p></details>
        </div>
      </section>

      <section id="waitlist" className="land-section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="waitlist">
            <h2>Parent of a Year 10 or 11? Get in first.</h2>
            <p>Join the waitlist for the free September beta. Founding members lock their price for life and shape what gets built next.</p>
            {/* TODO: replace with real Formspree/Tally form ID */}
            <form className="wl-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
              <input type="email" name="email" required placeholder="you@email.com" aria-label="Email address" />
              <button className="btn" type="submit">Join the waitlist</button>
            </form>
            <p className="tiny">No spam — a handful of emails between now and launch. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="wrap">
          <p style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9 }}>
            <img src="/solprove-logo.png" alt="" style={{ width: 22, height: 22, borderRadius: 6 }} />
            <strong style={{ color: "#fff" }}>Solprove</strong> · Solve it to prove — the AI GCSE maths tutor that marks like a real examiner, consistently.
          </p>
          <p style={{ marginTop: 6 }}>Independent UK founder · <a href="mailto:hello@solprove.co.uk">hello@solprove.co.uk</a> · Privacy policy (coming with beta)</p>
        </div>
      </footer>
    </>
  );
}
