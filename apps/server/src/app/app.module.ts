import { Module } from '@nestjs/common';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [ReviewModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
