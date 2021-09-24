import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchParams, setSearchParams] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getMovies()
      .then(response => setMovies(response.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorContent message="Não há filmes disponíveis no momento" />;
  }

  return (
    <View style={styles.container}>
      <SearchBar handleSearchParamsChange={setSearchParams} />
      <MovieList
        filterOptions={{ searchParams }}
        movies={movies}
        handleItemPress={(item: Movie) =>
          navigation.push('MovieDetail', { movie: item })
        }
      />
    </View>
  );
};

export default Home;
