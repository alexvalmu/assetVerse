import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService'; // un servicio para las peticiones (como tienes en auth)

const initialState = {
  viewedUser: null,
  isLoading: false,
  isError: false,
  message: '',
};

// Get User by ID
export const getUserById = createAsyncThunk(
  'users/getUserById',
  async (userId, thunkAPI) => {
    try {
      return await userService.getUserById(userId);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message)
        || error.message
        || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUser: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.viewedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
