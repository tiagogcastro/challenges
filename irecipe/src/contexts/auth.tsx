import axios from 'axios';
import { toast } from 'react-toastify';
import { createContext, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

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
import { useBoolean } from '../hooks/useBoolean';

export type AuthContextData = {
  signIn: (credentials: SignInData) => Promise<SignInResponse | undefined>;
  signOut: () => Promise<void>;
  user: User | null;
  token: string | null;
  tokenIsValid: boolean;
  page_loading: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

export type AuthProviderProps = {
  children?: React.ReactNode;
}

export function AuthProvider({
  children
}: AuthProviderProps) {
  const next_router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const tokenIsValid = useBoolean();
  const page_loading = useBoolean(true);

  useMemo(() => {
    if (typeof window === "undefined") return;

    const getToken = localStorage.getItem(storage_key);
    setToken(getToken);
  
    base_api.defaults.headers.common['Authorization'] = `${getToken}`;
  
    base_api.interceptors.response.use(
      (response) => {
        // tokenIsValid.changeToTrue();
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          signOut();
        }
      }
    );
  }, []);

  async function signIn(credentials: SignInData): Promise<SignInResponse | undefined> {
    try {
      const response = await api.user.signIn(credentials);

      const token = response.headers.authorization;

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

      tokenIsValid.changeToTrue();
      page_loading.changeToFalse();

      base_api.defaults.headers.common['Authorization'] = `${token}`;

      next_router.push('/products');

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
    tokenIsValid.changeToFalse();

    localStorage.removeItem(storage_key);
    base_api.defaults.headers.common['authorization'] = '';

    page_loading.changeToFalse();

    next_router.push('/');
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        token,
        tokenIsValid: tokenIsValid.state,
        page_loading: page_loading.state
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}