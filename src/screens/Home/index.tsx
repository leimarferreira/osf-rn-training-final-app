import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useQuery } from 'react-query';
import ErrorContent from '../../components/ErrorContent';
import Loading from '../../components/Loading';
import MovieList from '../../components/MovieList';
import SearchBar from '../../components/SearchBar';
import { RootStackParamList } from '../../router/Router';
import { getMovies, Movie } from '../../service';
import { colors } from '../../style';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bodyBackgroundColor,
    height: '100%',
  },
});

const Home = ({ navigation }: Props) => {
  const [searchParams, setSearchParams] = useState('');

  const {
    isLoading,
    isError,
    data: movies,
  } = useQuery('movies', async () => {
    const response = await getMovies();
    return response.data;
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorContent message="Não há filmes disponíveis no momento" />;
  }

  return (
    <View style={styles.container}>
      <SearchBar handleSearchParamsChange={setSearchParams} />
      <MovieList
        filterOptions={{ searchParams }}
        movies={movies!}
        handleItemPress={(item: Movie) =>
          navigation.push('MovieDetail', { movie: item })
        }
      />
    </View>
  );
};

export default Home;
