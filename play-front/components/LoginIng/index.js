import axios from 'axios';
import { getCookie, deleteCookie, setCookie } from "cookies-next";
import Modal from '@/components/Modal/Modal';
import InfoModal from '@/components/InfoModal/InfoModal';
import { useEffect, useState, useRef } from 'react';
import Button from '@/components/Button/Button';

export default function LoginIng({ loginDate, setLoginDate, loginModal, setLoginModal }) {

  const refreshToken = getCookie("refreshToken");

  useEffect(() => {
    if (loginDate !== undefined) {
      // 1분마다 로그인 시간 체크
      const loginTimeCheck = () => setInterval(() => {
        const currentTime = new Date().getTime(); // 현재 시간
        const loginTime = new Date(loginDate).getTime(); // 로그인 시간

        const timeMinute = Math.floor((currentTime - loginTime) / 1000 / 60); // 분으로 변환
        // console.log("로그인한 시간", new Date(loginDate))
        // console.log("로그인한지 몇분", timeMinute)

        // 45분 이상 50분 미만 로그인이 되어있으면
        if (
          timeMinute >= 45 &&
          timeMinute < 50
        ) {
          setLoginModal(true);
        } else if (timeMinute >= 50) {
          // 로그인을 연장하지 않은 상태로 50분 이상 로그인이 되어있으면
          console.log("로그인 시간 만료")
          deleteCookie("accessToken");
          deleteCookie("refreshToken");
          deleteCookie("loginDate");
          clearInterval(loginTimeCheck)
          location.href = "/";

        }
      }, 1000 * 60); // Check every minute
      //1000 * 60 1분
      //1000 * 10 10초
      loginTimeCheck()
    }

  }, [loginDate, setLoginModal]);

  // 로그인 연장
  const loginExtension = async () => {
    // console.log(`${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh`)
    await axios.post(`${process.env.NEXT_PUBLIC_API_KEY}/api/token/refresh`, {},
      {
        headers: { 'Authorization': `Bearer ${refreshToken}` }
      }).then((res) => {
        // 새로 발급받은 엑세스토큰 쿠키에 저장 및 로그인 시간 갱신
        setCookie("accessToken", res.data.data.accessToken, {
          path: "/",
          maxAge: 3600, // 1시간
          sameSite: "strict",
          secure: true
        });
        setCookie("loginDate", new Date(), {
          path: "/",
          maxAge: 60 * 60 * 24 * 1, // 1일
          sameSite: "strict",
          secure: true
        });
        setLoginModal(false);
        console.log(res)
        location.href = "/";
      }).catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      {
        !loginModal && <Modal closePortal={setLoginModal}>
          <InfoModal subTitle={["5분 뒤 자동 로그아웃 됩니다.", <br key={0} />, "로그인을 연장하시겠습니까?"]}>
            <div className="buttonBox">
              <Button variantStyle="color" className="ing" onClick={() => loginExtension()}>로그인 연장</Button>
              <Button variantStyle="darkgray" className="close" onClick={() => setLoginModal(false)}>닫기</Button>
            </div>
          </InfoModal>
        </Modal>
      }
    </>
  )
}
