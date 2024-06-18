import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import InfoModal from "@/components/InfoModal/InfoModal";
import axios from "axios";
import { useRouter } from "next/router";


const LoginSecondBox = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: #fff;
  font-size: 14px;
  z-index: 100;
`

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`

export default function Timer(props) {

  const [loginModal, setLoginModal] = useState(false);
  const router = useRouter();

  const loginTime = new Date(props.loginDate); // 로그인한 시간
  const loginStateTime = Math.floor((new Date() - loginTime) / 1000); // 로그인후 지난 시간(초)
  const loginTimeRemaining = 60 * 55 - loginStateTime; // 로그인 연장까지 남은 초 = (50분(3000초) - 로그인 후 지난 시간(초))
  const [seconds, setSeconds] = useState(loginTimeRemaining);


  const refreshToken = getCookie("refreshToken");
  const loginExtension = async (refreshToken) => {
    setLoginModal(false); // 로그인 연장 안내 모달 닫기
    // 리프레시 토큰으로 엑세스 토큰 재발급
    await axios
      .post(`http://dev1.play.barogo.in:8080/api/token/refresh`, {}, { headers: { Authorization: `Bearer ${refreshToken}` }, })
      .then((res) => {
        // 새로 발급받은 엑세스토큰 쿠키에 저장 및 로그인 시간 갱신
        setCookie("accessToken", res.data.data.accessToken, {
          path: "/",
          maxAge: 3600, // 1시간
          sameSite: "strict",
          secure: true,
        });
        // 기존 리프레시 토큰 기간 연장
        setCookie("refreshToken", refreshToken, {
          path: "/",
          maxAge: 3600, // 1시간
          sameSite: "strict",
          secure: true,
        });
        // 로그인 시간 갱신
        setCookie("loginDate", new Date(), {
          path: "/",
          maxAge: 60 * 60 * 1, // 1시간
          sameSite: "strict",
          secure: true,
        });
        // 페이지 새로고침 - 쿠키에 저장된 로그인 시간으로 타이머 재시작
        router.reload();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  useEffect(() => {
    const loginTimer = setTimeout(() => setSeconds(seconds - 1), 1000); // 1초마다 감소
    // 로그인하고 50분부터 55분까지는 
    // 연장안내 팝업의 닫기 버튼을 누르기 전까지 로그인 연장 안내 모달 띄우기
    // 로그인을 연장하면 페이지 리로드 후 50분이 다시 시작
    if (300 > seconds && seconds > 0 && loginModal === false) {
      setLoginModal(true);
    } else if (seconds === -240) {
      // 로그인을 연장하지 않은 상태에서 240초(4분) 지나면 로그아웃
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("loginDate");
      location.href = "/";
    }

  }, [seconds, loginModal]);



  return (
    <>
      <LoginSecondBox>
        {loginTime.getHours() - 12}시 {loginTime.getMinutes()}분 {loginTime.getSeconds()}초 로그인
        <br />{Math.floor(seconds / 60)}분 남음
        <br />{seconds}초 남음
      </LoginSecondBox>
      {loginModal && (
        <Modal closePortal={() => setLoginModal(false)}>
          <InfoModal
            subTitle={[
              "5분 뒤 자동 로그아웃 됩니다.",
              <br key={0} />,
              "로그인을 연장하시겠습니까?",
            ]}
          >
            <ButtonBox>
              <Button
                sizeStyle="lg"
                variantStyle="color"
                className="ing"
                onClick={() => loginExtension(refreshToken)}
              >
                로그인 연장
              </Button>
              <Button
                sizeStyle="lg"
                variantStyle="darkgray"
                className="close"
                onClick={() => { setLoginModal(false); clearTimeout(loginTimer); setSeconds(seconds > 0 ? 0 : seconds); }}
              >
                닫기
              </Button>
            </ButtonBox>
          </InfoModal>
        </Modal >
      )
      }
    </>
  );
}

