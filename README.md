# Solprove

**[Try the interactive preview](https://www.solprove.co.uk/product.html)** · [Try the marking demo](https://www.solprove.co.uk/demo.html)

Solprove is a GCSE Maths revision app that gives students feedback on their working as well as their final answer. A student can type a question or submit a photo, review a worked solution, and then see which steps earned method and accuracy marks.

## Try it in a minute

1. Open the [marking demo](https://www.solprove.co.uk/demo.html) and choose the sample that ends with `x = 3`.
2. Select **Mark sample answer**. It earns **1/2**: subtracting 7 was correct, but dividing 12 by 3 gives `x = 4`.
3. Try the correct sample to see **2/2**, then open the [interactive preview](https://www.solprove.co.uk/product.html) to try tiered practice, a timed mini mock, the calculator and the progress view.

The public preview uses fixed examples and fictional accounts. It does not require a login, call the AI marking service, save your answers or take payments. **The full student workspace is still pre-launch.**

## What the app does

- **Worked solutions and marking:** The tutor accepts typed or photographed work. Marking separates extraction of the student's steps from assessment against a rubric. Built-in questions use stored marking criteria.
- **Practice and mocks:** The question bank contains 82 questions tagged by topic and tier. Practice can revisit weaker topics, and timed mocks support Foundation and Higher tiers with calculator and non-calculator papers.
- **Progress:** The app tracks topic accuracy and common mistakes, and includes a parent progress view. Its grade estimate is a rough revision aid.

Solprove is a personal project built with AI-assisted development. The focus is on making feedback useful when a student knows the method but makes a mistake along the way.

## How it fits together

| Part | Where to look |
| --- | --- |
| Public preview and marking example | [`public/product.html`](public/product.html), [`public/demo.html`](public/demo.html) |
| Student workspace and mock exams | [`app/app`](app/app) |
| Tutor, marking and practice endpoints | [`app/api`](app/api) |
| Marking pipeline and stored rubrics | [`lib/marking.js`](lib/marking.js), [`data/question-bank.json`](data/question-bank.json) |

**Stack:** JavaScript, Next.js and React; the Anthropic API for worked solutions and marking; Supabase for accounts and progress storage. The full app also has Stripe and Resend integrations.

## Run locally

To run the public demos without accounts or API keys, serve the `public` folder from the repository root with Python 3:

```bash
python3 -m http.server 8000 --directory public
```

Open [the local preview](http://localhost:8000/product.html) or [the local marking demo](http://localhost:8000/demo.html).

For development on the Next.js app, install Node.js and run:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use [`.env.example`](.env.example) as a guide and put development credentials in `.env.local`, which is ignored by Git. Live solving and marking need Anthropic and Supabase configuration. The student workspace is gated by the launch flag in [`lib/launch.js`](lib/launch.js).

The optional `npm run consistency` script compares the scores from five markings of the same example. It makes live API calls and checks repeatability for that example only.
