import axios from 'axios';
import { toast } from 'react-toastify';
import { createContext, useEffect, useState } from 'react';

import {
  SignInResponse,
  SignInData,
  User,
} from '../services/app_api/types';
import {
  api,
  base_api,
  storage_key
} from '../services/app_api';


export type AuthContextData = {
  signIn: (credentials: SignInData) => Promise<SignInResponse | undefined>;
  signOut: () => Promise<void>;
  user: User | null;
  token: string | null;
}

export const AuthContext = createContext({} as AuthContextData);

export type AuthProviderProps = {
  children?: React.ReactNode;
}

export function AuthProvider({
  children
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem(storage_key));
  }, []);

  async function signIn(credentials: SignInData): Promise<SignInResponse | undefined> {
    try {
      const response = await api.user.signIn(credentials);

      const token = response.headers.authorization;

      base_api.defaults.headers.common['authorization'] = `${token}`;
      setToken(token);
      setUser(response.data);
      localStorage.setItem(storage_key, token);

      toast('Você entrou na sua conta com sucesso!', {
        autoClose: 5000,
        pauseOnHover: true,
        type: 'success',
        style: {
          background: '#fff',
          color: '#1a1919' ,
          fontSize: 14,
          fontFamily: 'Roboto, sans-serif',
        }
      });

      return response.data || undefined;
    } catch(error: any) {
      if(axios.isAxiosError(error)) {
        const message_error = error.response?.data.message;
        
        toast(message_error, {
          autoClose: 5000,
          pauseOnHover: true,
          type: 'error',
          style: {
            background: '#fff',
            color: '#1a1919' ,
            fontSize: 14,
            fontFamily: 'Roboto, sans-serif',
          }
        });
      }
    }
  }

  async function signOut(): Promise<void> {
    setToken(null);
    setUser(null);

    localStorage.removeItem(storage_key);
    base_api.defaults.headers.common['authorization'] = '';
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        token
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}