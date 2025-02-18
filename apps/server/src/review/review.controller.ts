import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Post('pull-request/:id/review')
  async reviewPullRequest(
    @Body()
    body: {
      repoOwner: string;
      repoName: string;
      prNumber: string;
      gitHubToken: string;
    }
  ) {
    return this.reviewService.reviewAndCommentOnPR(
      body.repoOwner,
      body.repoName,
      body.prNumber,
      body.gitHubToken
    );
  }
}
