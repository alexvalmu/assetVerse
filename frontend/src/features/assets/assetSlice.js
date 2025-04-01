import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import assetService from './assetService';
import authService from '../auth/authService';
const initialState={
    assets:[],
    isError:false,
    isLoading:false,
    isSuccess:false,
    message:''
}

//Create new asset
export const createAsset= createAsyncThunk('assets/create', async(assetData,thunkAPI)=>{
    try{
        const token = thunkAPI.getState().auth.user.token;
        return await assetService.createAsset(assetData,token);
    }catch(error){
        const message=(error.response
                &&error.response.data
                &&error.response.data.message) 
                || error.message 
                || error.toString();
            return thunkAPI.rejectWithValue(message);
    }
})

//Get user assets
export const getAssets= createAsyncThunk('assets/getAll', async(_,thunkAPI)=>{
    try{
        const token = thunkAPI.getState().auth.user.token;
        return await assetService.getAssets(token);
    }catch(error){
        const message=(error.response
                &&error.response.data
                &&error.response.data.message) 
                || error.message 
                || error.toString();
            return thunkAPI.rejectWithValue(message);
    }
})
export const assetSlice = createSlice({
    name:'asset',
    initialState,
    reducers:{
        reset:(state)=>initialState,
    },
    extraReducers:(builder)=>{
        builder
            .addCase(createAsset.pending,(state)=>{
                state.isLoading = true;
            })
            .addCase(createAsset.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.assets.push(action.payload);
            })
            .addCase(createAsset.rejected,(state,action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAssets.pending,(state)=>{
                state.isLoading = true;
            })
            .addCase(getAssets.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.assets=action.payload;
            })
            .addCase(getAssets.rejected,(state,action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});


export const {reset} = assetSlice.actions;
export default assetSlice.reducer;