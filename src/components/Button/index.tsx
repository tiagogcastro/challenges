import { UseBooleanData } from '../../hooks/useBoolean';

import styles from './styles.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  type?: string;
  button_title?: string;
  isLoading?: UseBooleanData;
}

export function Button({
  type = 'button',
  button_title,
  isLoading,
}: ButtonProps) {
  return (
    <button
      type={type}
      title={isLoading?.state ? 'Carregando...' : `${button_title}`}
      className={styles.form_submit_button}
      disabled={isLoading?.state}
    >
      {isLoading?.state ? 'Carregando...' : `${button_title}`} 
    </button>
  )
}