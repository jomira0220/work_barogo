import styles from './Popup.module.scss';

export const Popup = (props) => {
  const { children, className } = props;
  return (
    <div className={styles.popup + (className ? ` ${className}` : "")}>
      {children}
    </div>
  )
}