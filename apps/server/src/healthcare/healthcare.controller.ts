import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HealthcareService, Source } from './healthcare.service';

@Controller('healthcare')
export class HealthcareController {
  constructor(private readonly healthcareService: HealthcareService) {}

  @Get('seedDB')
  async seedDB() {
    return this.healthcareService.seedDB();
  }

  @Post('search')
  async search(@Body() body: { text: string }) {
    console.log('SEARCHING FOR: ', body.text);
    return this.healthcareService.search(body.text);
  }

  @Get('recommended/:source/:id')
  async recommended(@Param('id') id: string, @Param('source') source: Source) {
    console.log('recommendation for : ', id);
    return this.healthcareService.recommended(id, source);
  }

  @Get('get/:source/:id')
  async get(@Param('id') id: string, @Param('source') source: Source) {
    return this.healthcareService.get(id, source);
  }
}
