import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class EncryptionService {
  private readonly encryptionKey: string;

  constructor(private configService: ConfigService) {
    this.encryptionKey =
      this.configService.get<string>('ENCRYPTION_KEY') ||
      'default-encryption-key-change-in-production';
  }

  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
  }

  decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
