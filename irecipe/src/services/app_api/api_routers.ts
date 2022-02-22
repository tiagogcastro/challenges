import {
  SignInData,
  SignInResponse,
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
  list_all: () => {
    return base_api.get('');
  } 
}