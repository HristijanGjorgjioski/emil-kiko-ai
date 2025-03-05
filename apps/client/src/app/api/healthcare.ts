import {
  Hospital,
  SearchResults,
} from '../components/healthcare/healthcare.types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/healthcare';

export async function searchHealthcare(text: string) {
  const result = await fetch(`${API_BASE_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const response = (await result.json()) as SearchResults;
  return response;
}

export async function recommended(id: string) {
  const result = await fetch(`${API_BASE_URL}/recommended/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const response = (await result.json()) as Hospital[];
  return response;
}

export async function getHospital(id: string) {
  const result = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const response = (await result.json()) as Hospital;
  return response;
}
