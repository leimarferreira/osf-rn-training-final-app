import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  LogBox,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useQuery } from 'react-query';
import ErrorContent from '../../components/ErrorContent';
import Loading from '../../components/Loading';
import { RootStackParamList } from '../../router/Router';
import { City, getCities } from '../../service';
import { colors } from '../../style';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type Props = NativeStackScreenProps<RootStackParamList, 'CitySelector'>;

const CitySelector = ({ navigation, route }: Props) => {
  const { currentSelectedCity, handleSelectedCityChange } = route.params;
  const {
    isLoading,
    isError,
    data: cities,
  } = useQuery('cities', async () => {
    const response = await getCities();
    return response.data;
  });

  const handleCityNameTouchablePress = (city: City) => {
    handleSelectedCityChange(city);
    navigation.pop();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorContent message="Nenhuma cidade disponível." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        removeClippedSubviews
        maxToRenderPerBatch={30}
        updateCellsBatchingPeriod={15}
        initialNumToRender={15}
        getItemLayout={(data, index) => ({
          length: 50,
          offset: 50 * index,
          index,
        })}
        data={cities}
        keyExtractor={city => city.cityId}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.cityNameTouchable}
              onPress={() => handleCityNameTouchablePress(item)}
            >
              <Text style={styles.cityNameText}>{item.cityName}</Text>
              {currentSelectedCity?.cityId === item.cityId && (
                <Icon name="check" size={20} color={colors.white} />
              )}
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cityNameTouchable: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  cityNameText: {
    color: colors.white,
    fontSize: 20,
  },
  container: {
    backgroundColor: colors.bodyBackgroundColor,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: colors.secondaryColor,
  },
});

export default CitySelector;
