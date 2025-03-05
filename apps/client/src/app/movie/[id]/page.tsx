'use client';
import { useParams } from 'next/navigation';
import { Recommendations } from '../../components/movies/Recommendations';
export default function MovieDetailPage() {
  const { id } = useParams();
  return <Recommendations id={id as string} />;
}
