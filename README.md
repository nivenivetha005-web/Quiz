# NID DAT 2027 — Design GK Lab

A learning-first GK web app for NID DAT 2027 preparation, built around Interaction Design, New Media Design and Information Design.

Learning cycle: **Learn → See → Practice → Quiz → Review → Repeat.** Progress, spaced repetition and the mistake notebook are stored locally in the browser (`localStorage`) — nothing leaves the device.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router for navigation
- Zustand (`persist` middleware) for the local progress store

## Running locally

```bash
npm install
npm run dev      # dev server
npm run build    # typecheck + production build
npm run preview  # serve the production build
```

## Content architecture

All syllabus content lives in `src/data/` and is designed to grow without touching any UI code:

- `src/types.ts` — shared shapes: `Topic`, `Question` (mcq / scenario / visual-id / match / odd-one-out / assertion-reason / sequence / flashcard), `Scheme`, `CurrentAffairsEvent`.
- `src/data/topics/*.ts` — one file per category (art & culture, crafts, architecture, design history, interaction design, technology, sustainability, heritage, science). Each `Topic` carries facts, connections, structured fields, a visual descriptor and a memory hook.
- `src/data/schemes.ts` — Indian government schemes/missions, each with the full LEARN structure the spec calls for (purpose, ministry, launch year, visual identity, etc).
- `src/data/currentAffairs.ts` — date-tagged current-affairs events. Seeded with verified, well-documented milestones; **extend this file** with new dated entries as the exam approaches — the schema (date, category, why it matters, design connection, possible question, source) never needs to change.
- `src/data/questions/*.ts` — the question bank, grouped by category/type, aggregated in `src/data/questions/index.ts`.

Adding content is additive: push a new object into the right array and it's automatically picked up by every quiz mode, the Learn pages, and the progress engine.

## Engine

- `src/store/progress.ts` — spaced-repetition scheduling (1/3/7/14/30-day ladder), topic mastery status, mistake notebook, quiz history, streaks.
- `src/engine/quizBuilders.ts` — builders for Daily/Weekly/Monthly/Exam/Rapid Fire/Visual/Scheme/Current-Affairs/Mistakes/category practice, all weak-topic aware.
- `src/engine/studyPlanner.ts` — the "Study for me" plan generator and the default weekly schedule.
- `src/engine/stats.ts` — category mastery and dashboard aggregation.

## A note on visuals

There's no bundled image library — visual recognition (crafts, art, architecture, scheme logos) is driven by carefully written **visual-identity descriptions** rather than photographs, so recognition practice never depends on unverified or low-quality source images. The `Topic.visualDescriptor` / `MCQQuestion.visualDescriptor` fields are exactly where a real image would plug in later without changing any other code.
