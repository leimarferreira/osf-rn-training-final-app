import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from 'react-query';
import { getMovieTheathers, Movie } from '../../service';
import { colors } from '../../style';
import ErrorContent from '../ErrorContent';
import Loading from '../Loading';
import MovieSessionList from '../MovieSessionList';

type Props = {
  movie: Movie;
  date: string;
};

const MovieTheaterList = ({ movie, date }: Props) => {
  const {
    isLoading,
    isError,
    data: movieTheaters,
  } = useQuery([movie, date], async () => {
    const response = await getMovieTheathers(movie, date);
    return response.data;
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorContent message="Não há sessões disponíveis no momento" />;
  }

  return (
    <FlatList
      initialNumToRender={5}
      maxToRenderPerBatch={3}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={10}
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
