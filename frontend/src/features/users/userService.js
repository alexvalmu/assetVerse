import axios from 'axios';

const API_URL = '/api/users/'; // ajusta a tu backend

// Obtener usuario por ID
const getUserById = async (userId) => {
  const response = await axios.get(API_URL + userId);
  return response.data;
};

const getAllUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
const userService = {
  getUserById,
  getAllUsers,
};

export default userService;
