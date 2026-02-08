import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('health')
  checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
