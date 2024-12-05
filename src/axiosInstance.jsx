import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://34.144.229.213:80/',
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosInstance;
