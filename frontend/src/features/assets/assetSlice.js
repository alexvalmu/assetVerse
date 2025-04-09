import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assetService from './assetService';

const initialState = {
    assets: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: '',
    asset: {}
};

// Create new asset
export const createAsset = createAsyncThunk('assets/create', async (assetData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await assetService.createAsset(assetData, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
                       error.message || 
                       error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get all assets
export const getAssets = createAsyncThunk('assets/getAll', async (_, thunkAPI) => {
    try {
        return await assetService.getAssets();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
                       error.message || 
                       error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get single asset
export const getAsset = createAsyncThunk('assets/get', async (assetId, thunkAPI) => {
    try {
        return await assetService.getAsset(assetId);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
                       error.message || 
                       error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete asset
export const deleteAsset = createAsyncThunk('assets/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await assetService.deleteAsset(id, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || 
                       error.message || 
                       error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const assetSlice = createSlice({
    name: 'asset',
    initialState,
    reducers: {
        reset: (state) => initialState,
    
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAsset.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createAsset.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.assets.push(action.payload);
            })
            .addCase(createAsset.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAssets.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAssets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.assets = action.payload;
            })
            .addCase(getAssets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAsset.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAsset.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.asset = action.payload;
            })
            .addCase(getAsset.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteAsset.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteAsset.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.assets = state.assets.filter(asset => asset._id !== action.payload.id);
            })
            .addCase(deleteAsset.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
            
    }
});

export const { reset } = assetSlice.actions;
export default assetSlice.reducer;