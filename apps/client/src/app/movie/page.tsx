'use client';
import { useRouter } from 'next/navigation';
import { Search } from '../components/movies/Search';
import styles from './page.module.css';
import { useState } from 'react';

export default function SearchPage() {
  const router = useRouter();
  const [isAiSearch, setIsAiSearch] = useState(false);
  const handleSwitchChange = () => {
    setIsAiSearch(!isAiSearch);
  };
  return (
    <div className={styles.searchContainer}>
      <button className={styles.homeButton} onClick={() => router.push(`/`)}>
        HOME
      </button>
      <h1 className={styles.title}>
        {isAiSearch ? 'AI Search' : 'Full-text Search'}
      </h1>
      <div className={styles.switchContainer}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={isAiSearch}
            onChange={handleSwitchChange}
          />
          <span className={styles.slider}></span>
        </label>
        <span className={styles.switchText}>
          Switch between AI search and Full-text search
        </span>
      </div>
      <Search isAiSearch={isAiSearch} />
    </div>
  );
}
