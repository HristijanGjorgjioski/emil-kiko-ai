'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { SearchHealthcare } from '../components/healthcare/Search';

export default function HealthcareSearchPage() {
  const router = useRouter();
  return (
    <div className={styles.searchContainer}>
      <button className={styles.homeButton} onClick={() => router.push(`/`)}>
        HOME
      </button>
      <h1 className={styles.title}> Search Healthcare </h1>
      <SearchHealthcare />
    </div>
  );
}
