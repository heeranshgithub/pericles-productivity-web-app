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
