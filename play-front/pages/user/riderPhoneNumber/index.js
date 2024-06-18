import LayoutBox from '@/components/LayoutBox/LayoutBox';
import PageTop from '@/components/PageTop/PageTop';
import { getToken, serverSideGetApi } from '@/utils/serverSideGetApi';
import Button from '@/components/Button/Button';
import styles from './RiderPhoneNumber.module.scss';
import { useState, useEffect } from 'react';
import { autoHypenPhone } from '@/utils/autoHypenPhone';
import axios from 'axios';
import { LinkingCloseSet } from '@/utils/LinkingCloseSet';
import FormatTime from '@/components/FormatTime';


export default function RiderPhoneNumber(props) {
  const { isLogin, phoneNumber } = props;

  // ! 타이머 남은 시간
  const [remainingTime, setRemainingTime] = useState(180);

  // ! 타이머 보여주기 여부
  const [timerShow, setTimerShow] = useState(false);

  // ! 인증번호 입력박스 보여주기 여부
  const [certificationNumberBox, setCertificationNumberBox] = useState(false);

  // ! 인증번호 입력시 길이 체크하여 계정 찾기 버튼 활성화 여부 처리
  const [findBtnActive, setFindBtnActive] = useState(false);

  // ! 인증번호 발송 버튼 클릭시
  const SubmitHandler = async () => {
    if (ButtonActive) { // 인증번호 발송 버튼 활성화가 되어있으면(번호 입력이 완료되어있으면)

      setCertificationNumberBox(true) // 인증번호 입력박스 보여주기
      setTimerShow(true); // 인증번호 타이머 보여주기
      setRemainingTime(180); // 남은 시간을 초기값으로 설정하여 타이머 재설정

      axios.defaults.withCredentials = true;
      axios.defaults.crossDomain = true;

      const verifiedCodePost = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/verify/phone`,
        { phoneNumber: document.querySelector('.phone').value.replace(/-/g, '') }
      );
      console.log("인증번호 발송 요청 api", verifiedCodePost)

      if (verifiedCodePost.status === 200 && verifiedCodePost.data.status === "success") {
        alert("인증번호가 발송되었습니다.")
      } else {
        alert("인증번호 발송에 실패했습니다. 사유 : " + verifiedCodePost.data.message)
      }

    } else {
      alert("휴대전화 번호를 입력해주세요.")
    }
  }

  // ! 번호 변경 여부 확인 처리
  const [numberChange, setNumberChange] = useState(false);

  // ! 다른 번호로 등록하기 버튼 클릭시
  const cancelChange = () => {
    setNumberChange(!numberChange); // 번호 변경 여부를 토글
    timerShow && setTimerShow(false); // 타이머가 보여지고 있으면 숨기기
    ButtonActive && setButtonActive(false); // 인증번호 발송 버튼 활성화 상태면 비활성화 상태로 변경
    certificationNumberBox && setCertificationNumberBox(false); // 인증번호 입력박스 노출중이면 숨기기
  }

  // 다른 번호 사용시 인증번호 확인 성공 여부
  const [confirmCheck, setConfirmCheck] = useState(false);

  //! 다른 번호로 계정 찾기 버튼 클릭시
  const RiderCodeFind = async (e) => {

    const newPhoneNumber = document.querySelector('.phone').value.replace(/-/g, '');
    if (newPhoneNumber.length === 11) {
      const phoneRule = /[0-9]{3}[0-9]{4}[0-9]{4}/;
      if (!phoneRule.test(newPhoneNumber)) {
        alert("휴대전화 번호 형식이 맞지 않습니다.");
      } else {
        if (findBtnActive) {
          const verifiedCode = document.querySelector(`#certificationNumber`).value;
          const confirmRes = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/verify/confirm`,
            { key: newPhoneNumber, verifiedCode: verifiedCode }
          ).then(res => {
            if (res.status === 200 && res.data.status === 'success') {
              setConfirmCheck(true);
              setTimeout(() => {
                if (document.querySelector('.findBtn')) { document.querySelector('.findBtn').click(); }
              }, 500);
            } else {
              alert("본인 인증에 실패하였습니다.")
            }
            return res;
          }).catch(err => {
            if (err.response.status === 400) {
              alert("인증번호가 일치하지 않습니다.")
            }
          });
        } else {
          alert("본인 인증을 완료해주세요.")
        }
      }
    } else {
      alert("휴대전화 번호를 입력해주세요.")
    }
  }


  // ! 번호 입력시 길이 체크하여 인증번호 발송 버튼 활성화 여부 처리
  const [ButtonActive, setButtonActive] = useState(false);
  const StringCheck = (value) => {
    if (value.length === 13) {
      setButtonActive(true)
    } else {
      setButtonActive(false)
    }
  }

  return (
    <>
      <PageTop backPath={() => LinkingCloseSet()}>
        휴대전화번호 확인
        <div className={styles.closeRiderCode} onClick={() => LinkingCloseSet()}>연동 종료</div>
      </PageTop>
      <div className={styles.riderPhoneNumberWrap}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <p>
              라이더 계정 연동에 사용할
              <br /> <b>휴대전화 번호</b>를 확인해주세요.
              <span>아래 번호로 사용중인 라이더 계정을 찾습니다.</span>
            </p>
          </div>
          {numberChange === false && (
            <div className={styles.nowTel}>
              <p>{phoneNumber.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}</p>
              <Button variantStyle="color2" sizeStyle="sm" onClick={() => cancelChange()}>다른 번호를 사용하고 있어요!</Button>
            </div>
          )}
          {numberChange && (
            <div className={styles.newTelBox}>
              <div className={styles.telInput}>
                <input readOnly={ButtonActive && timerShow ? true : false}
                  type="tel"
                  className="phone"
                  name="phone"
                  maxLength="13"
                  placeholder='010-1234-5678'
                  autoFocus
                  onChange={(e) => { autoHypenPhone(e); StringCheck(e.target.value) }} />
              </div>
              <div className={styles.buttonWrap}>
                <Button variantStyle="darkgray" sizeStyle="sm" onClick={() => cancelChange()}>취소</Button>
                <Button variantStyle={ButtonActive ? "color2" : "gray"} sizeStyle="sm" onClick={() => SubmitHandler()}>
                  {certificationNumberBox ? "인증번호 재발송" : "인증번호 발송"}
                </Button>
              </div>
            </div>
          )}

          {certificationNumberBox && (
            <div className={styles.numberBox}>
              <p>
                인증번호 입력
                <span className={styles.timer}><FormatTime remainingTime={remainingTime} setRemainingTime={setRemainingTime} timerShow={timerShow} /></span>
              </p>
              <input
                id="certificationNumber"
                className={styles.certificationNumber}
                type="number"
                inputMode='numeric'
                pattern='[0-9]*'
                placeholder="인증번호 입력"
                name="certificationNumber"
                autoFocus
                onChange={(e) => { e.target.value.length === 6 ? setFindBtnActive(true) : setFindBtnActive(false) }}
              />
            </div>
          )}
        </div>

        <div className={styles.bottomArea}>
          {!numberChange || confirmCheck ? (
            <form action="/user/riderCodeAgree" method="post">
              <input
                type="hidden" name="phoneNumber"
                defaultValue={
                  numberChange
                    ? document.querySelector('.phone')
                      ? document.querySelector('.phone').value.replace(/-/g, '')
                      : phoneNumber
                    : phoneNumber
                }
              />
              <Button className="findBtn" variantStyle="color" sizeStyle="lg" type="submit">이 번호로 계정 찾기</Button>
            </form>
          ) : (
            <Button
              variantStyle={
                !numberChange
                  ? "color"
                  : timerShow
                    ? findBtnActive ? "color" : "darkgray"
                    : "darkgray"
              }
              onClick={(e) => RiderCodeFind(e)}
              sizeStyle="lg"
            >
              이 번호로 계정 찾기
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

RiderPhoneNumber.getLayout = function getLayout(page) {
  return (<LayoutBox>{page}</LayoutBox>)
}


export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);

  if (!accessToken || !refreshToken) {
    return {
      redirect: {
        destination: `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`,
        permanent: false,
      },
    }
  }

  // 회원정보에 저장된 핸드폰 번호 가져오기
  const userDataRes = await serverSideGetApi(`/api/users/me/account`, accessToken, refreshToken, context);
  let phoneNumber = await userDataRes ? userDataRes.data.phoneNumber : null;

  return {
    props: {
      phoneNumber
    }
  }

}
