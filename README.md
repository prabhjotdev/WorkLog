# WorkLog

**Track your work. Prove your impact.**

WorkLog is a lightweight productivity and sprint-tracking app for technical
professionals. Track completed work, measure sprint velocity, identify recurring
knowledge gaps, and generate performance-review-ready reports — all in one
personal workspace.

## Features

- **Task management** — create, edit, filter, and track work items with status,
  priority, tags, story points, due dates, and sprint assignment
- **Sprint tracking** — group tasks into sprints and watch velocity (tasks +
  story points) update live
- **Productivity analytics** — sprint velocity, task-status breakdown, and an
  8-week completion trend, plus headline KPIs
- **Knowledge gap tracking** — log recurring blockers/learning gaps with
  recurrence counts and resolution status
- **Performance reports** — generate a review-ready markdown summary of your
  completed work, velocity, and learning areas, then copy to clipboard

## Tech stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | React, TypeScript, Tailwind CSS, Redux Toolkit |
| Backend  | Supabase (PostgreSQL + Supabase Auth)          |
| Build    | Vite                                           |
| Hosting  | Firebase Hosting                               |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the contents of [`supabase/schema.sql`](supabase/schema.sql)
   — this creates all tables, indexes, RLS policies, triggers, and the
   `get_sprint_velocity` RPC.
3. Enable the **Email** auth provider (Authentication → Providers).

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in your project values (Project Settings → API):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Run

```bash
npm run dev      # start dev server at http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
npm run lint     # run eslint
```

## Deployment (Firebase Hosting)

The repo includes `firebase.json` (SPA rewrites + asset caching) and
`.firebaserc`.

```bash
npm run build
npx firebase deploy
```

Set your production Supabase credentials in `.env.production` before building
(same keys as `.env.local`). Update the `default` project id in `.firebaserc`
to match your Firebase project.

## Project structure

```
src/
  components/   # UI — layout, shared primitives, and per-domain components
  hooks/        # typed Redux hooks + data hooks (useTasks, useSprints, …)
  lib/          # supabase client singleton + shared constants
  pages/        # one component per route (lazy-loaded)
  services/     # Supabase query functions (no React)
  store/        # Redux Toolkit store + slices
  types/        # database + app-level TypeScript types
  utils/        # pure helpers (filtering, velocity, report generation)
supabase/
  schema.sql    # full database schema — run once in the Supabase SQL editor
```
