import { SearchResults } from './healthcare.types';
import styles from './HealthcareList.module.css';
import { useRouter } from 'next/navigation';

type HealthcareListProps = {
  healthcareEntities: SearchResults;
};

export const HealthcareList: React.FC<HealthcareListProps> = ({
  healthcareEntities,
}) => {
  const router = useRouter();
  return (
    <div className={styles.hospitalContainer}>
      {healthcareEntities.hospitals.map((hospital) => (
        <div
          key={`hospital-${hospital.id}`}
          className={styles.hospitalCard}
          onClick={() => router.push(`/healthcare/hospital/${hospital.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <h2 className={styles.hospitalTitle}>Hospital: {hospital.name}</h2>
          <p className={styles.hospitalProperty}>
            Location: {hospital.location}
          </p>
          <p className={styles.hospitalProperty}>
            Services: {hospital.services.join(', ')}
          </p>
          <p className={styles.hospitalProperty}>Type: {hospital.type}</p>
          <p className={styles.hospitalProperty}>
            Capacity: {hospital.capacity ?? 'N/A'}
          </p>

          <p className={styles.hospitalProperty}>
            Doctors:{' '}
            {hospital.doctors
              .map(
                (d) =>
                  `${d.name} (${d.experienceYears ?? 0} years, ${
                    d.specialization
                  })`
              )
              .join(', ')}
          </p>

          <p className={styles.hospitalProperty}>
            Caregivers:{' '}
            {hospital.caregivers
              .map(
                (c) => `${c.name} (${c.experienceYears ?? 0} years, ${c.role})`
              )
              .join(', ')}
          </p>
        </div>
      ))}
      {healthcareEntities.doctors.map((doctor) => (
        <div
          key={`doctor-${doctor.id}`}
          className={styles.hospitalCard}
          onClick={() => router.push(`/healthcare/doctor/${doctor.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <h2 className={styles.hospitalTitle}>Doctor: {doctor.name}</h2>
          <p className={styles.hospitalProperty}>
            Experience (in years): {doctor.experienceYears}
          </p>
          <p className={styles.hospitalProperty}>
            Specialization: {doctor.specialization}
          </p>
        </div>
      ))}
      {healthcareEntities.caregivers.map((doctor) => (
        <div
          key={`caregiver-${doctor.id}`}
          className={styles.hospitalCard}
          onClick={() => router.push(`/healthcare/caregiver/${doctor.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <h2 className={styles.hospitalTitle}>Caregiver: {doctor.name}</h2>
          <p className={styles.hospitalProperty}>
            Experience (in years): {doctor.experienceYears}
          </p>
          <p className={styles.hospitalProperty}>Role: {doctor.role}</p>
        </div>
      ))}
    </div>
  );
};
