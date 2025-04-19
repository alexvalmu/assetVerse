import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from './commentService';

export const initialState = {
    comments: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
};

export const getComments = createAsyncThunk('comments/getAll', async (_, thunkAPI) => {
    try {
        return await commentService.getComments();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
                        error.message || 
                        error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getAssetComments = createAsyncThunk('comments/getAssetComments', async (assetId, thunkAPI) => {
    try {
        return await commentService.getAssetComments(assetId);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
                        error.message || 
                        error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getComments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.comments = action.payload;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAssetComments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAssetComments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.comments = action.payload;
            })
            .addCase(getAssetComments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});


export const { reset } =commentSlice.actions;
export default commentSlice.reducer;