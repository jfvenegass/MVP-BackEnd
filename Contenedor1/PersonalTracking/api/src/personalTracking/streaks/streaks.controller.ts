// src/personalTracking/streaks/streaks.controller.ts
import { Controller, Get } from '@nestjs/common';
import { StreaksService } from './streaks.service';

@Controller('streaks')
export class StreaksController {
  constructor(private readonly streaksService: StreaksService) {}

  @Get()
  getAllStreaks() {
    return [];
  }
}