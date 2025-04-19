import axios from 'axios';

const request = () => {
  const token = localStorage.getItem('token');
  const headers = token === null ? {} : { Authorization: `Bearer ${token}` };

  const baseURL = process.env.REACT_APP_BASE_URL;
  console.log({ baseURL });

  return axios.create({
    baseURL,
    headers,
  });
};

class Axios {
  constructor() {}

  async post(url, body) {
    return await request().post(url, body);
  }

  async get(url) {
    return await request().get(url);
  }

  async patch(url, body) {
    return await request().patch(url, body);
  }

  async put(url, body) {
    return await request().put(url, body);
  }

  async delete(url) {
    return await request().delete(url);
  }
}

const methods = new Axios();

export default methods;
