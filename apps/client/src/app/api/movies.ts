import { Movie } from '../components/movies/movie.types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/movies';

export async function search(text: string) {
  const result = await fetch(`${API_BASE_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const response = (await result.json()) as Movie[];
  return response;
}

export async function fullTextSearch(text: string) {
  const result = await fetch(`${API_BASE_URL}/full-text-search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const response = (await result.json()) as Movie[];
  return response;
}

export async function recommended(id: string) {
  const result = await fetch(`${API_BASE_URL}/recommended/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const response = (await result.json()) as Movie[];
  return response;
}

export async function getMovie(id: string) {
  const result = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const response = (await result.json()) as Movie;
  return response;
}
