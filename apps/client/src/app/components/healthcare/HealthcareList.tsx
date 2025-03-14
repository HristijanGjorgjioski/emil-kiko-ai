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
            Services: {hospital.services.join(', ')}
          </p>
          <p className={styles.hospitalProperty}>Type: {hospital.type}</p>
          <p className={styles.hospitalProperty}>
            Capacity: {hospital.capacity ?? 'N/A'}
          </p>
          <p className={styles.hospitalProperty}>
            Address: {hospital.address ?? 'N/A'}
          </p>
          <p className={styles.hospitalProperty}>
            Phone:{' '}
            <a
              href={`tel:${hospital.phone}`}
              style={{ textDecoration: 'underline' }}
              onClick={(e) => e.stopPropagation()}
            >
              {hospital.phone ?? 'N/A'}
            </a>
          </p>
          <p className={styles.hospitalProperty}>
            Email:{' '}
            <a
              href={`mailto:${hospital.email}`}
              style={{ textDecoration: 'underline' }}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {hospital.email ?? 'N/A'}
            </a>
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
          <p className={styles.hospitalProperty}>
            Address: {doctor.address ?? 'N/A'}
          </p>
          <p className={styles.hospitalProperty}>
            Phone:{' '}
            <a
              href={`tel:${doctor.phone}`}
              style={{ textDecoration: 'underline' }}
              onClick={(e) => e.stopPropagation()}
            >
              {doctor.phone ?? 'N/A'}
            </a>
          </p>
          <p className={styles.hospitalProperty}>
            Email:{' '}
            <a
              href={`mailto:${doctor.email}`}
              style={{ textDecoration: 'underline' }}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {doctor.email ?? 'N/A'}
            </a>
          </p>
        </div>
      ))}
      {healthcareEntities.caregivers.map((caregiver) => (
        <div
          key={`caregiver-${caregiver.id}`}
          className={styles.hospitalCard}
          onClick={() => router.push(`/healthcare/caregiver/${caregiver.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <h2 className={styles.hospitalTitle}>Caregiver: {caregiver.name}</h2>
          <p className={styles.hospitalProperty}>
            Experience (in years): {caregiver.experienceYears}
          </p>
          <p className={styles.hospitalProperty}>Role: {caregiver.role}</p>
          <p className={styles.hospitalProperty}>
            Address: {caregiver.address ?? 'N/A'}
          </p>
          <p className={styles.hospitalProperty}>
            Phone:{' '}
            <a
              href={`tel:${caregiver.phone}`}
              style={{ textDecoration: 'underline' }}
              onClick={(e) => e.stopPropagation()}
            >
              {caregiver.phone ?? 'N/A'}
            </a>
          </p>
          <p className={styles.hospitalProperty}>
            Email:{' '}
            <a
              href={`mailto:${caregiver.email}`}
              style={{ textDecoration: 'underline' }}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {caregiver.email ?? 'N/A'}
            </a>
          </p>
        </div>
      ))}
    </div>
  );
};
