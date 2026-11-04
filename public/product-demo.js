"use strict";

const byId = (id) => document.getElementById(id);
const questions = [
  { id: "alg-f-02", tier: "foundation", topic: "Algebra", text: "Solve 5(x − 2) = 20", answer: 6 },
  { id: "rat-f-02", tier: "foundation", topic: "Percentages", text: "Find 35% of £240", answer: 84 },
  { id: "ratp-h-01", tier: "higher", topic: "Proportion", text: "y is inversely proportional to x. When x = 4, y = 15. Find y when x = 6.", answer: 10 },
  { id: "rat-b-01", tier: "both", topic: "Percentages", text: "A jacket costs £68 after a 15% reduction. What was its original price?", answer: 80 },
];
const attempts = [];
let question = questions[0];
let checked = false;
let lastTutorAnswer = null;
let mockInterval = null;
let mockDeadline = 0;

function record(q, correct) {
  attempts.push({ topic: q.topic, correct });
}

function updateProgress() {
  const correct = attempts.filter((a) => a.correct).length;
  const missed = attempts.filter((a) => !a.correct);
  const needsPractice = [...new Set(missed.map((a) => a.topic))].join(", ");
  byId("attempts").textContent = String(attempts.length);
  byId("accuracy").textContent = attempts.length ? Math.round(correct / attempts.length * 100) + "%" : "—";
  byId("weak-topic").textContent = needsPractice
    ? "Topics to revisit in this preview: " + needsPractice + "."
    : "No missed topics in this sample session.";
  byId("report").textContent = correct + " of " + attempts.length + " sample answers correct. " +
    (needsPractice ? "Suggested revision: " + needsPractice + "." : "Keep practising to see topic trends.");
}

function showQuestion(next) {
  question = next;
  checked = false;
  byId("practice-question").textContent = next.text;
  byId("practice-answer").value = "";
  byId("practice-result").textContent = "";
}

function nextQuestion() {
  const tier = byId("tier").value;
  const options = questions.filter((q) => q.tier === tier || q.tier === "both");
  const missed = new Set(attempts.filter((a) => !a.correct).map((a) => a.topic));
  const preferred = options.find((q) => q.id !== question.id && missed.has(q.topic));
  const nextIndex = (options.findIndex((q) => q.id === question.id) + 1) % options.length;
  showQuestion(preferred || options[nextIndex]);
}

byId("scan-button").addEventListener("click", () => {
  const scan = byId("sample-scan");
  scan.hidden = !scan.hidden;
  byId("scan-button").setAttribute("aria-expanded", String(!scan.hidden));
  byId("scan-button").textContent = scan.hidden ? "Show sample scan" : "Hide sample scan";
});
byId("tutor-answer").addEventListener("change", () => {
  byId("tutor-result").textContent = "";
});
byId("tutor-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = byId("tutor-answer").value;
  if (answer !== "3" && answer !== "4") return;
  const correct = answer === "4";
  byId("tutor-result").textContent = correct
    ? "2 / 2. Method and accuracy marks earned."
    : "1 / 2. Method mark earned for 3x = 12. Divide 12 by 3 to get x = 4.";
  if (answer !== lastTutorAnswer) {
    lastTutorAnswer = answer;
    record(questions[0], correct);
    updateProgress();
  }
});
byId("next-question").addEventListener("click", nextQuestion);
byId("tier").addEventListener("change", nextQuestion);
byId("practice-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (checked) return;
  const answer = byId("practice-answer").valueAsNumber;
  if (!Number.isFinite(answer)) return;
  checked = true;
  const correct = answer === question.answer;
  record(question, correct);
  byId("practice-result").textContent = correct
    ? "Correct. Select Next question to keep practising."
    : "The expected answer is " + question.answer + ". Try another question on this topic.";
  updateProgress();
});

function finishMock(timedOut) {
  if (mockInterval === null) return;
  clearInterval(mockInterval);
  mockInterval = null;
  const first = byId("mock-a").valueAsNumber === questions[0].answer;
  const second = byId("mock-b").valueAsNumber === questions[1].answer;
  record(questions[0], first);
  record(questions[1], second);
  byId("mock-form").hidden = true;
  byId("timer").hidden = true;
  byId("start-mock").disabled = false;
  byId("start-mock").textContent = "Try the mini mock again";
  byId("mock-result").textContent = (timedOut ? "Time is up. " : "") +
    "Score: " + (Number(first) + Number(second)) + " / 2. Correct answers: x = 6 and £84.";
  updateProgress();
}

byId("start-mock").addEventListener("click", () => {
  if (mockInterval !== null) return;
  byId("mock-form").reset();
  byId("mock-form").hidden = false;
  byId("timer").hidden = false;
  byId("time-left").textContent = "1:30";
  byId("mock-result").textContent = "";
  byId("start-mock").disabled = true;
  mockDeadline = Date.now() + 90_000;
  mockInterval = setInterval(() => {
    const seconds = Math.max(0, Math.ceil((mockDeadline - Date.now()) / 1000));
    byId("time-left").textContent = Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
    if (seconds === 0) finishMock(true);
  }, 250);
  byId("mock-a").focus();
});

byId("mock-form").addEventListener("submit", (event) => {
  event.preventDefault();
  finishMock(Date.now() >= mockDeadline);
});

byId("calc-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const a = byId("calc-a").valueAsNumber;
  const b = byId("calc-b").valueAsNumber;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return;
  const op = byId("operator").value;
  if (op === "divide" && b === 0) {
    byId("calc-result").textContent = "You cannot divide by zero.";
    return;
  }
  const result = { add: () => a + b, subtract: () => a - b, multiply: () => a * b, divide: () => a / b }[op]();
  byId("calc-result").textContent = Number.isFinite(result) ? "Result: " + Number(result.toPrecision(12)) : "Result is too large to display.";
});

document.querySelectorAll("[data-enable]").forEach((button) => { button.disabled = false; });
