import LayoutBox from "@/components/LayoutBox/LayoutBox";
import PageTop from "@/components/PageTop/PageTop";
import Image from 'next/image'
import Button from "@/components/Button/Button";
import { CheckBoxIcon } from '@/components/Icon/Icon';
import Link from 'next/link'
import styles from './login.module.scss'
import { useRouter } from 'next/router';
import { useState } from "react";
import axios from 'axios';

export default function FindIdPage() {
  const router = useRouter();
  const [showId, setShowId] = useState({ onoff: false, id: "" })

  const [CheckEmailMsg, setCheckEmailMsg] = useState(' ');
  const [CheckPhoneMsg, setCheckPhoneMsg] = useState(' ');
  const [CheckOnOff, setCheckOnOff] = useState(true) // 이메일인지 휴대폰인지 선택 여부 - true: 이메일, false: 휴대폰


  // ! 이메일, 휴대폰 유효성 검사
  const CheckValue = (CheckOnOff, setCheckEmailMsg, setCheckPhoneMsg) => {
    const type = CheckOnOff ? 'email' : 'phone';
    const regExp = CheckOnOff ? /^[a-zA-Z0-9]+@[0-9a-zA-Z]+\.[a-z]{2,3}$/ : /^(01[016789]{1})-?[0-9]{4}-?[0-9]{4}$/;
    const value = document.querySelector(`#${type}`).value;

    if (value === '') {
      CheckOnOff ? setCheckEmailMsg('이메일을 입력해주세요.') : setCheckPhoneMsg('휴대폰 번호를 입력해주세요.');
      return
    } else {
      if (regExp.test(value)) {
        CheckOnOff ? setCheckEmailMsg('사용 가능한 이메일 형식입니다.') : setCheckPhoneMsg('사용 가능한 휴대폰 형식입니다.');
      } else {
        CheckOnOff ? setCheckEmailMsg('잘못된 이메일 형식입니다.') : setCheckPhoneMsg('잘못된 휴대폰 형식입니다.');
      }
    }
  }


  //! 타이머
  let timer;
  var [isRunning, setIsRunning] = useState(false);
  let [timerValue, setTimerValue] = useState("");
  const startTimer = (count, isRunning, timer, type) => {
    var minutes, seconds;

    if (isRunning) {
      // 기존 타이머가 실행중이면 중지
      var highestIntervalId = setInterval(";");
      for (var i = 0; i < highestIntervalId; i++) {
        clearInterval(i);
      }
      setTimerValue("");
    }

    timer = setInterval(function () {
      minutes = parseInt(count / 60, 10);
      seconds = parseInt(count % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      setTimerValue(minutes + ":" + seconds);
      count -= 1;

      // 타이머 만료시
      if (count < 0) {
        clearInterval(timer);
        setTimerValue("만료");
        document.querySelector(`.${type}Req`) && document.querySelector(`.${type}Req`).classList.add(styles.disabled)
      } else {
        document.querySelector(`.${type}Req`) && document.querySelector(`.${type}Req`).classList.remove(styles.disabled)
      }
    }, 1000);

    setIsRunning(true);
  }

  //! 인증 요청
  const ReqCode = async (isRunning, timer, startTimer, CheckOnOff, setCheckEmailMsg, setCheckPhoneMsg) => {

    const type = CheckOnOff ? 'email' : 'phone';
    const name = document.querySelector('#userName').value;
    const value = document.querySelector(`#${type}`).value;

    // ! 이메일 혹은 휴대폰 번호 입력값이 있는지 확인
    if (value === '') return CheckOnOff ? setCheckEmailMsg('이메일을 입력해주세요.') : setCheckPhoneMsg('휴대폰 번호를 입력해주세요.');

    // ! 유효한 이메일 혹은 휴대폰 번호 인지 확인
    const valueCheck = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/find/id/exist?name=${name}&type=${type}&value=${value}`);
    console.log("유효한 메일 & 휴대폰 확인", valueCheck)

    if (valueCheck.status === 200 && valueCheck.data) {
      // ! 인증코드 전송 요청
      const data = CheckOnOff ? { email: value } : { phoneNumber: value };
      const verifiedCodePost = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/verify/${type}`, data);
      console.log("인증코드 전송 요청", verifiedCodePost)

      if (verifiedCodePost.status === 200 && verifiedCodePost.data.status === 'success') {
        startTimer(180, isRunning, timer, type); // 3분 타이머 호출
        CheckOnOff ? setCheckEmailMsg('인증코드가 전송되었습니다.') : setCheckPhoneMsg('인증코드가 전송되었습니다.');
      } else {
        CheckOnOff ? setCheckEmailMsg(emailCode.data.errorMessage) : setCheckPhoneMsg(phoneCode.data.errorMessage);
      }

    } else {
      CheckOnOff ? setCheckEmailMsg(`해당 이메일 주소로 가입된 정보가 없습니다.`) : setCheckPhoneMsg(`해당 휴대폰 번호로 가입된 정보가 없습니다.`);
    }
  }

  // ! 인증 코드 확인
  const SendCode = async (CheckOnOff, setCheckEmailMsg, setCheckPhoneMsg, setTimerValue) => {
    const type = CheckOnOff ? 'email' : 'phone';
    const code_time = document.querySelector(`#${type}_code_time`).value;
    if (code_time === '') {
      CheckOnOff ? setCheckEmailMsg(`인증 요청해주세요.`) : setCheckPhoneMsg(`인증 요청해주세요.`);
    } else if (code_time === '00:00') {
      CheckOnOff ? setCheckEmailMsg(`인증 시간이 만료되었습니다.`) : setCheckPhoneMsg(`인증 시간이 만료되었습니다.`);
    } else {

      const verifiedCode = document.querySelector(`#${type}_code`).value;
      const key = document.querySelector(`#${type}`).value;

      const confirmRes = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/verify/confirm`, { key: key, verifiedCode: verifiedCode });
      console.log("인증 코드 확인", confirmRes)

      if (confirmRes.status === 200 && confirmRes.data.status === 'success') {
        CheckOnOff ? setCheckEmailMsg('인증이 완료되었습니다.') : setCheckPhoneMsg('인증이 완료되었습니다.')

        // 실행중인 타이머 중지
        var highestIntervalId = setInterval(";");
        for (var i = 0; i < highestIntervalId; i++) {
          clearInterval(i);
        }
        setTimerValue("인증 완료");

      } else {
        CheckOnOff ? setCheckEmailMsg("인증이 실패하였습니다.") : setCheckPhoneMsg("인증이 실패하였습니다.");
      }
    }

  }


  // ! 인증완료 후 최종 아이디 찾기 버튼 클릭시
  const findHandler = async (CheckOnOff, CheckEmailMsg, CheckPhoneMsg, setShowId) => {
    const type = CheckOnOff ? 'email' : 'phone';
    const name = document.querySelector('#userName').value;
    const typeValue = document.querySelector(`#${type}`).value;
    const typeMsg = CheckOnOff ? CheckEmailMsg : CheckPhoneMsg;

    if (name === '') {
      return alert('이름을 입력해주세요.');
    } else if (typeValue === '') {
      return alert(`${type}을 입력해주세요.`);
    } else if (typeMsg !== '인증이 완료되었습니다.') {
      return alert('인증이 완료되지 않았습니다.');
    }

    const findIdRes = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/find/id?name=${name}&type=${type}&value=${typeValue}`);
    console.log("아이디 찾기 결과", findIdRes)

    if (findIdRes.status === 200 && findIdRes.data !== '') {
      setShowId({ onoff: true, id: findIdRes.data });
    } else {
      setShowId({ onoff: true, id: "" });
    }
  }

  return (
    <>
      <PageTop backPath="/login">
        아이디 · 비밀번호 찾기
      </PageTop>
      <div className={styles.findForm}>
        <div className={styles.findFormInner}>
          <h3><Image src="/images/logo/logo_riderplay.png" width="200" height="35" alt="RiderPlay" priority={true} /></h3>
          {showId.onoff === false
            ? (<>
              <ul className={styles.findSelect}>
                <li className={router.asPath.includes("findId") ? styles.active : ""}><Link href="/login/findId">아이디 찾기</Link></li>
                <li className={router.asPath.includes("findPassword") ? styles.active : ""}><Link href="/login/findPassword">비밀번호 찾기</Link></li>
              </ul>

              <div className={styles.formWrapBox}>
                <label htmlFor="checkEMAIL">
                  <CheckBoxIcon onoff={String(CheckOnOff)} />
                  <input type="checkbox"
                    className="blind"
                    id="checkEMAIL"
                    defaultChecked={CheckOnOff}
                    name="checkEMAIL"
                    onChange={() => setCheckOnOff(!CheckOnOff)} />
                  등록된 이메일로 찾기
                </label>

                {CheckOnOff && (
                  <div className={styles.inputWrapBox} id='checkEMAILform'>
                    <div className={styles.inputBox}>
                      <label htmlFor='userName'>이름</label>
                      <input id='userName' type='text' name='name' placeholder='회원님의 이름을 입력해주세요' />
                    </div>
                    <div className={styles.inputBox}>
                      <label>이메일</label>
                      <div className={styles.inBox}>
                        <input type="text" id="email" name="email" placeholder='등록된 메일주소 입력' onChange={() => CheckValue(CheckOnOff, setCheckEmailMsg, setCheckPhoneMsg)} />
                        <Button sizeStyle="sm" variantStyle="color" onClick={(e) => ReqCode(isRunning, timer, startTimer, CheckOnOff, setCheckEmailMsg, setCheckPhoneMsg)} >인증 요청</Button>
                      </div>
                      <label name="email_msg">{String(CheckEmailMsg)}</label>
                      <div className={styles.inBox}>
                        <div className={styles.codeBox}>
                          <input type="text" id="email_code" name="email_code" placeholder='인증코드 입력' />
                          <input type="text" id="email_code_time" name="email_code_time" placeholder='인증코드 유효시간' defaultValue={timerValue} disabled />
                        </div>
                        <Button className="emailReq" sizeStyle="sm" variantStyle="color" onClick={() => SendCode(CheckOnOff, setCheckEmailMsg, setCheckPhoneMsg, setTimerValue)} >인증 확인</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.formWrapBox}>
                <label htmlFor="checkPHONE">
                  <CheckBoxIcon onoff={String(!CheckOnOff)} />
                  <input type="checkbox" className="blind" id="checkPHONE" defaultChecked={CheckOnOff} name="checkPHONE" onChange={() => setCheckOnOff(!CheckOnOff)} />
                  등록된 휴대폰으로 찾기
                </label>

                {!CheckOnOff && (
                  <div className={styles.inputWrapBox} id='checkPHONEform'>
                    <div className={styles.inputBox} >
                      <label htmlFor='userName'>이름</label>
                      <input id='userName' type='text' name='name' placeholder='회원님의 이름을 입력해주세요' />
                    </div>
                    <div className={styles.inputBox}>
                      <label>휴대폰</label>
                      <div className={styles.inBox}>
                        <input type="number" id="phone" name="phone" placeholder='등록된 휴대폰 번호 입력' onChange={() => CheckValue(CheckOnOff, setCheckEmailMsg, setCheckPhoneMsg)} />
                        <Button sizeStyle="sm" variantStyle="color" onClick={(e) => ReqCode(isRunning, timer, startTimer, CheckOnOff, setCheckEmailMsg, setCheckPhoneMsg)}>인증 요청</Button>
                      </div>
                      <label name="phone_msg">{String(CheckPhoneMsg)}</label>
                      <div className={styles.inBox}>
                        <div className={styles.codeBox}>
                          <input type="number" id="phone_code" name="phone_code" placeholder='인증코드 입력' />
                          <input type="text" id="phone_code_time" name="phone_code_time" placeholder='인증코드 유효시간' defaultValue={timerValue} disabled />
                        </div>
                        <Button className="phoneReq" sizeStyle="sm" variantStyle="color" onClick={() => SendCode(CheckOnOff, setCheckEmailMsg, setCheckPhoneMsg, setTimerValue)}>인증 확인</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button sizeStyle="lg" id={CheckOnOff ? "email_auth" : "phone_auth"} name={CheckOnOff ? "email_auth" : "phone_auth"} variantStyle="color" onClick={() => findHandler(CheckOnOff, CheckEmailMsg, CheckPhoneMsg, setShowId)}>아이디 찾기</Button>
            </>)
            : (
              showId.id === ""
                ? (
                  <>
                    <div>회원님의 정보와 일치하는 정보가 없습니다.</div>
                    <div className={styles.buttonWrap}>
                      <Button variantStyle="color" size="lg" onClick={() => router.push("/login")}>로그인 페이지 이동</Button>
                      <Button variantStyle="color" size="lg" onClick={() => setShowId({ onoff: false, id: "" })}>회원정보 다시 입력</Button>
                    </div>
                  </>
                )
                : (
                  <div className={styles.showIdBox}>
                    <p>회원님의 아이디는 아래와 같습니다.</p>
                    <div className={styles.showId}>{showId.id}</div>
                    <div className={styles.buttonWrap}>
                      <Button variantStyle="color" size="lg" onClick={() => router.push(`/login?id=${showId.id}`)}>로그인 페이지 이동</Button>
                      <Button variantStyle="darkgray" size="lg" onClick={() => router.push(`/login/findPassword?id=${showId.id}`)}>비밀번호 찾기</Button>
                    </div>
                  </div>
                )
            )
          }
        </div>
      </div>
    </>
  )
}


FindIdPage.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
}; 