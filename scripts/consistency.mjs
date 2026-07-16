// The nightly promise-keeper: marks the same attempt N times and fails loudly if any score differs.
// Run: npm run consistency
import fs from "fs";
import path from "path";

// Load .env.local manually (this script runs outside Next.js)
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
}

const { markAttempt } = await import("../lib/marking.js");
const bank = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "question-bank.json"), "utf8"));

const RUNS = 5;
const fixture = {
  question: "Solve x² − 7x + 10 = 0",
  attempt: "(x−2)(x−5)=0 so x = −2 and x = −5",  // deliberate sign error: should always lose the final A1
  tier: "foundation",
  rubric: bank.questions.find(q => q.id === "alg-b-01").rubric,
};

console.log(`Numio consistency test — marking the same attempt ${RUNS}× ...`);
const scores = [];
for (let i = 1; i <= RUNS; i++) {
  const r = await markAttempt(fixture);
  scores.push(`${r.score}/${r.out_of}`);
  console.log(`  run ${i}: ${r.score}/${r.out_of}`);
}

const allSame = scores.every(s => s === scores[0]);
if (allSame) {
  console.log(`\n✅ PASS — identical score every run (${scores[0]}). The promise holds.`);
  process.exit(0);
} else {
  console.error(`\n❌ FAIL — scores varied: ${scores.join(", ")}. DO NOT SHIP until fixed.`);
  process.exit(1);
}
