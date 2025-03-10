'use client';
import { useParams } from 'next/navigation';
import { HealthcareRecommendations } from '../../../components/healthcare/Recommendations';
import { Source } from '../../../components/healthcare/healthcare.types';
export default function MovieDetailPage() {
  const { source, id } = useParams();
  const stringifiedSource = source as string;
  const capitalizedSource = (
    stringifiedSource
      ? stringifiedSource.charAt(0).toUpperCase() + stringifiedSource.slice(1)
      : ''
  ) as Source;
  return (
    <HealthcareRecommendations id={id as string} source={capitalizedSource} />
  );
}
