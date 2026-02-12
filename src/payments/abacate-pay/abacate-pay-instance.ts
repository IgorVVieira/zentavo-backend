import axios from 'axios';

export const abacatePayInstance = axios.create({
  baseURL: process.env.ABACATE_PAY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.ABACATE_PAY_API_KEY}`,
  },
});
