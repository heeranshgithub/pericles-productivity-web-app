# Security Documentation

## Authentication

### JWT Token System

- **Library**: `@nestjs/passport` + `passport-jwt`
- **Token type**: Bearer token via `Authorization` header
- **Signing secret**: `JWT_SECRET` environment variable
- **Expiration**: Configurable via `JWT_EXPIRATION` env var (default: `7d`)
- **Payload**: `{ email, sub: userId }`
- **Expiration validation**: Enabled (`ignoreExpiration: false`)

### Guards

| Guard | Strategy | Usage |
|-------|----------|-------|
| `JwtAuthGuard` | `jwt` | All protected endpoints |
| `LocalAuthGuard` | `local` | Login endpoint only |

`JwtAuthGuard` is applied at the controller level on all resource controllers (notes, tasks, focus sessions, dashboard, users).

### Password Security

- **Library**: bcryptjs v3.0.3
- **Salt rounds**: Configurable via `SALT_ROUNDS` env var (default: `10`)
- **Hashing**: Applied on registration and password change
- **Comparison**: `bcrypt.compare()` for login and change-password validation
- **Response sanitization**: Password field is stripped from all user responses before returning to the client

### Auth Endpoints

| Method | Route | Guard | Description |
|--------|-------|-------|-------------|
| `POST` | `/auth/register` | None | Create account |
| `POST` | `/auth/login` | `LocalAuthGuard` | Authenticate and receive token |
| `PATCH` | `/auth/change-password` | `JwtAuthGuard` | Update password (requires current password) |

### Registration Validation (`RegisterDto`)

- `email`: `@IsEmail()`, `@IsNotEmpty()`
- `password`: `@IsString()`, `@IsNotEmpty()`, `@MinLength(6)`
- `name`: `@IsString()`, `@IsNotEmpty()`
- Duplicate email check throws `ConflictException`

### Change Password Flow

1. User submits current password and new password
2. Current password validated against stored hash
3. On mismatch: `BadRequestException('Current password is incorrect')`
4. New password hashed and saved
5. Returns `{ success: true }`

---

## Input Validation

Global `ValidationPipe` applied in `main.ts`:

```
whitelist: true              // Strips unknown properties
forbidNonWhitelisted: true   // Rejects requests with unknown properties
transform: true              // Auto-transforms payloads to DTO instances
```

All endpoints use class-validator DTOs with explicit constraints:

- Notes: `@MaxLength(200)` on title, `@MaxLength(10000)` on content, `@IsEnum(NoteType)` on type
- Tasks: validated via DTOs with appropriate decorators
- User preferences: theme restricted to `light`/`dark`, timer durations bounded (60-14400 seconds)

---

## CORS

Configured in `main.ts`:

- **Allowed origin**: `http://localhost:3000` (frontend)
- **Credentials**: Enabled (cookies and auth headers permitted)

---

## Private Note Encryption

### Implementation

- **Algorithm**: AES (Advanced Encryption Standard)
- **Library**: crypto-js v4.2.0
- **Service**: `EncryptionService` (injectable singleton)
- **Key**: `ENCRYPTION_KEY` environment variable
- **Schema flag**: `isEncrypted: boolean` on each note document

### Encryption Flow

1. User creates or updates a note with `type: 'private'`
2. `EncryptionService.encrypt()` applies `CryptoJS.AES.encrypt(text, key)`
3. Ciphertext stored in MongoDB with `isEncrypted: true`
4. On read, `decryptNoteIfNeeded()` checks the flag and decrypts before returning
5. Decryption failure returns `'[Encrypted - Unable to decrypt]'` (logged, not thrown)

### Type Conversion Handling

When a note's type changes between public and private:

1. Current content retrieved and decrypted if necessary
2. Re-encrypted if converting to private, stored as plaintext if converting to public
3. `isEncrypted` flag updated accordingly

### Authorization

- All note operations require `JwtAuthGuard`
- Ownership check on read, update, and delete: `note.userId === requestUserId`
- Violation throws `ForbiddenException('Access denied')`

### Database Indexes

```
NoteSchema.index({ userId: 1, type: 1 })
NoteSchema.index({ userId: 1, createdAt: -1 })
```

---

## Environment Variables (Security-Related)

| Variable | Purpose | Default |
|----------|---------|---------|
| `JWT_SECRET` | JWT signing key | Dev fallback (must change in production) |
| `JWT_EXPIRATION` | Token lifetime | `7d` |
| `ENCRYPTION_KEY` | AES key for private notes | Dev fallback (must change in production) |
| `SALT_ROUNDS` | bcryptjs hash rounds | `10` |
| `MONGODB_URI` | Database connection | Local MongoDB |

---

## HTTP Exception Handling

| Exception | Usage |
|-----------|-------|
| `UnauthorizedException` | Invalid credentials on login |
| `BadRequestException` | Wrong current password on change-password |
| `ForbiddenException` | Accessing another user's resources |
| `NotFoundException` | Resource not found |
| `ConflictException` | Duplicate email on registration |

---

## Future Enhancements (Encryption)

- **Per-user encryption keys**: Derive keys from user credentials so server-side key compromise doesn't expose all notes
- **Key rotation**: Re-encrypt notes when the encryption key is rotated, with versioned key tracking
- **End-to-end encryption**: Move encrypt/decrypt to the client so plaintext never reaches the server
