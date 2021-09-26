import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Movie } from '../../service';
import ErrorContent from '../ErrorContent';
import MovieListItem from '../MovieListItem';

type FilterOptions = {
  searchParams: string;
};

type Props = {
  movies: Movie[];
  handleItemPress: (item: Movie) => void;
  filterOptions: FilterOptions;
};

const MovieList = ({ movies, handleItemPress, filterOptions }: Props) => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);

  useEffect(() => {
    let pattern = new RegExp(filterOptions.searchParams, 'i');
    setFilteredMovies(
      movies.filter(movie => {
        return pattern.test(movie.title);
      }),
    );
  }, [movies, filterOptions]);

  if (filteredMovies.length === 0) {
    return (
      <ErrorContent
        message={`Não encontramos nenhum filme com o nome: ${filterOptions.searchParams}`}
      />
    );
  }

  return (
    <FlatList
      numColumns={2}
      initialNumToRender={6}
      removeClippedSubviews
      data={filteredMovies}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <MovieListItem movie={item} onPress={() => handleItemPress(item)} />
      )}
    />
  );
};

export default MovieList;
