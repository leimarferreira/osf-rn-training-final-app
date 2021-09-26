import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  NativeSegmentedControlIOSChangeEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PosterLandscape from '../../components/PosterLandscape';
import PosterPortrait from '../../components/PosterPortrait';
import MovieTheaterList from '../../components/MovieTheaterList';
import TrailerButton from '../../components/TrailerButton';
import { RootStackParamList } from '../../router/Router';
import { colors } from '../../style';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bodyBackgroundColor,
  },
  posterPortraitContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center',
  },
  detailsContainer: {
    flex: 1,
    margin: 5,
  },
  boldText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  regularText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '400',
  },
  synopsis: {
    marginBottom: 8,
  },
  segmentedControl: {
    marginTop: 15,
  },
});

const MovieDetail = ({ route }: Props) => {
  const { movie, city } = route.params;

  const week = useMemo(
    () => [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ],
    [],
  );

  // Index of the selected value in the SegmentedControl
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [days, setDays] = useState<string[]>(week);
  const [date, setDate] = useState(
    new Date().toISOString().replace(/T.*/g, ''),
  );

  // Set the values for the SegmentedControl
  useEffect(() => {
    let today = new Date().getDay();

    if (today + 4 > week.length) {
      setDays(week.slice(today).concat(week.slice(0, today + 4 - week.length)));
    } else {
      setDays(week.slice(today, today + 4));
    }
  }, [week]);

  useEffect(() => {
    // Set the date when another tab is selected in the SegmentedControl
    let selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + selectedIndex);
    setDate(selectedDate.toISOString().replace(/T.*/g, ''));
  }, [selectedIndex]);

  const handleSegmentedControlChange = (
    event: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>,
  ) => {
    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
  };

  const renderTrailerButton = () => {
    if (movie.trailers.length) {
      return <TrailerButton trailerURL={movie.trailers[0].url} />;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <PosterLandscape imageURL={movie.posterHorizontalUrl}>
        <View style={styles.posterPortraitContainer}>
          <PosterPortrait
            imageURL={movie.posterPortraitUrl}
            width={170}
            height={170}
          />
        </View>
      </PosterLandscape>
      <View style={styles.detailsContainer}>
        <Text style={styles.movieTitle}>{movie.title}</Text>
        <Text style={styles.boldText}>
          Classificação:{' '}
          <Text style={styles.regularText}>{movie.contentRating}</Text>
        </Text>
        <Text style={[styles.boldText, styles.synopsis]} numberOfLines={3}>
          Synopsis: <Text style={styles.regularText}>{movie.synopsis}</Text>
        </Text>

        {renderTrailerButton()}

        <SegmentedControl
          style={styles.segmentedControl}
          values={days}
          selectedIndex={selectedIndex}
          onChange={handleSegmentedControlChange}
        />

        <MovieTheaterList movie={movie} city={city} date={date} />
      </View>
    </View>
  );
};

export default MovieDetail;
