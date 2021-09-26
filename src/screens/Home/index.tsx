import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useQuery } from 'react-query';
import ErrorContent from '../../components/ErrorContent';
import Loading from '../../components/Loading';
import MovieList from '../../components/MovieList';
import SearchBar from '../../components/SearchBar';
import { RootStackParamList } from '../../router/Router';
import { City, getMovies, Movie } from '../../service';
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
  const [city, setCity] = useState<City | null>(null);

  const {
    isLoading,
    isError,
    data: movies,
  } = useQuery([city], async () => {
    const response = await getMovies(city);
    return response.data;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CitySelector', {
                handleSelectedCityChange: setCity,
                currentSelectedCity: city,
              })
            }
          >
            <Icon name="place" size={20} color={colors.white} />
          </TouchableOpacity>
        );
      },
    });
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
        handleItemPress={(movie: Movie) =>
          navigation.push('MovieDetail', { movie, city })
        }
      />
    </View>
  );
};

export default Home;
