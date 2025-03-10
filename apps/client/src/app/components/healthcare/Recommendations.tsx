import { useEffect, useState } from 'react';
import {
  Caregiver,
  Doctor,
  HealthcareEntity,
  Hospital,
  SearchResults,
  Source,
} from './healthcare.types';
import { HealthcareList } from './HealthcareList';
import { getHealthcareEntity, recommended } from '../../api/healthcare';

type HealthcareRecommendationsProps = {
  id: string;
  source: Source;
};

export const HealthcareRecommendations = ({
  id,
  source,
}: HealthcareRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<SearchResults>();
  const [entity, setEntity] = useState<HealthcareEntity | null>(null);
  useEffect(() => {
    async function fetchData() {
      const fetchedMainEntity = await getHealthcareEntity(id, source);
      const fetchedRecommendations = await recommended(id, source);
      setEntity(fetchedMainEntity);
      setRecommendations(fetchedRecommendations);
    }
    fetchData();
  }, [id, source]);
  const mainEntityList = {
    hospitals: source === 'Hospital' && entity ? [entity as Hospital] : [],
    doctors: source === 'Doctor' && entity ? [entity as Doctor] : [],
    caregivers: source === 'Caregiver' && entity ? [entity as Caregiver] : [],
  };
  return (
    <>
      Healthcare entity:
      {entity && <HealthcareList healthcareEntities={mainEntityList} />}
      RECOMMENDATIONS:
      {recommendations && (
        <HealthcareList healthcareEntities={recommendations} />
      )}
    </>
  );
};
