# AWS Secrets Manager Integration

This module handles loading secrets from AWS Secrets Manager in production environments.

## How It Works

1. **Environment Detection**: Only activates when `NODE_ENV === production`
2. **Early Loading**: Secrets are loaded in `main.ts` before the NestJS app is created
3. **Automatic Injection**: Secrets are injected as environment variables for `ConfigService` to use

## Secrets Configuration

The following secrets are loaded from AWS Secrets Manager:

| Secret Name | Environment Variable | Usage |
|------------|---------------------|-------|
| `pericles-backend/mongodb_uri` | `MONGODB_URI` | MongoDB connection string |
| `pericles-backend/jwt_secret` | `JWT_SECRET` | JWT signing key |
| `pericles-backend/encrytion-key` | `ENCRYPTION_KEY` | Encryption key for sensitive data |

## AWS Configuration

- **Region**: `ap-south-1` (configured in `apprunner.yaml`)
- **IAM Permissions**: The AppRunner service role must have `secretsmanager:GetSecretValue` permission for the secrets

## Local Development

In local development (`NODE_ENV !== production`), the secrets service is skipped and values are loaded from `.env` file instead.

## Adding New Secrets

To add a new secret:

1. Create the secret in AWS Secrets Manager
2. Add the secret configuration to `secretsConfig` array in `secrets.service.ts`:
   ```typescript
   {
     name: 'pericles-backend/your-secret-name',
     envKey: 'YOUR_ENV_VAR_NAME',
   }
   ```
3. The secret will be automatically loaded and available via `ConfigService`
