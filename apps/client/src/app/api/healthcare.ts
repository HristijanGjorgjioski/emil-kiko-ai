import {
  HealthcareEntity,
  SearchResults,
  Source,
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

export async function recommended(id: string, source: Source) {
  const result = await fetch(`${API_BASE_URL}/recommended/${source}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const response = (await result.json()) as SearchResults;
  return response;
}

export async function getHealthcareEntity(id: string, source: Source) {
  const result = await fetch(`${API_BASE_URL}/get/${source}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const response = (await result.json()) as HealthcareEntity;
  return response;
}
