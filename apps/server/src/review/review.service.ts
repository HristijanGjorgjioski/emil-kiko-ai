import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewService {
  private readonly githubHeaders;
  private readonly aiApiKey: string;
  private readonly aiBaseUrl: string;

  constructor(private http: HttpService, private configService: ConfigService) {
    this.githubHeaders = {
      Authorization: `Bearer ${this.configService.get('GITHUB_TOKEN')}`,
      Accept: 'application/vnd.github.v3+json',
    };
    this.aiApiKey = this.configService.get('AI_ML_API_KEY');
    this.aiBaseUrl = 'https://api.aimlapi.com';
  }

  async fetchPullRequests() {
    const repoOwner = this.configService.get('REPO_OWNER');
    const repoName = this.configService.get('REPO_NAME');
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/pulls`;

    const response = await this.http
      .get(url, { headers: this.githubHeaders })
      .toPromise();
    return response.data;
  }

  async getPullRequestDiff(prNumber: string) {
    const repoOwner = this.configService.get('REPO_OWNER');
    const repoName = this.configService.get('REPO_NAME');
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${prNumber}`;

    const response = await this.http
      .get(url, { headers: this.githubHeaders })
      .toPromise();
    return response.data.diff_url;
  }

  async analyzeCodeWithAI(codeDiff: string) {
    const prompt = `Review the following code diff. Identify potential issues, suggest improvements, and point out any bad practices:\n\n\`\`\`diff\n${codeDiff}\n\`\`\``;

    const response = await this.http
      .post(
        `${this.aiBaseUrl}/v1/chat/completions`,
        {
          model: 'mistralai/Mistral-7B-Instruct-v0.2',
          messages: [
            {
              role: 'system',
              content:
                'You are a senior developer that have great code review skills.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 256,
        },
        {
          headers: {
            Authorization: `Bearer ${this.aiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .toPromise();

    return response.data.choices[0].message.content;
  }

  async postCommentOnPR(prNumber: string, comment: string) {
    const repoOwner = this.configService.get('REPO_OWNER');
    const repoName = this.configService.get('REPO_NAME');
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${prNumber}/comments`;

    await this.http
      .post(url, { body: comment }, { headers: this.githubHeaders })
      .toPromise();
  }

  async reviewAndCommentOnPR(prNumber: string) {
    const diffUrl = await this.getPullRequestDiff(prNumber);

    if (!diffUrl) {
      return { message: 'No diff available for this PR' };
    }

    const diffResponse = await this.http
      .get(diffUrl, { headers: this.githubHeaders })
      .toPromise();
    const codeDiff = `\`\`\`diff\n${diffResponse.data.slice(0, 52)}\n\`\`\``;

    let reviewComment = await this.analyzeCodeWithAI(codeDiff);
    reviewComment = reviewComment.replace(codeDiff, '').trim();

    if (reviewComment) {
      reviewComment = `### 🔍 Code Review Suggestions:\n${reviewComment}`;
    } else {
      reviewComment = 'No significant issues found. 👍';
    }

    await this.postCommentOnPR(prNumber, reviewComment);
    return { message: `✅ Comment posted on PR #${prNumber}` };
  }
}
