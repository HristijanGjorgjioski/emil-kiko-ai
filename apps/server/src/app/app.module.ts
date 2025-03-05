import { Module } from '@nestjs/common';
import { ReviewModule } from '../review/review.module';
import { MoviesModule } from '../movies/movies.module';
import { PrismaModule } from '../prisma/prisma.module';
import { HealthcareModule } from '../healthcare/healthcare.module';

@Module({
  imports: [ReviewModule, MoviesModule, HealthcareModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
