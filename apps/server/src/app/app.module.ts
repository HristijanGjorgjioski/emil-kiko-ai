import { Module } from '@nestjs/common';
import { ReviewModule } from '../review/review.module';
import { MoviesModule } from '../movies/movies.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [ReviewModule, MoviesModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
