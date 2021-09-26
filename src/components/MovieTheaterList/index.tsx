import React from 'react';
import { FlatList, SectionList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from 'react-query';
import { City, getMovieTheathers, Movie } from '../../service';
import { colors } from '../../style';
import ErrorContent from '../ErrorContent';
import Loading from '../Loading';

type Props = {
  movie: Movie;
  date: string;
  city: City | null;
};

const MovieTheaterList = ({ movie, date, city }: Props) => {
  const {
    isLoading,
    isError,
    data: movieTheaters,
  } = useQuery([movie, date, city], async () => {
    const response = await getMovieTheathers(movie, city, date);
    return response.data;
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorContent message="Não há sessões disponíveis no momento" />;
  }

  return (
    <SectionList
      removeClippedSubviews
      updateCellsBatchingPeriod={5}
      maxToRenderPerBatch={5}
      sections={movieTheaters!}
      keyExtractor={item => item.id}
      renderSectionHeader={info => {
        return <Text style={styles.movieTheaterName}>{info.section.name}</Text>;
      }}
      renderItem={({ item }) => {
        return (
          <View style={styles.sessionDetails}>
            <Text style={styles.sessionTime}>{item.time}</Text>
            <FlatList
              horizontal
              removeClippedSubviews
              maxToRenderPerBatch={10}
              updateCellsBatchingPeriod={5}
              data={item.types}
              keyExtractor={type => `${type.id}`}
              renderItem={({ item: type }) => {
                return <Text style={styles.smallBadge}>{type.alias}</Text>;
              }}
            />
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
  sessionDetails: {
    flexDirection: 'row',
  },
  sessionTime: {
    color: colors.white,
    marginHorizontal: 8,
  },
  smallBadge: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 5,
    marginRight: 2,
    marginVertical: 1,
    color: colors.bodyBackgroundColor,
  },
});

export default MovieTheaterList;
