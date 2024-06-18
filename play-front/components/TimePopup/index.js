import styles from './TimePopup.module.scss'
import { useEffect, useState } from 'react'
import { XIcon } from '@/components/Icon/Icon'

export default function TimePopup() {

  const [popup, setPopup] = useState(false)


  const btnTodayClose = () => {
    let expires = new Date();
    expires = expires.setHours(expires.getHours() + 24);
    localStorage.setItem("today", expires);
    // 현재 시간의 24시간 뒤의 시간을 homeVisited에 저장
    setPopup(false);
  }

  const btnClose = () => {
    setPopup(false);
  }

  useEffect(() => {
    const today = new Date();
    const HOME_VISITED = localStorage.getItem("today");
    const handleMainPop = () => {
      if (HOME_VISITED && HOME_VISITED > today) {
        // 현재 date가 localStorage의 시간보다 크면 return
        return;
      }
      if (!HOME_VISITED || HOME_VISITED < today) {
        // 저장된 date가 없거나 today보다 작다면 popup 노출
        setPopup(true);
      }
    };
    setTimeout(handleMainPop, 1000); // 1초 뒤 실행
  }, [])


  return (
    popup && (
      <div className={styles.mainPopup}>
        <div className={styles.layerCont}>
          <div className={styles.popupContent}>
            팝업 콘텐츠
            sddfs
            sfdsdf
            sfdsdf
          </div>
          <div className={styles.btnWrap}>
            <button className={styles.btnTodayClose} onClick={() => btnTodayClose()}><span>오늘 하루 보지 않기</span></button>
            <button className={styles.btnClose} onClick={() => btnClose()}>닫기</button>
            <button className={styles.btnCloseIcon} onClick={() => btnClose()}>
              <XIcon />
              <span className='blind'>닫기</span>
            </button>
          </div>
        </div>
      </div>
    )
  )
}