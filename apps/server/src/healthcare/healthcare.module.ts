import { Module } from '@nestjs/common';
import { HealthcareController } from './healthcare.controller';
import { HealthcareService } from './healthcare.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  controllers: [HealthcareController],
  providers: [HealthcareService, ConfigService],
})
export class HealthcareModule {}
