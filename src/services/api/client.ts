import axios from 'axios';
import { API_CONFIG } from '../../config/api';

export const aiClient = axios.create({
  baseURL: API_CONFIG.AI_API_URL,
  headers: {
    'Authorization': `Bearer ${API_CONFIG.AI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});