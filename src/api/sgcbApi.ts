import axios from 'axios';

const sgcbApi = axios.create({
  baseURL: import.meta.env.VITE_TESLO_API_URL,
});

// sgcbApi.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

export { sgcbApi };
