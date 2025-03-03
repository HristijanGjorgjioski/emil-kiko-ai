import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('/:id')
  async get(@Param('id') id: string) {
    return this.moviesService.get(id);
  }

  @Get('haiku')
  async generateHaiku() {
    return this.moviesService.haiku();
  }

  @Get('seedDB')
  async seedDB() {
    return this.moviesService.seedDB();
  }

  @Post('search')
  async search(@Body() body: { text: string }) {
    console.log('SEARCHING FOR: ', body.text);
    return this.moviesService.search(body.text);
  }

  @Post('full-text-search')
  async fullTextSearch(@Body() body: { text: string }) {
    console.log('SEARCHING FOR: ', body.text);
    return this.moviesService.fullTextSearch(body.text);
  }

  @Get('recommended/:id')
  async recommended(@Param('id') id: string) {
    console.log('recommendation for : ', id);
    return this.moviesService.recommended(id);
  }
}
