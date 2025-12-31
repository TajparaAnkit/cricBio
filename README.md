# cricBio Cricket Score Board 🏏

A lightweight cricket scoreboard web app to manage team and player scores (runs, balls, strike rate) and bowler statistics (overs, maidens, runs, wickets, economy).

> Built with **React + TypeScript** and **Vite**.

---

## Demo & Screenshots

- Live demo: https://tajparaankit.github.io/cricBio/  ✅
- Screenshots are available in `public/images/` (select teams, overs, wicket modal, scoreboard, etc.)

---

## Key Features

- Track team score (runs/wickets/overs) and current run-rate
- Per-batter stats: runs, balls, 4s, 6s, strike rate
- Bowler stats: overs, maidens, runs, wickets, no-balls, wides, economy
- Recent overs view and simple wheel-style scorer buttons
- Simple mobile-first UI (recommended to use on phone)

---

## Quick Start

Prerequisites: Node.js (>=16 recommended) and npm

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
# or
npm start
```

Open the URL printed by Vite (usually http://localhost:5173).

3. Build for production

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Useful scripts (from `package.json`):
- `dev` / `start` — start Vite dev server
- `build` — compile production build
- `preview` — preview production build
- `lint` — run ESLint

---

## Notes

- Current data is held in memory/state — do not refresh the page during a live match or you will lose the session data. Consider exporting or saving state if you need persistence.
- The app is optimized for mobile screens (phone/tablet) for best experience.

---

## Contributing

Contributions, bug reports and enhancements are welcome. Open an issue or a PR with a clear description and reproduction steps.

---

If you'd like, I can add a short CONTRIBUTING.md, include badges, or add a deployment workflow. Which would you prefer next? ✨
