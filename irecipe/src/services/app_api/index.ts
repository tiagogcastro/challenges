import axios from 'axios';

import {
  user,
  product
} from './api_routers';

export const base_api_url = `https://prova.deploy.profranchising.com.br`;
export const storage_key = 'irecipe@token';

// Use base_api on api_routers file
export const base_api = axios.create({
  baseURL: base_api_url,
});

export const api = {
  user,
  product,
};