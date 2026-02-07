# Pericles Project - Claude AI Context

## Tech Stack

### Backend

- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB with Mongoose ODM
- **Auth**: passport, passport-jwt, passport-local, bcryptjs
- **HTTP Client**: axios

### Frontend

- **Framework**: Next.js (TypeScript)
- **State**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS + shadcn/ui (Radix, Mira theme, teal accent, Geist Mono font)
- **UI**: next-themes, sonner, lucide-react

---

## General Best Practices

- Avoid using the `any` type in both frontend and backend code. Prefer explicit types, interfaces, type aliases, or `unknown` with proper narrowing. If `any` must be used, include a comment explaining why and plan for a typed refactor.

## Frontend Standards

### Naming

- **camelCase**: variables, functions, props (`onUserSelect`, `userData`)
- **PascalCase**: components (`UserProfile`, `ProductList`)
- Descriptive names; avoid generic names

### Safety & Errors

- Always null-check and validate before accessing properties
- Use `?.` and `??` operators
- Try-catch for complex logic only

### Import Order

1. Third-party (React, Next.js)
2. @ aliases (`@/components`, `@/hooks`)
3. Relative paths (`./utils`, `../types`)

### Component Structure

1. States (`useState`)
2. RTK Mutations (`useMutation`)
3. Refs & custom hooks
4. Extract hook data
5. RTK Queries (`useQuery`)
6. `useEffect`
7. `useMemo` / `useCallback`
8. Functions
9. JSX return

### Best Practices

- Avoid overusing `useEffect` - prefer event handlers
- Use `useMemo`/`useCallback` only when measurable benefit
- Leverage RTK Query caching
- Proper dependency arrays
- Comment only complex/non-obvious logic (explain **why**, not **what**)

---

## Backend Standards

### Naming

- **camelCase**: methods, variables (`findUserById`, `validatePaymentData`)
- **PascalCase**: classes, interfaces (`UserAuthenticationService`, `OrderProcessingModule`)
- **UPPER_SNAKE_CASE**: constants (`MAX_RETRY_ATTEMPTS`)
- Specific names; avoid generic (`getData`, `process`)

### Safety & Validation

- Null/undefined checks before operations
- Use `?.` and `??`
- DTOs with class-validator/class-transformer at controller level

### Error Handling

- Try-catch for: external services, DB ops, error-prone code
- Use NestJS HTTP exceptions: `BadRequestException`, `NotFoundException`, `UnauthorizedException`, etc.

### Import Order

1. Node.js built-ins
2. NestJS core (`@nestjs/*`)
3. Third-party (mongoose, bcrypt)
4. Project imports (modules, services)
5. Relative paths (DTOs, interfaces)

### Class Structure

1. Decorators (`@Injectable()`, `@Controller()`)
2. Properties (private, protected, public)
3. Constructor (DI)
4. Lifecycle hooks
5. Public methods
6. Protected methods
7. Private methods
8. Helpers/utilities

### Best Practices

- Proper DI usage; avoid manual instantiation
- Use appropriate scope: `DEFAULT` (singleton), `REQUEST`, `TRANSIENT`
- DTOs for all request validation
- Thin controllers, business logic in services
- Guards for auth, interceptors for cross-cutting, pipes for validation
- Environment variables for config; never hardcode secrets
- Proper caching, DB indexes, avoid N+1 queries
- Comment only complex logic (explain **why**, not **what**)

---

## Project Structure

```
pericles/
├── backend/     # NestJS
├── frontend/    # Next.js
└── .brain-dump/ # Planning docs
```

---
description: STRICTLY follow Pericles Design System (Swiss Design/International Typographic Style) for all frontend UI.
globs: frontend/**/*.{tsx,jsx}
---
# Pericles Design System (Swiss Style)

Refuse to use standard Tailwind presets if they conflict with these rules.

## 1. Core Principles (Swiss Design)
- **Grid-Based**: rigorous alignment.
- **Typography-First**: text is the UI; minimal decoration.
- **Minimalist**: remove shadows, gradients, and rounded corners unless specified.
- **Precision**: 1px borders, consistent 4px spacing steps.

## 2. Typography (Geist Mono)
All text uses `font-mono`.
- **H1 (Page)**: `text-2xl font-bold tracking-tight`
- **H2 (Section)**: `text-lg font-semibold tracking-tight`
- **H3 (Card)**: `text-xs font-medium uppercase tracking-wider text-muted-foreground`
- **Body**: `text-sm leading-relaxed`
- **Label**: `text-xs font-medium tracking-wide`
- **Numbers**: `font-bold tabular-nums`

## 3. Colors & Theme
- **Primary**: Teal (Action/Interactive).
- **Semantic**: Emerald (Success), Amber (Warning), Red (Error).
- **Surface**: `bg-background` (Page), `bg-card` (Container).
- **Border**: `border-border` (Solid), `border-dashed border-border` (Empty States).
- **Hover**: `hover:bg-accent/50 transition-colors duration-150`.

## 4. Components (Copy-Paste Patterns)

### Page Header
```tsx
<div className="flex items-start justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold tracking-tight">Title</h1>
    <p className="text-sm text-muted-foreground mt-1">Description</p>
  </div>
  <Button className="gap-2"><Icon className="h-4 w-4" />Action</Button>
</div>
```

### Stat Card
```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
    <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">LABEL</CardTitle>
    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
  </CardHeader>
  <CardContent className="px-4 pb-4">
    <p className="text-2xl font-bold tabular-nums">{value}</p>
  </CardContent>
</Card>
```

### List Item / Task
```tsx
<div className="group flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors duration-150">
  {/* Content */}
</div>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 px-4">
  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
    <Icon className="h-6 w-6 text-muted-foreground" />
  </div>
  <h3 className="text-sm font-medium mb-1">Title</h3>
  <p className="text-sm text-muted-foreground mb-4 text-center">Description</p>
</div>
```

## 5. Spacing & Icons
- **Icons**: Always Lucide React.
  - Micro: `h-3 w-3`
  - Small: `h-3.5 w-3.5` (Stats, Badges)
  - Default: `h-4 w-4` (Buttons)
- **Spacing**: Multiples of 4px (`gap-2`, `p-4`, `mb-6`).
- **Radius**: `rounded-lg` (standard), `rounded-full` (badges/avatars).

## 6. Forbidden ❌
- NO shadows (`shadow-md`, etc.) - use borders.
- NO arbitrary pixel values (`w-[37px]`) - use spacing scale.
- NO serif or sans-serif fonts - strict monospace.
- NO slow transitions - limit to `duration-150`.
