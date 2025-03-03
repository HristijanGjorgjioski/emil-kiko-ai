import { useEffect, useState } from 'react';
import { Movie } from './movie.types';
import { MovieList } from './Movie';
import { getMovie, recommended } from '../../api/movies';

type RecommendationsProps = {
  id: string;
};

export const Recommendations = ({ id }: RecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  useEffect(() => {
    async function fetchData() {
      console.log('id', id);
      const fetchedMovie = await getMovie(id);
      const fetchedRecommendations = await recommended(id);
      setMovie(fetchedMovie);
      setRecommendations(fetchedRecommendations);
    }
    fetchData();
  }, [id]);
  return (
    <>
      MOVIE:
      {movie && <MovieList movies={[movie]} />}
      RECOMMENDATIONS:
      <MovieList movies={recommendations} />
    </>
  );
};
