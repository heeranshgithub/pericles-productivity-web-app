# Pericles

A productivity suite with task management, encrypted notes, focus session tracking, and user authentication.

## Tech Stack

- **Backend**: NestJS, MongoDB, JWT authentication
- **Frontend**: Next.js, Redux Toolkit + RTK Query, Tailwind CSS, shadcn/ui

## Getting Started

### Prerequisites

- Node.js v20+
- MongoDB instance

### Setup

```bash
# Backend
cd backend
cp .env.example .env   # configure MongoDB URI, JWT secret, etc.
npm install
npm run start:dev       # http://localhost:5000

# Frontend
cd frontend
cp .env.example .env   # configure API URL
npm install
npm run dev             # http://localhost:3000
```

## Documentation

- **[Backend](backend/README.md)** — Setup, API endpoints, database schemas, architecture
- **[Frontend](frontend/README.md)** — Setup, Components, state management, routing

## Demo

Visit the live demo: https://main.d3k9rxmnuc1ssp.amplifyapp.com/
