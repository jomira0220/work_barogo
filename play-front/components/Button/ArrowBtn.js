import styles from './ArrowBtn.module.scss'

export default function ArrowBtn({ type, className, onClick }) {
  if (type === "prev") {
    return (
      <button
        className={styles.arrowBtn + (className ? ` ${className}` : "")} onClick={onClick}>
        {"‹"}
      </button>
    )
  } else if (type === "next") {
    return (
      <button
        className={styles.arrowBtn + (className ? ` ${className}` : "")} onClick={onClick}>
        {"›"}
      </button>
    )
  }


}