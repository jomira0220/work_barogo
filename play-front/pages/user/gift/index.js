
import LayoutBox from '@/components/LayoutBox/LayoutBox'
import PageTop from '@/components/PageTop/PageTop'
import styles from './GiftPage.module.scss'
import Button from '@/components/Button/Button'
import Modal from '@/components/Modal/Modal'
import { useState } from 'react'
import { TextOverflow } from '@/utils/TextOverflow'
// import styled from 'styled-components'
import { getToken, serverSideGetApi } from '@/utils/serverSideGetApi'
import Apis from '@/utils/Apis'
import { useRouter } from 'next/router'
import { termDetail, termKo } from '@/utils/termsOfUseDetail';
import Link from 'next/link'



// const StyledImgBox = styled.div`
//   width: 60px;
//   height: 60px;
//   position: relative;
//   overflow: hidden;
//   border-radius: 50%;
//   background-image: url(${(props) => props.$giftimageurl || `/images/giftimage.png`});
//   background-size: cover;
//   background-position: center;
//   border: 1px solid var(--gray-color-2);
// `

export default function GiftPage(props) {

  const router = useRouter();
  const { data } = props;
  console.log("선물 데이터", data)

  const [alertModal, setAlertModal] = useState({ onoff: false, text: '' }) // 모달창
  const [agreeGift, setAgreeGift] = useState(false) // 선물 약관 동의



  const popClose = () => {
    setAlertModal({ onoff: false, text: "" });
    router.push("/user/gift")
  }

  //  ! 선물 수령하기
  const GiftRegistration = (id, received, setAlertModal) => {
    if (received) { return }

    const getGift = async () => {
      const giftPost = await Apis.post(`/api/gifts/send/${id}`)
      console.log("선물 확인 api", giftPost)

      if (giftPost.status === 200 && giftPost.data.status === "success") {
        setAlertModal({
          onoff: true,
          text: (
            <>
              <h5>등록된 핸드폰 번호로 선물이 전송되었습니다.</h5>
              <Button variantStyle="gray" sizeStyle="lg" onClick={() => popClose()}>닫기</Button>
            </>
          )
        })
      } else {
        setAlertModal({
          onoff: true,
          text: (
            <>
              <h5>선물 수령에 실패했습니다.</h5>
              <p style={{ color: "red" }}>사유 : {giftPost.data.message}</p>
              {giftPost.data.message === "선택약관 미동의" && <Link className={styles.linkStyle} href="/termsOfUse">선택 약관 동의하기</Link>}
              <Button variantStyle="gray" sizeStyle="lg" onClick={() => setAlertModal({ onoff: false, text: "" })}>닫기</Button>
            </>
          )
        })
      }
    }

    setAlertModal({
      onoff: true,
      text: (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <h5>기프티콘을 등록된<br /> 핸드폰 번호로 수령하시겠습니까?</h5>
          <p className="color">*한번 수령한 기프티콘은 재수령이 불가능합니다.</p>
          <div className="buttonWrap">
            <Button variantStyle="color" sizeStyle="lg" onClick={() => getGift()}>수령하기</Button>
            <Button variantStyle="gray" sizeStyle="lg" onClick={() => setAlertModal({ onoff: false, text: "" })}>취소</Button>
          </div>
        </div>
      )
    })
  }

  return (
    <>
      {/* 선물 약관 동의 모달 팝업 */}
      {agreeGift && (
        <Modal
          type="bottom2"
          basicClose={false}
          closePortal={() => setAgreeGift(false)}
          buttonSet={<>
            <Button variantStyle="gray" sizeStyle="lg" onClick={() => setAgreeGift(false)}>닫기</Button>
            <Button variantStyle="color" sizeStyle="lg" onClick={() => setAgreeGift(false)}>동의하기</Button>
          </>}
        >
          <h3>선물을 받기 위해 약관 동의가 필요해요</h3>
          <h4>{termKo.terms_of_provision}</h4>
          {termDetail.terms_of_provision}
        </Modal>
      )}

      <PageTop>선물 메세지</PageTop>
      <div className={styles.giftWrap}>
        <div className={styles.giftItemList}>
          {data.length === 0
            ? <p className={styles.noGift}>보유한 선물이 없습니다.</p>
            : (<>
              <h3>보유한 선물</h3>
              <ul>
                {data.map((item, index) => {
                  //! 선물 만료 여부 확인
                  let expired = false;
                  if (item.expiredDate) {
                    const now = new Date();
                    const expiredDate = new Date(item.expiredDate);
                    if (now > expiredDate) {
                      expired = true;
                    }
                  }

                  return (
                    <li key={index} className={(item.received || expired) ? styles.received : ""} onClick={() => GiftRegistration(item.id, item.received, setAlertModal)}>
                      {/* 선물 만료시 기한 만료 노출 */}
                      <div className={styles.imgBox} style={{ backgroundImage: item.image }}>
                        {item.received && <div className={styles.receiptCompleted}>{expired ? "기한만료" : "수령완료"}</div>}
                      </div>
                      <div className={styles.giftItemInfo}>
                        <h4>{TextOverflow(item.title, 30)}</h4>
                        <p>{TextOverflow(item.message, 30)}</p>
                        <p className={styles.createdDate}>
                          {item.createdDate.split("T")[0].replace(/-/g, ".")}
                          {" ~ "}
                          {
                            item.expiredDate
                              ? item.expiredDate.includes("T")
                                ? item.expiredDate.split("T")[0].replace(/-/g, ".")
                                : ""
                              : ""
                          }
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </>)
          }
        </div>
      </div>

      {alertModal.onoff && (
        <Modal type="alert" closePortal={() => setAlertModal({ onoff: false, text: "" })}>
          {alertModal.text}
        </Modal>
      )}

    </>
  )
}


GiftPage.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  const res = await serverSideGetApi(`/api/gifts/me`, accessToken, refreshToken, context)
  const data = await res.data;

  return (
    {
      props: {
        data
      }
    }
  )
}