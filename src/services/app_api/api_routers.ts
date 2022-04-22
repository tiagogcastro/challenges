import {
  GetProductData,
  SignInData,
  SignInResponse,
  GetProductList,
  SaveProductData,
  SaveProductResponse,
} from './types';

import {
  base_api
} from './';
import { AxiosResponse } from 'axios';

export const user = {
  signIn: (data: SignInData): Promise<AxiosResponse<SignInResponse>> => {
    return base_api.post('/auth/login', data);
  }
}

export const product = {
  list_all: (data?: GetProductData): Promise<AxiosResponse<GetProductList>> => {
    return base_api.get('/product/list', {
      params: data?.query
    });
  },
  save: (data: SaveProductData): Promise<AxiosResponse<SaveProductResponse>> => {
    return base_api.post('/product/save', data);
  },
  delete: (id: number | undefined): Promise<AxiosResponse<void>> => {
    return base_api.delete(`/product/delete/${id}`);
  } 
}