import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tagService from './tagService';

const initialState = {
    tags: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: ''
};

export const getTags = createAsyncThunk('tags/getAll', async (_, thunkAPI) => {
    try {
        return await tagService.getTags();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
                       error.message || 
                       error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const tagSlice = createSlice({
    name: 'tag',
    initialState,
    reducers: {
        reset: (state) => initialState,
    
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTags.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTags.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.tags.push(action.payload);
            })
            .addCase(getTags.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

    }
});

export const { reset } = tagSlice.actions;
export default tagSlice.reducer;