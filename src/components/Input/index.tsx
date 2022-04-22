import styles from './styles.module.scss';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  type?: React.HTMLInputTypeAttribute;

  children?: React.ReactNode;

  field_title?: string;
  has_input?: boolean;
}

export function Input({
  field_title,
  type = 'text',
  has_input = true,
  children,
  ...rest
}: InputProps) {
  return (
  <div className={styles.form_field}>
    {children}
    {has_input && (
      <>
        <label className={styles.form_field_title}>{field_title}</label>
        <input 
          type={type}
          className={styles.form_field_input}
          {...rest}
          />
      </>
    )}
  </div>
  );
}