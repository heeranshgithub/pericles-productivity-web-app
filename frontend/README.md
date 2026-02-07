# Pericles Frontend

Next.js application for the Pericles productivity suite. Built with the Swiss Design system using Geist Mono, shadcn/ui, and Redux Toolkit with RTK Query.

## Setup

### Prerequisites

- Node.js v22.12.0
- Backend API running on port 5000

### Environment Variables

Create a `.env` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_V1_PREFIX=              # optional. keeping it empty for now. can be used later for versioning.
```

### Install & Run

```bash
npm install
npm run dev           # development (http://localhost:3000)
npm run build         # production build
npm run start         # serve production build
npm run lint          # ESLint
```

---

## Architecture

```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (fonts, providers)
│   ├── page.tsx                      # Redirect to /auth/login
│   ├── globals.css                   # Tailwind + theme tokens (oklch)
│   ├── auth/
│   │   ├── login/page.tsx            # Login form
│   │   └── register/page.tsx         # Registration form
│   └── dashboard/
│       ├── layout.tsx                # Sidebar shell + ProtectedRoute
│       ├── page.tsx                  # Overview with stats & widgets
│       ├── tasks/page.tsx            # Task management
│       ├── notes/page.tsx            # Notes with public/private filter
│       ├── timer/page.tsx            # Pomodoro & stopwatch
│       └── settings/page.tsx         # Theme & preferences
│
├── components/
│   ├── AppSidebar.tsx                # Navigation sidebar
│   ├── ProtectedRoute.tsx            # Auth guard (redirects to login)
│   ├── ReduxProvider.tsx             # Store provider + hydration
│   ├── SidebarContext.tsx            # Sidebar collapse state
│   ├── theme-provider.tsx            # next-themes wrapper
│   ├── auth/
│   │   └── AuthBranding.tsx          # Login/register side panel
│   ├── dashboard/
│   │   └── FocusTimerWidget.tsx      # Mini timer on overview
│   ├── tasks/
│   │   ├── TaskItem.tsx              # Task row with toggle/edit/delete
│   │   └── TaskFormDialog.tsx        # Create/edit task modal
│   ├── notes/
│   │   ├── NoteItem.tsx              # Note card
│   │   ├── NoteFormDialog.tsx        # Create/edit note modal
│   │   └── NoteViewDialog.tsx        # Read-only note viewer
│   ├── timer/
│   │   ├── TimerDisplay.tsx          # Timer face
│   │   ├── TimerControls.tsx         # Start/stop/reset
│   │   └── SessionHistory.tsx        # Past sessions list
│   └── ui/                           # shadcn/ui primitives
│       ├── alert-dialog, badge, button, card, checkbox,
│       │   dialog, input, label, switch, tabs, textarea
│       └── sonner.tsx                # Toast notifications
│
├── store/
│   ├── store.ts                      # configureStore (baseApi + authSlice)
│   ├── hooks.ts                      # useAppDispatch, useAppSelector
│   ├── slices/
│   │   └── authSlice.ts              # Auth state + localStorage persistence
│   └── api/
│       ├── baseApi.ts                # RTK Query base (Bearer token injection)
│       ├── authApi.ts                # Login/register mutations
│       ├── tasksApi.ts               # Task CRUD + stats
│       ├── notesApi.ts               # Note CRUD
│       ├── focusSessionsApi.ts       # Session start/end/stats
│       ├── dashboardApi.ts           # Aggregated stats
│       └── userApi.ts                # Profile & preferences
│
├── types/
│   ├── task.ts                       # TaskStatus enum, Task & TaskStats
│   ├── note.ts                       # NoteType enum, Note interface
│   └── focus-session.ts              # SessionType enum, FocusSession & SessionStats
│
└── lib/
    ├── utils.ts                      # cn() classname helper
    └── utils/
        └── timer.ts                  # formatDuration, presets, constants
```

### Routes

| Route                 | Auth | Description                                 |
| --------------------- | ---- | ------------------------------------------- |
| `/`                   | No   | Redirects to `/auth/login`                  |
| `/auth/login`         | No   | Login form with branding panel              |
| `/auth/register`      | No   | Registration form with branding             |
| `/dashboard`          | Yes  | Overview: stats, timer widget, recent items |
| `/dashboard/tasks`    | Yes  | Task list with status filter & CRUD         |
| `/dashboard/notes`    | Yes  | Notes grid with type filter & CRUD          |
| `/dashboard/timer`    | Yes  | Pomodoro/stopwatch with history             |
| `/dashboard/settings` | Yes  | Theme toggle, user preferences              |

### Key Design Decisions

- **State management**: Redux Toolkit with RTK Query for API caching and tag-based invalidation
- **Auth flow**: JWT stored in localStorage, hydrated into Redux on mount, injected as Bearer token on every request via `baseApi`
- **Protected routes**: `ProtectedRoute` component waits for hydration before checking `isAuthenticated`, redirects to login if unauthenticated
- **API layer**: Single `baseApi` with `injectEndpoints` pattern per feature (no separate `createApi` calls)
- **Styling**: Tailwind CSS 4 with oklch color tokens, Swiss Design system (grid-based, typography-first, no shadows)
- **Dark mode**: Class-based via next-themes, persisted to backend user preferences
- **Component library**: shadcn/ui (new-york style) with Radix primitives, customized for monospace design system
- **Icons**: Lucide React exclusively

### Timer Presets

| Preset     | Work   | Break  |
| ---------- | ------ | ------ |
| Classic    | 25 min | 5 min  |
| Extended   | 50 min | 10 min |
| Deep Focus | 90 min | 20 min |
