import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { getMovieTheathers, Movie, MovieTheater } from '../../service';
import { colors } from '../../style';
import ErrorContent from '../ErrorContent';
import Loading from '../Loading';
import MovieSessionList from '../MovieSessionList';

type Props = {
  movie: Movie;
  date: string;
};

const MovieTheaterList = ({ movie, date }: Props) => {
  const [movieTheaters, setMovieTheaters] = useState<MovieTheater[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getMovieTheathers(movie, date)
      .then(response => setMovieTheaters(response.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [movie, date]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorContent message="Não há sessões disponíveis no momento" />;
  }

  return (
    <FlatList
      data={movieTheaters}
      keyExtractor={movieTheather => movieTheather.id}
      renderItem={({ item: movieTheather }) => {
        return (
          <View>
            <Text style={styles.movieTheaterName}>{movieTheather.name}</Text>
            <MovieSessionList sessions={movieTheather.sessions} />
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  movieTheaterName: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MovieTheaterList;
