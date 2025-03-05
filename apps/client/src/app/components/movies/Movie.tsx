import styles from './Movie.module.css';
import { useRouter } from 'next/navigation';
import { Movie } from './movie.types';

type MovieListProps = {
  movies: Movie[];
};

export const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  const router = useRouter();
  console.log('movies in movie list', movies);
  return (
    <div className={styles.movieContainer}>
      {movies.map((movie) => (
        <div
          key={movie.id}
          className={styles.movieCard}
          onClick={() => router.push(`/movie/${movie.id}`)}
          style={{ cursor: 'pointer' }}
        >
          <h2 className={styles.movieTitle}>{movie.name}</h2>
          <p className={styles.movieGenre}>Genre: {movie.genre.join(', ')}</p>
          <p className={styles.movieDirector}>Director: {movie.director}</p>
          <p className={styles.movieCast}>Cast: {movie.cast.join(', ')}</p>
          <p className={styles.movieSetting}>Setting: {movie.setting}</p>
          <p className={styles.moviePlot}>{movie.plot}</p>
        </div>
      ))}
    </div>
  );
};
