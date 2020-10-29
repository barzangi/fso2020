import axios from 'axios';
const baseUrl = '/api/users';

// get all users
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export default {
  getAll
};