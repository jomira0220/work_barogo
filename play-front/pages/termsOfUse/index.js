import PageTop from '@/components/PageTop/PageTop';
import LayoutBox from '@/components/LayoutBox/LayoutBox';
import styles from './termsOfUse.module.scss';
import { termDetail, termKo } from '@/utils/termsOfUseDetail';
import Button from '@/components/Button/Button';
import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { getToken, serverSideGetApi } from '@/utils/serverSideGetApi';
import Apis from '@/utils/Apis';

export default function TermsOfUse(props) {

  const { marketingAgree, userInfo } = props
  const [AgreeCheck, setAgreeCheck] = useState({ "terms_of_provision": true, "terms_of_marketing": marketingAgree }) // 선택형 약관 동의 상태
  const [AlertModal, setAlertModal] = useState(false)

  // !약관 더보기
  const moreView = (key) => {
    const termMenu = document.querySelectorAll(`.${styles.termMenu} li .${styles.detailView}:not([name=${key}])`)
    termMenu.forEach((item) => {
      item.classList.remove(styles.active)
    })
    const detailView = document.getElementsByName(key)[0]
    detailView.classList.toggle(styles.active)
  }


  // !약관 동의 철회 및 동의 api 호출
  const agreeCancel = async (key, userInfo, AgreeCheck, setAgreeCheck, setAlertModal) => {
    const dummy = { ...AgreeCheck }
    dummy[key] = !dummy[key]

    //!! 약관 동의 여부 변경하는 api 호출 성공 여부에 따라서 아래 코드 실행
    const agreePut = await Apis.put('/api/users/me/agree', { username: userInfo.username, agree: dummy[key] })
    console.log("약관동의 변경 api", agreePut)
    if (agreePut.status === 200 && agreePut.data.status === "success") {
      setAgreeCheck(dummy)
      setAlertModal({ onoff: true, name: key })
    } else {
      alert('약관 동의 변경에 실패했습니다. 사유 : ' + agreePut.data.message)
    }
  }

  return (
    <>
      <PageTop>
        이용약관 및 개인정보 취급방침
      </PageTop>
      <div className={styles.termsWarp}>
        {
          AlertModal.onoff && (
            <Modal type="alert" closePortal={() => setAlertModal({ onoff: false, name: "" })}>
              <h3>
                {termKo[AlertModal.name].replace("(선택)", "")}
                {
                  AgreeCheck[AlertModal.name]
                    ? " 동의가 완료되었습니다."
                    : " 동의를 철회했습니다."
                }
              </h3>
              {/* 수정한 날짜 노출 필요 */}
              <Button variantStyle="darkgray" sizeStyle="lg" onClick={() => setAlertModal({ onoff: false, name: "" })}>확인</Button>
            </Modal>
          )
        }

        <ul className={styles.termMenu}>
          {Object.values(termKo).map((item, index) => {
            const termEn = Object.keys(termKo)[index]
            return (
              <li key={index}>
                <div className={styles.title} onClick={() => moreView(termEn)}>
                  <h3>{item}</h3>
                  <div className={
                    styles.agreeState +
                    (
                      item.includes("(선택)")
                        ? (AgreeCheck[termEn] ? "" : ` ${styles.agreeOFF}`)
                        : ""
                    )
                  }>
                    {
                      item.includes("(선택)")
                        ? AgreeCheck[termEn] ? "동의" : "미동의"
                        : "동의"
                    }
                  </div>
                </div>
                <div className={styles.detailView} name={termEn}>
                  {termDetail[termEn]}
                  {item.includes("(선택)") && (
                    <div className={styles.buttonBox}>
                      <Button variantStyle="gray" sizeStyle="lg" onClick={() => moreView(termEn)}>닫기</Button>
                      <Button
                        variantStyle={AgreeCheck[termEn] ? "darkgray" : "color"}
                        sizeStyle="lg"
                        onClick={() => { moreView(termEn); agreeCancel(termEn, userInfo, AgreeCheck, setAgreeCheck, setAlertModal) }}
                      >
                        {AgreeCheck[termEn] ? "동의철회하기" : "동의하기"}
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}



TermsOfUse.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = getToken(context)

  const userInfoRes = await serverSideGetApi('/api/users/me/account', accessToken, refreshToken, context)
  const userInfo = userInfoRes.data || null

  const marketingAgreeRes = await serverSideGetApi('/api/users/me/agree', accessToken, refreshToken, context)
  const marketingAgree = marketingAgreeRes.data || false
  return {
    props: {
      marketingAgree,
      userInfo
    }
  }
}