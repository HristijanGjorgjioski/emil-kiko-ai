import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewService {
  private readonly githubHeaders;
  private readonly aiApiKey: string;

  constructor(private http: HttpService, private configService: ConfigService) {
    this.githubHeaders = {
      Authorization: `Bearer ${this.configService.get('GITHUB_TOKEN')}`,
      Accept: 'application/vnd.github.v3+json',
    };
    this.aiApiKey = this.configService.get('OPEN_AI_KEY');
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

  async getPullRequestDiff(
    prNumber: string,
    repoOwner?: string,
    repoName?: string,
    githubToken?: string
  ) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${prNumber}`;

    const headersToSent = {
      ...this.githubHeaders,
      Authorization: `Bearer ${githubToken}`,
    };

    const response = await this.http
      .get(url, { headers: headersToSent })
      .toPromise();
    return response.data.diff_url;
  }

  async analyzeCodeWithAI(codeDiff: string) {
    const prompt = `You are a senior software engineer reviewing a pull request code diff.  
    Your task is to analyze the following code diff and provide a structured review, identifying:  
    - 🛑 **Critical issues** (security risks, major bugs)  
    - ⚠️ **Potential improvements** (performance optimizations, code structure, readability)  
    - ✅ **Good practices** (things done well)  
    
    Please provide a **detailed** review with explanations and suggested fixes.  
    At the end, **rate the overall code quality** from 1 to 10 based on best practices.  
    
    Here is the code diff to review:  
    
    \`\`\`diff  
    ${codeDiff}  
    \`\`\`
    `;

    try {
      const response = await this.http
        .post(
          `https://api.openai.com/v1/chat/completions`,
          {
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content:
                  'You are a senior developer with excellent code review skills. Provide a detailed analysis of the code changes.',
              },
              { role: 'user', content: prompt },
            ],
            temperature: 0.5,
            max_tokens: 512,
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
    } catch (error) {
      console.log('OpenAI API Error:', error.response?.data || error.message);
    }
  }

  async postCommentOnPR(
    prNumber: string,
    comment: string,
    repoName: string,
    repoOwner: string,
    gitHubToken: string
  ) {
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/issues/${prNumber}/comments`;
    console.log(url, 'url');
    const headersToSent = {
      ...this.githubHeaders,
      Authorization: `Bearer ${gitHubToken}`,
    };
    await this.http
      .post(url, { body: comment }, { headers: headersToSent })
      .toPromise();
  }

  async reviewAndCommentOnPR(
    repoOwner: string,
    repoName: string,
    prNumber: string,
    gitHubToken: string
  ) {
    const repoOwnerToUse =
      repoOwner !== '' ? repoOwner : this.configService.get('REPO_OWNER');
    const repoNameToUse =
      repoName !== '' ? repoName : this.configService.get('REPO_NAME');
    const gitHubTokenToUse =
      gitHubToken !== '' ? gitHubToken : this.configService.get('GITHUB_TOKEN');
    const diffUrl = await this.getPullRequestDiff(
      prNumber,
      repoOwnerToUse,
      repoNameToUse,
      gitHubTokenToUse
    );

    if (!diffUrl) {
      return { message: 'No diff available for this PR' };
    }

    const headersToSent = {
      ...this.githubHeaders,
      Authorization: `Bearer ${gitHubTokenToUse}`,
    };

    const diffResponse = await this.http
      .get(diffUrl, { headers: headersToSent })
      .toPromise();
    const codeDiff = `\`\`\`diff\n${diffResponse.data}\n\`\`\``;

    let reviewComment = await this.analyzeCodeWithAI(codeDiff);
    reviewComment = reviewComment.replace(codeDiff, '').trim();

    if (reviewComment) {
      reviewComment = `### 🔍 Code Review Suggestions:\n${reviewComment}`;
    } else {
      reviewComment = 'No significant issues found. 👍';
    }

    await this.postCommentOnPR(
      prNumber,
      reviewComment,
      repoNameToUse,
      repoOwnerToUse,
      gitHubTokenToUse
    );
    return { message: `✅ Comment posted on PR #${prNumber}` };
  }
}
