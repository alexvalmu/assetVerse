import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from './authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState ={
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

//Register user
export const register= createAsyncThunk('auth/register',async(user,thunkAPI)=>{
        try{
            return await authService.register(user);
        }catch(error){
            const message=(error.response&&error.response.data&&error.response.data.message) 
            || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    
})

//login user
export const login= createAsyncThunk('auth/login',async(user,thunkAPI)=>{
    try{
        return await authService.login(user);
    }catch(error){
        const message=(error.response&&error.response.data&&error.response.data.message) 
        || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }

})

export const logout = createAsyncThunk('auth/logout',async()=>{
    await authService.logout();
});

export const getUserProfile = createAsyncThunk('auth/me', async (_, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;
      const token = user?.token;
  
      if (!token) {
        throw new Error("No token available");
      }
  
      return await authService.getUserProfile(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  });

export const updateUserProfile = createAsyncThunk('auth/update', async (userData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        
        if (!token) {
            throw new Error("No token available on updating");
        }
    
        return await authService.updateUserProfile(userData, token);
        }
    catch (error) {
        const message =
            (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getUserById = createAsyncThunk('auth/getUserById', async (userId, thunkAPI) => {
    try {
    
        return await authService.getUserById(userId);
    } catch (error) {
        const message =
            (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const addFavorite = createAsyncThunk(
    'auth/addFavorite',
    async (assetId, thunkAPI) => {
      const token = thunkAPI.getState().auth.user.token;
      return await authService.addFavorite(assetId, token);
    }
  );
  
  export const removeFavorite = createAsyncThunk(
    'auth/removeFavorite',
    async (assetId, thunkAPI) => {
      const token = thunkAPI.getState().auth.user.token;
      return await authService.removeFavorite(assetId, token);
    }
  );

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset:(state)=>{
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(register.pending,(state)=>{
                state.isLoading = true;
            })
            .addCase(register.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected,(state,action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null
            })
            .addCase(login.pending,(state)=>{
                state.isLoading = true;
            })
            .addCase(login.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected,(state,action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null
            })
            .addCase(logout.fulfilled,(state)=>{
                state.user = null;
            })
            .addCase(getUserProfile.pending,(state)=>{
                state.isLoading = true;
            })
            .addCase(getUserProfile.fulfilled,(state,action)=>{
                state.isLoading = false;
                state.isSuccess = true;
                state.user = {
                    ...action.payload,                   // datos nuevos del perfil
                    token: state.user?.token || null     // conservar token anterior
                  };
            })
            .addCase(getUserProfile.rejected,(state,action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateUserProfile.pending,(state)=>{
                state.isLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })            
            .addCase(updateUserProfile.rejected,(state,action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
               
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                if (!state.user.favorites) {
                  state.user.favorites = []; // Asegura que favorites existe
                }
                state.user.favorites.push(action.payload.assetId);
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                if (!state.user.favorites) {
                  state.user.favorites = [];
                }
                state.user.favorites = state.user.favorites.filter(
                  id => id !== action.payload.assetId
                );
              })
    }
});


export const {reset} = authSlice.actions;
export default authSlice.reducer;


