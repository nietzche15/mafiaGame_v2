import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { socket } from '../../utils/socket';

const list = () => {
  return new Promise((resolve, reject) => {
    socket.on('allRooms', (res) => {
      resolve(res.roomList);
    });
  });
};

export const asyncRoomList = createAsyncThunk(
  'asyncThunk/asyncRoomList',
  async () => {
    const data = await list();
    console.log('data: ', data);
    return data;
  }
);

export const asyncThunkSlice = createSlice({
  name: 'asyncThunk',
  initialState: {
    data: 0,
    loading: true,
  },

  extraReducers: (builder) => {
    builder.addCase(asyncRoomList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(asyncRoomList.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = false;
    });
    builder.addCase(asyncRoomList.rejected, (state, action) => {
      state.status = false;
    });
  },
});
