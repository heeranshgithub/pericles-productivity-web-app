# AWS AppRunner Deployment - Secrets Manager Integration

## Summary

Implemented AWS Secrets Manager integration for the Pericles backend to securely load secrets at runtime in production environments.

## Changes Made

### 1. New Files Created

#### `backend/src/secrets/secrets.service.ts`
- Service that fetches secrets from AWS Secrets Manager
- Only activates in production (`NODE_ENV === production`)
- Loads secrets and injects them as environment variables before app bootstrap
- Configured secrets:
  - `pericles-backend/mongodb_uri` → `MONGODB_URI`
  - `pericles-backend/jwt_secret` → `JWT_SECRET`
  - `pericles-backend/encrytion-key` → `ENCRYPTION_KEY`

#### `backend/src/secrets/secrets.module.ts`
- NestJS module for secrets service

#### `backend/src/secrets/README.md`
- Documentation for the secrets integration

### 2. Modified Files

#### `backend/src/main.ts`
- Added import for `SecretsService`
- Added secret loading before app bootstrap in production:
  ```typescript
  if (process.env.NODE_ENV === 'production') {
    const secretsService = new SecretsService();
    await secretsService.loadSecrets();
  }
  ```

#### `backend/apprunner.yaml`
- **Removed**: Invalid `valueFrom` fields (lines 31-36)
- **Added**: `AWS_REGION` environment variable for Secrets Manager
- **Added**: `FRONTEND_URL` environment variable (set to placeholder)
- **Fixed**: Node.js version changed from `22.21.1` to `22.12.0` to match `package.json`

#### `backend/package.json`
- **Added**: `@aws-sdk/client-secrets-manager` dependency (v3.990.0)

#### `backend/.env.example`
- Added AWS configuration comment

## How It Works

### Production Flow (NODE_ENV === production)

1. **App starts** → `main.ts` bootstrap function
2. **Secrets loaded** → `SecretsService.loadSecrets()` fetches secrets from AWS Secrets Manager
3. **Environment variables set** → Secrets are injected as `process.env` variables
4. **App initializes** → NestJS app created with secrets available via `ConfigService`
5. **MongoDB connects** → Uses the loaded `MONGODB_URI` from Secrets Manager

### Development Flow (NODE_ENV !== production)

1. **App starts** → `main.ts` bootstrap function
2. **Secrets skipped** → `SecretsService` detection skips AWS Secrets Manager
3. **App initializes** → Uses secrets from local `.env` file

## AWS Requirements

### IAM Permissions

The AppRunner service role must have the following IAM policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": [
        "arn:aws:secretsmanager:ap-south-1:325899476773:secret:pericles-backend/*"
      ]
    }
  ]
}
```

### Secrets Format

Each secret in AWS Secrets Manager should be stored as **plain text** (not JSON):

- `pericles-backend/mongodb_uri`: `mongodb+srv://username:password@cluster.mongodb.net/?appName=pericles-prod`
- `pericles-backend/jwt_secret`: `bc637e8ae82a3e1309a0f03f2bb11083c2e0e48c32bc1bd216bcbcbf8437830f`
- `pericles-backend/encrytion-key`: `cbfe1ff320714d8346aefb4d6fc0681a8dcd53c3bbdcc6b44161353f8ff47e74`

## Deployment Checklist

Before deploying to AppRunner:

- [ ] Update `FRONTEND_URL` in `apprunner.yaml` with actual frontend URL
- [ ] Ensure AWS Secrets Manager secrets exist in `ap-south-1` region
- [ ] Verify AppRunner service role has `secretsmanager:GetSecretValue` permission
- [ ] Verify secrets are stored as plain text (not JSON objects)
- [ ] Commit and push changes to GitHub
- [ ] Trigger AppRunner deployment

## Testing Locally

To test the build locally (without AWS Secrets Manager):

```bash
cd backend
npm install
npm run build
NODE_ENV=development npm run start:prod
```

## Troubleshooting

### If deployment fails with "Container exit code: 1"

Check AppRunner logs for:
1. **Secrets loading errors** - Look for "Failed to load secrets from AWS Secrets Manager"
2. **IAM permission errors** - "AccessDeniedException" means role lacks permissions
3. **Secret not found** - "ResourceNotFoundException" means secret doesn't exist or wrong name
4. **MongoDB connection errors** - "MongoServerError" means MONGODB_URI is invalid

### Common Issues

1. **Secret stored as JSON instead of plain text**
   - Fix: Update secret to store the raw value without JSON wrapping

2. **IAM role missing permissions**
   - Fix: Add `secretsmanager:GetSecretValue` to AppRunner service role

3. **Wrong region**
   - Fix: Ensure secrets exist in `ap-south-1` (specified in `apprunner.yaml`)

## Benefits

✅ **Security**: Secrets never committed to repository
✅ **Scalability**: Centralized secret management via AWS Secrets Manager
✅ **Flexibility**: Easy to rotate secrets without code changes
✅ **Separation**: Development uses `.env`, production uses AWS Secrets Manager
✅ **Simplicity**: No manual secret injection required in AppRunner console
