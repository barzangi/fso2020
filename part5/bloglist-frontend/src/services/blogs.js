import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

// get all blogs
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
}

// add blog
const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

export default {
  getAll,
  create,
  setToken
};