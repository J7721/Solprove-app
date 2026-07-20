// The single pre-launch switch for the whole site.
//
// While false:
//   - /app and /parent show a "coming soon" placeholder instead of the real tool
//   - "Program" is hidden from the nav and footer
//   - every "Start free trial" CTA becomes "Coming Soon - Join The Waitlist"
//
// On launch day: flip this to true, redeploy, and everything above reverts automatically.
export const LAUNCHED = false;

// Every "Coming Soon - Join The Waitlist" button links here — the real signup
// form lives in the #waitlist section on the home page.
export const WAITLIST_HREF = "/#waitlist";

export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mdaqzdor";
