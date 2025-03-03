import { useEffect, useState } from 'react';
import { fullTextSearch, search } from '../../api/movies';
import { Movie } from './movie.types';
import { MovieList } from './Movie';
import styles from './Search.module.css';

type SearchProps = {
  isAiSearch?: boolean;
};

export const Search = ({ isAiSearch }: SearchProps) => {
  const [searchText, setSearchText] = useState('');
  const [movies, setMovies] = useState([] as Movie[]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMovies([]);
  }, [isAiSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const request = isAiSearch
      ? search(searchText)
      : fullTextSearch(searchText);
    const response = await request;
    console.log('response', response);
    setMovies(response);

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
      <MovieList movies={movies} />
    </form>
  );
};
