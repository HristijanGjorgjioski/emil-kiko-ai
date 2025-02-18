import { useState } from 'react';
import { reviewPullRequest } from '../api/code-review';

export default function ReviewForm() {
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [prNumber, setPrNumber] = useState('');
  const [gitHubToken, setGitHubToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await reviewPullRequest(
        repoOwner,
        repoName,
        prNumber,
        gitHubToken
      );
      setMessage(
        `Review started successfully! Response: ${JSON.stringify(response)}`
      );
    } catch (error) {
      setMessage(
        `Error: ${
          error instanceof Error ? error.message : 'Something went wrong'
        }`
      );
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded-lg"
    >
      <input
        type="text"
        placeholder="Repo Owner"
        value={repoOwner}
        onChange={(e) => setRepoOwner(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Repo Name"
        value={repoName}
        onChange={(e) => setRepoName(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="number"
        placeholder="PR Number"
        value={prNumber}
        onChange={(e) => setPrNumber(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="GitHub Token"
        value={gitHubToken}
        onChange={(e) => setGitHubToken(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </form>
  );
}
