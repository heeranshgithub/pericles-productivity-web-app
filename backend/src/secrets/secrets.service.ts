import { Injectable, Logger } from '@nestjs/common';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

interface SecretConfig {
  name: string;
  envKey: string;
}

@Injectable()
export class SecretsService {
  private readonly logger = new Logger(SecretsService.name);
  private readonly client: SecretsManagerClient;
  private readonly isProduction: boolean;
  private readonly secretsConfig: SecretConfig[] = [
    {
      name: 'pericles-backend/mongodb_uri',
      envKey: 'MONGODB_URI',
    },
    {
      name: 'pericles-backend/jwt_secret',
      envKey: 'JWT_SECRET',
    },
    {
      name: 'pericles-backend/encrytion-key',
      envKey: 'ENCRYPTION_KEY',
    },
    {
      name: 'pericles-backend/frontend_url',
      envKey: 'FRONTEND_URL',
    },
    {
      name: 'pericles-backend/frontend_url_dev',
      envKey: 'FRONTEND_URL',
    },
  ];

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';

    if (this.isProduction) {
      this.client = new SecretsManagerClient({
        region: process.env.AWS_REGION || 'ap-south-1',
      });
    }
  }

  async loadSecrets(): Promise<void> {
    if (!this.isProduction) {
      this.logger.log('Not in production, skipping AWS Secrets Manager');
      return;
    }

    this.logger.log('Loading secrets from AWS Secrets Manager...');

    try {
      await Promise.all(
        this.secretsConfig.map((config) => this.loadSecret(config)),
      );
      this.logger.log('Successfully loaded all secrets');
    } catch (error) {
      this.logger.error('Failed to load secrets from AWS Secrets Manager');
      throw error;
    }
  }

  private async loadSecret(config: SecretConfig): Promise<void> {
    try {
      const command = new GetSecretValueCommand({
        SecretId: config.name,
      });

      const response = await this.client.send(command);

      if (!response.SecretString) {
        throw new Error(`Secret ${config.name} has no SecretString value`);
      }

      // Some env keys (like FRONTEND_URL) can intentionally aggregate multiple secrets.
      // If the env var already exists, append the new value comma-separated (deduped).
      const existingValue = process.env[config.envKey];
      const nextValue = response.SecretString.trim();
      if (!existingValue) {
        process.env[config.envKey] = nextValue;
      } else {
        const parts = existingValue
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);
        if (!parts.includes(nextValue)) {
          parts.push(nextValue);
        }
        process.env[config.envKey] = parts.join(',');
      }

      this.logger.log(`✓ Loaded secret: ${config.envKey}`);
    } catch (error) {
      this.logger.error(
        `Failed to load secret ${config.name}: ${error.message}`,
      );
      throw error;
    }
  }
}
