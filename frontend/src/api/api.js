import axios from 'axios';

// On Vercel the frontend and API are deployed together on the same domain
// (see vercel.json), so in a production build we default to a relative
// "/api" path. Locally (npm start) we default to the standalone backend on
// port 5000. Either can be overridden with REACT_APP_API_URL.
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api'),
});

// Attach the JWT (if the person is logged in) to every request automatically
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('thrifto_user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
