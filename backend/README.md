# Pericles Backend

NestJS REST API for the Pericles productivity app. Provides task management, encrypted notes, focus session tracking, and user authentication.

## Setup

### Prerequisites

- Node.js v22.12.0
- MongoDB instance (local or Atlas)

### Environment Variables

Create a `.env` file in `backend/`:

```env
MONGODB_URI=your-mongodb-uri
DB_NAME=pericles
JWT_SECRET=your-64-char-hex-secret
JWT_EXPIRATION=7d
PORT=5000
ENCRYPTION_KEY=your-64-char-hex-key
SALT_ROUNDS=10
API_V1_PREFIX=              # optional. keeping it empty for now. can be used later for versioning.
DEMO_ACCOUNT_EMAIL=         # optional
DEMO_ACCOUNT_PASSWORD=      # optional
```

### Install & Run

```bash
npm install
npm run start:dev     # development (watch mode)
npm run build         # compile
npm run start:prod    # production
```

### Scripts

| Script        | Description                |
| ------------- | -------------------------- |
| `start:dev`   | Dev server with hot reload |
| `start:debug` | Dev server with debugger   |
| `build`       | Compile TypeScript         |
| `start:prod`  | Run compiled build         |
| `lint`        | ESLint                     |
| `format`      | Prettier                   |

---

## Architecture

```
src/
├── main.ts                    # Entry point, CORS, global pipes
├── app.module.ts              # Root module
├── auth/                      # JWT authentication (Passport)
│   ├── strategies/            # jwt, local
│   ├── guards/                # JwtAuthGuard, LocalAuthGuard
│   └── dto/                   # register, login, change-password
├── users/                     # User profiles & preferences
│   ├── schemas/user.schema.ts
│   └── dto/                   # update-preferences, update-timer-preferences
├── tasks/                     # Task CRUD with status tracking
│   ├── schemas/task.schema.ts
│   └── dto/                   # create-task, update-task, query-tasks
├── notes/                     # Notes with AES encryption for private notes
│   ├── schemas/note.schema.ts
│   └── dto/                   # create-note, update-note, query-notes
├── focus-sessions/            # Pomodoro & stopwatch session tracking
│   ├── schemas/focus-session.schema.ts
│   └── dto/                   # start-session, end-session
├── dashboard/                 # Aggregated stats endpoint
└── encryption/                # AES encryption service (crypto-js)
```

### Key Design Decisions

- **Global ValidationPipe** with `whitelist`, `forbidNonWhitelisted`, and `transform` enabled
- **JWT auth** via Passport with Bearer token extraction; 7-day expiration
- **Password hashing** with bcryptjs (configurable salt rounds)
- **Private notes** encrypted at rest using AES (crypto-js) with a server-side key
- **CORS** configured for `http://localhost:3000` (frontend)
- **Database indexes** on userId + status/type and userId + createdAt for all collections

---

## API Documentation

All endpoints except `/auth/register` and `/auth/login` require a JWT Bearer token in the `Authorization` header.

### Auth

| Method | Endpoint                | Body                               | Description         |
| ------ | ----------------------- | ---------------------------------- | ------------------- |
| POST   | `/auth/register`        | `{ email, password, name }`        | Register a new user |
| POST   | `/auth/login`           | `{ email, password }`              | Login, returns JWT  |
| PATCH  | `/auth/change-password` | `{ currentPassword, newPassword }` | Change password     |

**Response** (register/login):

