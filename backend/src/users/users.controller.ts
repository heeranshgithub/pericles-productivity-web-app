import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateTimerPreferencesDto } from './dto/update-timer-preferences.dto';
import { NotFoundException } from '@nestjs/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req: { user: { userId: string } }) {
    const user = await this.usersService.findById(req.user.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user.toObject();
    return result;
  }

  @Put('preferences')
  async updatePreferences(
    @Request() req: { user: { userId: string } },
    @Body() dto: UpdatePreferencesDto,
  ) {
    const updated = await this.usersService.updateThemePreference(
      req.user.userId,
      dto.themePreference,
    );

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = updated.toObject();
    return result;
  }

  @Patch('me/timer-preferences')
  async updateTimerPreferences(
    @Request() req: { user: { userId: string } },
    @Body() dto: UpdateTimerPreferencesDto,
  ) {
    const updated = await this.usersService.updateTimerPreferences(
      req.user.userId,
      dto,
    );

    if (!updated) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = updated.toObject();
    return result;
  }
}
