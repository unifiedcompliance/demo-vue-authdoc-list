import axios from 'axios';

const customHeaders = {
  'x-rapidapi-host': process.env.VUE_APP_API_HOST,
  'x-rapidapi-key': process.env.VUE_APP_API_KEY,
  useQueryString: process.env.VUE_APP_API_USE_QUERY_STRING
};

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: customHeaders
});

export default instance;
