import styles from "./Modal.module.scss";
import { LineBasicClose, InfoCircleIcon } from "@/components/Icon/Icon";
/*
  type : 가운데로 모달을 띄울지, 화면 밑에서 모달을 뛰울지
  type
    - center : 가운데로 모달을 띄움
    - bottom : 화면 밑에서 모달을 띄움
  children : 모달 안에 들어갈 내용
  closePortal : 모달을 닫을 함수
*/

export default function Modal(props) {
  const { type, children, closePortal, className } = props;
  return (
    <div id="root-modal">
      <div
        id={styles.modalWrap}
        className={type === "bottom" ? styles.bottom : styles.center}
      >
        <div id={styles.modalBackBox} onClick={() => closePortal()}></div>

        <div
          id={styles.modalBox}
          className={
            (className ? className + " " : "") +
            (type === "alert" && styles.alert)
          }
        >
          {type === "bottom" && (
            <div className={styles.modalClose} onClick={() => closePortal()}>
              <LineBasicClose />
            </div>
          )}
          {type === "alert" && (
            <div className={styles.infoCircleIcon}>
              <InfoCircleIcon size="large" width="42" height="42" />
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
