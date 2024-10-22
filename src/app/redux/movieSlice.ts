

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  genres?: { name: string }[];
}

interface MovieState {
  movies: Movie[];
  nowPlaying: Movie[];
  popularMovies: Movie[];
  upcomingMovies: Movie[];
  topRatedMovies: Movie[];
  searchTerm: string;
  hasSearched: boolean;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  nowPlaying: [],
  popularMovies: [],
  upcomingMovies: [],
  topRatedMovies: [],
  searchTerm: '',
  hasSearched: false,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (_, { getState }) => {
    const state = getState() as { movie: MovieState };
    const page = state.movie.page;
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
    );
    const data = await res.json();
    return data;
  }
);

export const fetchNowPlaying = createAsyncThunk(
  'movies/fetchNowPlaying',
  async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await res.json();
    return data;
  }
);

export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopularMovies',
  async (_, { getState }) => {
    const state = getState() as { movie: MovieState };
    const page = state.movie.page;
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
    );
    const data = await res.json();
    return data;
  }
);

export const fetchUpcomingMovies = createAsyncThunk(
  'movies/fetchUpcomingMovies',
  async (_, { getState }) => {
    const state = getState() as { movie: MovieState };
    const page = state.movie.page;
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
    );
    const data = await res.json();
    return data;
  }
);

export const fetchTopRatedMovies = createAsyncThunk(
  'movies/fetchTopRatedMovies',
  async (_, { getState }) => {
    const state = getState() as { movie: MovieState };
    const page = state.movie.page;
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
    );
    const data = await res.json();
    return data;
  }
);

export const fetchSearchMovies = createAsyncThunk(
  'movies/fetchSearchMovies',
  async (searchTerm: string) => {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(
        searchTerm
      )}&language=en-US&page=1`
    );
    const data = await res.json();
    return data;
  }
);

export const movieSlice = createSlice({
  name: 'movie',
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    setHasSearched(state, action: PayloadAction<boolean>) {
      state.hasSearched = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results;
        state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      .addCase(fetchNowPlaying.fulfilled, (state, action) => {
        state.nowPlaying = action.payload.results;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.popularMovies = action.payload.results;
      })
      .addCase(fetchUpcomingMovies.fulfilled, (state, action) => {
        state.upcomingMovies = action.payload.results;
      })
      .addCase(fetchTopRatedMovies.fulfilled, (state, action) => {
        state.topRatedMovies = action.payload.results;
      })
      .addCase(fetchSearchMovies.fulfilled, (state, action) => {
        state.movies = action.payload.results;
        state.totalPages = action.payload.total_pages;
      });
  },
});

export const { setSearchTerm, setHasSearched } = movieSlice.actions;

export default movieSlice.reducer;
