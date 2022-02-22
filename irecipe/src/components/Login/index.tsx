import axios from 'axios';
import * as Yup from 'yup';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks/useAuth';

import styles from './styles.module.scss';
import { yupGetValidationErrors } from '../../utils/getValidationErrors';
import { useBoolean } from '../../hooks/useBoolean';

export const login_schema_validation = Yup.object().shape({
  username: Yup.string().required('Username é obrigatório'),
  password: Yup.string().required('A senha é obrigatória'),
});

export function Login() {
  const { signIn } = useAuth();
  const loading_submit = useBoolean();

  const [signIn_data, setSignInData] = useState({
    username: '',
    password: '',
  });

  async function login(event: React.FormEvent) {
    event.preventDefault();
    loading_submit.changeToTrue();
    
    try {
      await login_schema_validation.validate(signIn_data, {
        abortEarly: false
      });

      await signIn(signIn_data);
    } catch(error: any) {
      if(error instanceof Yup.ValidationError) {
        const errors = yupGetValidationErrors(error);
  
        errors.forEach(error => {
          toast(error.message, {
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
        })
      }
    } finally {
      loading_submit.changeToFalse();
    }
  }

  function handleChangeInput(field: string, value: any) {
    setSignInData(prevState => {
      return {
        ...prevState,
        [field]: value
      };
    });
  }

  return (
    <div className={styles.login_container}>
      <div className={styles.login_content}>
        <header className={styles.login_header}>
          <img 
            src="/app_logo.png" 
            className={styles.app_logo}  
          />
        </header>
        <form onSubmit={login}>
          <h1 className={styles.form_title}>Login</h1>

          {/* TODO - Fazer component de input */}
          <div className={styles.form_field}>
            <span className={styles.form_field_title}>Username</span>
            <input 
              type="text" 
              className={styles.form_field_input}
              placeholder="Digite seu username"
              onChange={(e) => handleChangeInput('username', e.target.value)}
              value={signIn_data.username}
              disabled={loading_submit.state}
            />
          </div>
          <div className={styles.form_field}>
            <span className={styles.form_field_title}>Senha</span>
            <input 
              type="password" 
              className={styles.form_field_input}
              placeholder="Digite sua senha..."
              onChange={(e) => handleChangeInput('password', e.target.value)}
              value={signIn_data.password}
              disabled={loading_submit.state}
            />
          </div>
          <button
            type="submit"
            title={loading_submit.state ? 'Carregando...' : 'Fazer signIn'}
            className={styles.form_submit_button}
            disabled={loading_submit.state}
          >
            {loading_submit.state ? 'Carregando...' : 'Entrar'} 
          </button>
          <a className={styles.forgot_password}>Esqueceu a senha?</a>
        </form>
      </div>
    </div>
  )
}