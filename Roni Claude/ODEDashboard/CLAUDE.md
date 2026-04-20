# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server on `http://localhost:5173` with HMR |
| `npm run build` | Build optimized production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on all files |

## Project Overview

**ODEDashboard** is a Hebrew-language content & campaign management dashboard for Oded Creative (Israeli marketing agency with tech and restaurant divisions). The app handles clients, content creation, approvals, scheduling, campaigns, studios (photo/video), reports, and settings.

- **Stack**: React 19 + Vite + React Router 7 + Lucide icons
- **Data**: Mock data only, persisted to localStorage under key `odedashboard.v1`
- **Language**: Hebrew (RTL) only — `<html lang="he" dir="rtl">`
- **Fonts**: Heebo (body) and Assistant (UI) from Google Fonts
- **Phase**: Phase 1 & 2 complete (infrastructure + design system); Phase 3 in progress

## Architecture

### Core Structure

```
src/
  main.jsx                — React root mount
  App.jsx                 — Router setup + ClientProvider wrapper
  routes.jsx              — React Router config (10 pages under AppShell layout)
  context/
    ClientContext.jsx     — Global app state (clients, posts, campaigns, activity, selectedClientId)
  pages/
    Dashboard.jsx         — Overview + quick stats
    Clients.jsx           — Client list + detail view
    ContentFactory.jsx    — Content creation & batch editing
    Approvals.jsx         — Approval workflow
    Schedule.jsx          — Publishing queue & calendar-like scheduling
    Campaigns.jsx         — Campaign management
    PhotoStudio.jsx       — Photo upload & editing UI
    VideoStudio.jsx       — Video upload & editing UI
    Reports.jsx           — Analytics & reporting
    Settings.jsx          — App preferences
  components/
    layout/
      AppShell.jsx        — Main layout wrapper (sidebar + topbar + outlet)
      Sidebar.jsx         — RTL-aware nav menu
      Topbar.jsx          — Search + user menu stub
      PageHeader.jsx      — Page titles + action buttons
      layout.css          — Layout styles (flexbox, RTL)
    preview/
      PostPreview.jsx     — Card component for rendering post/content previews
  lib/
    storage.js            — localStorage wrapper (load, save, patch, reset, ensureSeed)
    seed.js               — Initial mock data (SEED object)
    i18n.js               — Hebrew string lookups (t() function + STRINGS_TREE)
  styles/
    global.css            — Global resets, fonts, colors, tokens
    tokens.css            — Design tokens (colors, spacing, typography)
```

### Data Flow

1. **ClientProvider** initializes state from localStorage (or seed if first run)
2. Pages & components call `useAppState()` to read clients, posts, campaigns, activity, selectedClient
3. `setState()` updates context; effect in ClientProvider auto-persists via `patchState()`
4. No API calls — all reads/writes are in-memory (localStorage)

### Key Conventions

- **Internationalization**: Use `t('path.to.string')` from `lib/i18n.js` (never hardcode Hebrew text)
- **Mock Data**: Seed data in `lib/seed.js` is loaded on first run; `__seeded` flag prevents overwrite
- **RTL**: Already set globally; verify Flexbox layouts don't break with `flex-direction`
- **Icons**: Use Lucide React (`import { IconName } from 'lucide-react'`)
- **Styling**: CSS modules or scoped classes in `pages.css` and `layout.css`; tokens in `tokens.css`

## Development Notes

### Adding a New Page

1. Create `src/pages/NewPage.jsx` exporting a React component
2. Add route to `src/routes.jsx` under the AppShell children
3. Add nav entry to `src/lib/i18n.js` (STRINGS.nav)
4. Add Sidebar link in `src/components/layout/Sidebar.jsx`

### Modifying State

Always go through `useAppState()`:

```jsx
const { state, setState } = useAppState()
setState(prev => ({
  ...prev,
  posts: [...prev.posts, newPost]
}))
```

Storage.js will auto-persist on the next effect cycle.

### Testing Seed Data

To reset to initial mock data:

```javascript
import { resetState, ensureSeed } from './lib/storage.js'
resetState()
ensureSeed() // Reloads page or re-run dev server
```

## Known Constraints

- **No Backend**: Fully client-side; data is lost on browser cache clear
- **No Export**: Reports are UI placeholders; no PDF/CSV download yet
- **No Real Auth**: No user login; single "agency owner" view only
- **Hebrew Only**: String tree is Hebrew; no language switching planned
- **Single Client Selection**: Only one client can be selected at a time
- **Fonts**: Google Fonts (Heebo, Assistant) loaded from CDN—requires internet connection

## Debugging Tips

- **localStorage**: Open DevTools → Application → Local Storage, look for key `odedashboard.v1`
- **React DevTools**: Use React Profiler to track re-renders; check context updates in the tree
- **ESLint**: `npm run lint` catches unused vars (pattern `^[A-Z_]` are ignored)
- **RTL Layout Issues**: Inspect elements with `direction: rtl` and check `margin-left` vs `margin-right`

## Vite Config

Minimal setup: React plugin enabled, dev server on port 5173, `open: false`. No env vars or proxies currently configured.
