# Security Documentation

## Authentication

- **JWT Tokens**: 7-day expiration
- **Password Hashing**: bcryptjs with 10 salt rounds
- **Protected Routes**: All API endpoints require valid JWT

## Private Note Encryption

### Strategy

Private notes are encrypted at rest using AES encryption before being stored in MongoDB.

### Implementation

- **Algorithm**: AES (Advanced Encryption Standard)
- **Library**: crypto-js
- **Key Storage**: Environment variable (ENCRYPTION_KEY)
- **Encryption Point**: Service layer, before database write
- **Decryption Point**: Service layer, after database read

### Flow

1. User creates/updates private note
2. Content is encrypted using AES with secret key
3. Encrypted content stored in MongoDB
4. On read, content is decrypted before returning to user
5. Only the authenticated owner can decrypt their notes

### Key Management

- Encryption key stored in environment variable
- Minimum 32 characters required
- Must be changed in production
- Key rotation should be implemented for production systems

### Threat Model

- ✅ Database breach: Notes remain encrypted
- ✅ Unauthorized access: User isolation at API level
- ✅ Token theft: Tokens expire after 7 days
- ⚠️ Key compromise: All private notes would be vulnerable
- ⚠️ Server memory dump: Decrypted notes in memory

### Best Practices

1. Use strong, random encryption key (minimum 32 characters)
2. Store encryption key securely (environment variable, secrets manager)
3. Implement key rotation strategy
4. Monitor for unauthorized access attempts
5. Regular security audits
6. Consider client-side encryption for additional security
