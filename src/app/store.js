import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../features/bughouse/gameSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});
