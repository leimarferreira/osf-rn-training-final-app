import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React from 'react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import CitySelector from '../screens/CitySelector';
import Home from '../screens/Home';
import MovieDetail from '../screens/MovieDetail';
import { City, Movie } from '../service';
import { colors } from '../style';

const HomeStack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  MovieDetail: { movie: Movie; city: City | null };
  CitySelector: {
    handleSelectedCityChange: (city: City) => void;
    currentSelectedCity: City | null;
  };
};

const homeOptions: NativeStackNavigationOptions = {
  title: 'CineFortaleza',
  headerTintColor: colors.white,
  headerStyle: { backgroundColor: colors.headerBackgroundColor },
};

const movieDetailOptions: NativeStackNavigationOptions = {
  headerShown: true,
  headerTransparent: true,
  headerShadowVisible: false,
  headerTitle: '',
  headerTintColor: colors.white,
};

const citySelectorOptions: NativeStackNavigationOptions = {
  headerTitle: 'Selecione uma cidade',
  headerStyle: { backgroundColor: colors.headerBackgroundColor },
  headerTintColor: colors.white,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 30 * 1000,
      staleTime: 30 * 1000,
      retry: false,
      refetchOnMount: false,
    },
  },
});

setLogger({ log: console.log, warn: console.warn, error: () => {} });

export default () => (
  <QueryClientProvider client={queryClient}>
    <NavigationContainer>
      <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={Home} options={homeOptions} />
        <HomeStack.Screen
          name="MovieDetail"
          component={MovieDetail}
          options={movieDetailOptions}
        />
        <HomeStack.Screen
          name="CitySelector"
          component={CitySelector}
          options={citySelectorOptions}
        />
      </HomeStack.Navigator>
    </NavigationContainer>
  </QueryClientProvider>
);