```json
{
  "access_token": "eyJhbG...",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

### Users

| Method | Endpoint                      | Body                                              | Description                          |
| ------ | ----------------------------- | ------------------------------------------------- | ------------------------------------ |
| GET    | `/users/me`                   | -                                                 | Get current user profile             |
| PUT    | `/users/preferences`          | `{ themePreference }`                             | Update theme (`light` / `dark`)      |
| PATCH  | `/users/me/timer-preferences` | `{ defaultWorkDuration?, defaultBreakDuration? }` | Update timer defaults (60-14400 sec) |

### Tasks

| Method | Endpoint            | Body / Query                        | Description             |
| ------ | ------------------- | ----------------------------------- | ----------------------- |
| POST   | `/tasks`            | `{ title, description? }`           | Create task             |
| GET    | `/tasks`            | `?status=PENDING\|COMPLETED`        | List tasks (filterable) |
| GET    | `/tasks/stats`      | -                                   | Get task counts         |
| GET    | `/tasks/:id`        | -                                   | Get single task         |
| PUT    | `/tasks/:id`        | `{ title?, description?, status? }` | Update task             |
| PUT    | `/tasks/:id/toggle` | -                                   | Toggle task status      |
| DELETE | `/tasks/:id`        | -                                   | Delete task             |

**Task statuses**: `PENDING`, `COMPLETED`

### Notes

| Method | Endpoint        | Body / Query                  | Description                 |
| ------ | --------------- | ----------------------------- | --------------------------- |
| POST   | `/notes`        | `{ title, content, type }`    | Create note                 |
| GET    | `/notes`        | `?type=PUBLIC\|PRIVATE`       | List notes (filterable)     |
| GET    | `/notes/recent` | -                             | Last 3 notes                |
| GET    | `/notes/:id`    | -                             | Get single note (decrypted) |
| PUT    | `/notes/:id`    | `{ title?, content?, type? }` | Update note                 |
| DELETE | `/notes/:id`    | -                             | Delete note                 |

**Note types**: `PUBLIC`, `PRIVATE` (encrypted at rest)

### Focus Sessions

| Method | Endpoint                 | Body                                                      | Description               |
| ------ | ------------------------ | --------------------------------------------------------- | ------------------------- |
| POST   | `/focus-sessions/start`  | `{ sessionType?, targetDuration?, isBreak?, startTime? }` | Start session             |
| POST   | `/focus-sessions/end`    | `{ endTime? }`                                            | End active session        |
| GET    | `/focus-sessions/active` | -                                                         | Get active session        |
| GET    | `/focus-sessions/recent` | -                                                         | Last 3 completed sessions |
| GET    | `/focus-sessions/stats`  | -                                                         | Session statistics        |
| GET    | `/focus-sessions`        | -                                                         | List all sessions         |
| DELETE | `/focus-sessions/:id`    | -                                                         | Delete session            |

**Session types**: `POMODORO`, `STOPWATCH`

**Stats response**:

```json
{
  "totalSessions": 42,
  "totalTime": 63000,
  "averageTime": 1500,
  "todaySessions": 3,
  "todayTime": 4500
}
```

### Dashboard

| Method | Endpoint           | Description                                        |
| ------ | ------------------ | -------------------------------------------------- |
| GET    | `/dashboard/stats` | Aggregated stats across tasks, notes, and sessions |

---

## Database Schemas

### User

| Field                                 | Type              | Notes                  |
| ------------------------------------- | ----------------- | ---------------------- |
| email                                 | string            | unique, required       |
| password                              | string            | bcrypt hashed          |
| name                                  | string            | required               |
| themePreference                       | `light` \| `dark` | default: `light`       |
| timerPreferences.defaultWorkDuration  | number            | default: 1500 (25 min) |
| timerPreferences.defaultBreakDuration | number            | default: 300 (5 min)   |

### Task

| Field       | Type                     | Notes              |
| ----------- | ------------------------ | ------------------ |
| userId      | ObjectId                 | ref: User          |
| title       | string                   | max 200 chars      |
| description | string                   | max 1000 chars     |
| status      | `PENDING` \| `COMPLETED` | default: `PENDING` |

### Note

| Field       | Type                  | Notes                                 |
| ----------- | --------------------- | ------------------------------------- |
| userId      | ObjectId              | ref: User                             |
| title       | string                | max 200 chars                         |
| content     | string                | max 10000 chars, encrypted if private |
| type        | `PUBLIC` \| `PRIVATE` | required                              |
| isEncrypted | boolean               | auto-set based on type                |

### FocusSession

| Field          | Type                      | Notes                       |
| -------------- | ------------------------- | --------------------------- |
| userId         | ObjectId                  | ref: User                   |
| startTime      | Date                      | required                    |
| endTime        | Date \| null              | null while active           |
| duration       | number \| null            | seconds, calculated on end  |
| isActive       | boolean                   | one active session per user |
| sessionType    | `POMODORO` \| `STOPWATCH` | default: `POMODORO`         |
| targetDuration | number \| null            | seconds                     |
| isBreak        | boolean                   | default: false              |

All schemas include `createdAt` and `updatedAt` timestamps.
