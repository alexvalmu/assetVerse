import axios from 'axios';

const API_URL='/api/users/';

//register user
const register = async(userData)=>{
    const response = await axios.post(API_URL,userData);

    if(response.data){
        localStorage.setItem('user',JSON.stringify(response.data));
    }

    return response.data;
}

//login user
const login = async(userData)=>{
    const response = await axios.post(API_URL+'login',userData);

    if(response.data){
        localStorage.setItem('user',JSON.stringify(response.data));
    }

    return response.data;
}

//logout user
const logout = ()=>{
    localStorage.removeItem('user');
}

//get user profile
const getUserProfile = async (token) => {
    console.log(token);
    const config= {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + 'me',config);
    return response.data;
};

//update user profile
const updateUserProfile = async (userData, token) => {
     const config = {
         headers: {
             Authorization: `Bearer ${token}`
         }
     };
     const response = await axios.put(API_URL + 'me', userData, config);
     if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
     return response.data;
 };

const getUserById = async (userId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(`${API_URL}${userId}`, config);
    return response.data;
}; 

const addFavorite = async (assetId, token) => {
    const res = await axios.post(`${API_URL}favorites/${assetId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
};
  
const removeFavorite = async (assetId, token) => {
    const res = await axios.delete(`${API_URL}favorites/${assetId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
};

const authService = {
    register,
    logout,
    login,
    getUserProfile,
    updateUserProfile,
    getUserById,
    addFavorite,
    removeFavorite
}

export default authService;