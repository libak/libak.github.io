# Repository Guidelines

## Project Structure & Module Organization
This repository is a small Next.js 15 app using the App Router and TypeScript. Route entry files live in `src/app/`, including `layout.tsx`, `page.tsx`, and `globals.css`. Weather-specific code is grouped under `src/app/features/weather/` by responsibility: `ui/` for components, `model/` for types, `usecase/` for feature logic, and `util/` for helpers. Shared styling utilities live in `src/app/common/`. Static assets and deployment files live in `public/`, including `public/assets/images/`, `public/.well-known/assetlinks.json`, `public/CNAME`, and `public/privacypolicy.html`.

## Build, Test, and Development Commands
Use `npm install` to set up dependencies.

- `npm run dev`: start the local dev server on `http://localhost:3000`.
- `npm run build`: create the production static export used for deployment.
- `npm run start`: run the built app locally when applicable.
- `npm run lint`: run the Next.js ESLint ruleset.
- `npm run deploy`: build and publish the exported site to GitHub Pages via `gh-pages`.

The app is configured with `output: 'export'` in `next.config.ts`, so changes should remain compatible with static hosting.

## Coding Style & Naming Conventions
Use TypeScript throughout and keep indentation consistent with the existing codebase: two spaces in config files, four spaces in some app files. Match the surrounding file instead of reformatting unrelated code. Use PascalCase for React component files (`WaveChart.tsx`), descriptive camelCase for functions and variables, and keep feature code inside `src/app/features/weather/` rather than flattening it into `src/app/`. Lint with `npm run lint` before opening a PR.

## Testing Guidelines
There is currently no automated test suite or `npm test` script. Until one is added, treat `npm run lint` and a successful `npm run build` as the minimum verification for changes. If you add tests later, place them close to the feature or under a dedicated `tests/` directory and name them after the unit under test.

## Commit & Pull Request Guidelines
Recent commits use short, imperative summaries such as `Map wind & wave arrows` and `organizing`. Keep commit messages concise, focused, and scoped to one change. For pull requests, include a brief description, note any static-export or deployment impact, link the related issue when available, and attach screenshots for UI changes.

## Security & Config Notes
Do not commit secrets. Treat files like `public/.well-known/assetlinks.json` and `public/CNAME` as deployment-sensitive and update them deliberately.
