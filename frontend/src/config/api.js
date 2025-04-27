import axios from 'axios';

const API_URL = 'https://crm-backend-spdcjeuzyq-uc.a.run.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 