import axios from 'axios';

const BASE_URL = 'https://osf-rn-training-bff.herokuapp.com';

interface Trailer {
  url: string;
}

export interface Movie {
  id: string;
  title: string;
  contentRating: string;
  synopsis: string;
  posterPortraitUrl: string | null;
  posterHorizontalUrl: string | null;
  trailers: Trailer[];
}

export const getMovies = (city: City | undefined | null) => {
  let url: string;
  if (city) {
    url = `${BASE_URL}/movies/city/${city.cityId}`;
  } else {
    url = `${BASE_URL}/movies`;
  }
  return axios.get<Movie[]>(url);
};

interface SessionType {
  id: number;
  alias: string;
}

export interface MovieSession {
  id: string;
  types: SessionType[];
  time: string;
}

interface MovieTheatherRoom {
  name: string;
  sessions: MovieSession[];
}

interface RawMovieTheater {
  id: string;
  name: string;
  rooms: MovieTheatherRoom[];
}

export interface MovieTheater {
  id: string;
  name: string;
  data: MovieSession[];
}

/* Converts a RawMovieTheater array to a MovieTheater array,
extracting the sessions array from each room of each
RawMovieTheater and removing the rooms array. */
const toMovieTheaterArray = (data: string): MovieTheater[] | string => {
  try {
    let rawMovieTheathers: RawMovieTheater[] = JSON.parse(data);
    return rawMovieTheathers.map(item => {
      let sessions = item.rooms
        // Returns a 2-dimensional array of MovieSession
        .map(room => {
          return room.sessions;
        })
        // Flatten the 2-dimensional array, transforming it into a simple array
        .flat()
        // Sort the sessions array by time
        .sort((a, b) => {
          if (a.time < b.time) {
            return -1;
          } else if (a.time > b.time) {
            return 1;
          }

          return 0;
        });

      return {
        id: item.id,
        name: item.name,
        data: sessions,
      };
    });
  } catch {
    return data;
  }
};

export const getMovieTheathers = (
  movie: Movie,
  city: City | undefined | null,
  date: string,
) => {
  let params = {};

  if (city) {
    params = {
      cityId: city.cityId,
    };
  }

  return axios.get<MovieTheater[]>(
    `${BASE_URL}/movies/${movie.id}/sessions/date/${date}`,
    {
      transformResponse: toMovieTheaterArray,
      params: params,
    },
  );
};

export interface City {
  cityId: string;
  cityName: string;
}

export const getCities = () => {
  return axios.get<City[]>(`${BASE_URL}/cities`);
};
