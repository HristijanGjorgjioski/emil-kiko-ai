import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  controllers: [MoviesController],
  providers: [MoviesService, ConfigService],
})
export class MoviesModule {}
