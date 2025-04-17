import { configureStore } from '@reduxjs/toolkit';
import  authReducer  from '../features/auth/authSlice';
import assetReducer from '../features/assets/assetSlice';
import categoryReducer from '../features/categories/categorySlice';
import userReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assets:assetReducer,
    categories:categoryReducer,
    users: userReducer
  },
});
