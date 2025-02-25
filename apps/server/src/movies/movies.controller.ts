import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('haiku')
  async generateHaiku() {
    return this.moviesService.haiku();
  }

  @Get('seedDB')
  async seedDB() {
    return this.moviesService.seedDB();
  }

  @Get('testCache')
  async testCache() {
    return this.moviesService.testCache();
  }

  @Get('similar/:text')
  async similar(@Param('text') text: string) {
    return this.moviesService.similar(text);
  }
}
