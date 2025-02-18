const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/review';

export async function getPullRequests() {
  const response = await fetch(`${API_BASE_URL}/pull-requests`);
  if (!response.ok) throw new Error('Failed to fetch pull requests');
  return response.json();
}

export async function getPullRequestDiff(id: string) {
  const response = await fetch(`${API_BASE_URL}/pull-request/${id}/diff`);
  if (!response.ok) throw new Error(`Failed to fetch diff for PR #${id}`);
  return response.json();
}

export async function reviewPullRequest(
  repoOwner: string,
  repoName: string,
  prNumber: string,
  gitHubToken: string
) {
  return fetch(`${API_BASE_URL}/pull-request/${prNumber}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoOwner, repoName, prNumber, gitHubToken }),
  });
}
