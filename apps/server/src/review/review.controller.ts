import { Controller, Get, Param } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('pull-requests')
  async getPullRequests() {
    return this.reviewService.fetchPullRequests();
  }

  @Get('pull-request/:id/diff')
  async getPullRequestDiff(@Param('id') prNumber: string) {
    return this.reviewService.getPullRequestDiff(prNumber);
  }

  @Get('pull-request/:id/review')
  async reviewPullRequest(@Param('id') prNumber: string) {
    return this.reviewService.reviewAndCommentOnPR(prNumber);
  }
}
