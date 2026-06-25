import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  itemIds: string[];
}

const initialState: FavoritesState = {
  itemIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.itemIds.indexOf(id);
      if (index >= 0) {
        state.itemIds.splice(index, 1);
      } else {
        state.itemIds.push(id);
      }
    },
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.itemIds = action.payload;
    },
  },
});

export const { toggleFavorite, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
