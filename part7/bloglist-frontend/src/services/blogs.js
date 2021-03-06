import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

// get all blogs
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

// add blog
const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

// update blog
const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
  return response.data;
};

// delete blog
const destroy = async id => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

// add comment to blog
const addComment = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}/comments`, newObject);
  return response.data;
};

export default {
  getAll,
  create,
  update,
  destroy,
  addComment,
  setToken
};