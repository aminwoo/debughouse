import { createSlice } from '@reduxjs/toolkit';
import BughouseBoard from '../../models/BoardState';

export const gameSlice = createSlice({
  name: 'game',
  initialState: {
    playing: true,
    board: new BughouseBoard(),
  },
  reducers: {
    togglePlaying: (state) => {
      state.playing = !state.playing;
    },
    doMove: (state, action) => {
      state.board.doMove(action);
    },
  },
})

export const { togglePlaying, doMove } = gameSlice.actions;

export const selectBoard = (state) => state.game.board;

export default gameSlice.reducer;
