import styles from './styles.module.scss';

export function Modal({isOpen, children}: any) {
  return (
    isOpen && (
      <div className={styles.modal_container}>
        {children}
      </div>
    )
  )
}