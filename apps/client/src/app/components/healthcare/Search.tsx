import { useState } from 'react';
import { SearchResults } from './healthcare.types';
import { HealthcareList } from './HealthcareList';
import styles from './Search.module.css';
import { searchHealthcare } from '../../api/healthcare';

export const SearchHealthcare = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const request = searchHealthcare(searchText);
    const response = await request;
    console.log('response', response);
    setSearchResults(response);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchForm}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Search here..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
        />
        <button
          type="submit"
          className={styles.searchButton}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
      {message && <p className={styles.message}>{message}</p>}
      {searchResults ? (
        <HealthcareList healthcareEntities={searchResults} />
      ) : (
        'No search results yet'
      )}
    </form>
  );
};
