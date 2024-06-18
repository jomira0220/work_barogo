import Image from 'next/image'
import { LineBasicArrow } from '@/components/Icon/Icon'
import styles from './ActivityLog.module.scss'
import Apis from '@/utils/Apis'
import { useEffect, useState } from 'react'
import Modal from '@/components/Modal/Modal'
import { LineBasicClose } from '@/components/Icon/Icon'

// 레벨 정보 컴포넌트
export default function ActivityLevelInfo(props) {
  const { profileData } = props;
  const [levelData, setLevelData] = useState([]); // 레벨 데이터
  const [levelDetailToggle, setLevelDetailToggle] = useState(false); // 레벨 상세정보 모달 토글

  useEffect(() => {
    const getLevel = async () => {
      const levelRes = await Apis.get('/api/users/policies/level')
      console.log("레벨 데이터 api", levelRes)
      if (levelRes.status === 200 && levelRes.data.status === 'success') {
        setLevelData(await levelRes.data.data || {});
      } else {
        console.log("레벨 데이터 api 실패 사유 : ", levelRes.data.message)
      }
    }
    getLevel()
  }, [setLevelData])

  const DetailToggle = (index) => {
    document.querySelector(`.${styles.levelItem}:nth-child(${index + 1}) .${styles.leverInfo}`).classList.toggle(`${styles.active}`)
  }

  return (
    <>
      <div className={styles.nickname}>
        {profileData.nickname}
      </div>
      {/* !레벨에 따른 이미지 및 텍스트 변경 */}
      <Image
        onClick={() => setLevelDetailToggle(true)}
        className={styles.levelImg}
        src={profileData.userLevelGrade ? `/images/level/${profileData.userLevelGrade}.png` : "/images/level/D1.png"}
        alt={profileData.userLevelGrade} width={100} height={100} priority
      />

      <div className={styles.levelName}>
        <span>{profileData.userLevelName ? profileData.userLevelName : "초보라이더1"}</span>
        {levelDetailToggle && (
          <Modal closePortal={() => setLevelDetailToggle(false)}>
            <div className={styles.levelTableStyle}>
              <h5>
                티어 기준 정보
                <div className={styles.closeBtn} onClick={() => setLevelDetailToggle(false)}>
                  <LineBasicClose />
                </div>
              </h5>
              <p>
                티어는 누적된 경험치에 따라 결정됩니다. <br />
                시즌이 종료돼도 티어는 초기화되지 않습니다.
              </p>
              <div className={styles.levelTable}>
                <div className={styles.tableTop}>
                  <span>아이콘</span>
                  <span>티어 명</span>
                  <span>상세</span>
                </div>
                <ul className={styles.tableList}>
                  {levelData && levelData.map((item, index) => {
                    return (
                      <li key={index} className={styles.levelItem}>
                        <div className={styles.levelItemBox}>
                          <span><Image src={item.levelGrade ? `/images/level/${item.levelGrade}.png` : `/images/level/D1.png`} alt={item.levelGrade} width={50} height={50} /></span>
                          <span>{item.levelName ? item.levelName : "초보라이더1"}</span>
                          <span className={styles.detailToggleBtn} onClick={() => DetailToggle(index)}>
                            <LineBasicArrow />
                          </span>
                        </div>
                        <div className={styles.leverInfo}>
                          <ul>
                            <li><div className={styles.title}>최소 경험치</div><div>{item.startPoint ? item.startPoint.toLocaleString('ko-kr') : 0}Exp</div></li>
                            <li><div className={styles.title}>최대 경험치</div><div>{item.endPoint ? item.endPoint.toLocaleString('ko-kr') : 0}Exp</div></li>
                          </ul>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  )
}

