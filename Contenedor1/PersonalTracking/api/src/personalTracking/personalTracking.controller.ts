// src/personalTracking/personalTracking.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PersonalTrackingService } from './personalTracking.service';

@Controller('personal-tracking')
export class PersonalTrackingController {
  constructor(private readonly personalTrackingService: PersonalTrackingService) {}

  @Get()
  getStatus() {
    return { status: 'Personal Tracking module up' };
  }
}