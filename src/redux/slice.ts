import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
}

interface FavoriteState {
  movies: Movie[];
}

const initialState: FavoriteState = {
  movies: [],
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Movie>) => {
      const movieExists = state.movies.some((movie) => movie.id === action.payload.id);
      if (!movieExists) {
        state.movies.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.movies = state.movies.filter((movie) => movie.id !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;
