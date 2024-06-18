import LayoutBox from "@/components/LayoutBox/LayoutBox";
import PageTop from "@/components/PageTop/PageTop";
import Button from "@/components/Button/Button";
import styles from './login.module.scss'
import bodyParser from "body-parser";
import util from "util";
import axios from "axios";
import { useEffect, useState } from 'react';
import { PasswordShowHideIcon } from "@/components/Icon/Icon";

export default function JoinPage(props) {

  const { params } = props;
  // 본인확인 후 전송받은 데이터 전화번호, 이름, 성공여부(B00), 성공여부에 따른 메시지
  const { TEL_NO, RSLT_NAME, RSLT_CD, RSLT_MSG } = params;

  useEffect(() => {
    if (RSLT_CD !== "B000") {
      console.log("본인확인 실패");
      location.href = '/login/signup';
    }
  }, [RSLT_CD]);

  // 오류 메시지 출력용
  const [CheckIDMsg, setCheckIDMsg] = useState('');
  const [CheckEMAILMsg, setCheckEMAILMsg] = useState('');
  const [CheckPWMsg1, setCheckPWMsg1] = useState('');
  const [CheckPWMsg2, setCheckPWMsg2] = useState('');


  const [emailOption, setEmailOption] = useState("none"); // 이메일 옵션 선택형
  const [emailID, setEmailId] = useState(''); // 이메일 아이디

  //! 회원가입 버튼 클릭시 값 확인 및 가입 완료 처리
  const JoinSubmit = async (e) => {
    e.preventDefault();
    console.log('회원가입 버튼 클릭됨');

    const userID = document.querySelector('#userId').value;
    const userEMAIL = document.querySelector('#email').value;
    const userPASS = document.querySelector('#password1').value;

    // 가입처리
    const JoinRes = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/api/signup`,
      { username: userID, password: userPASS, email: userEMAIL },
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then((res) => {
      console.log("가입", res.data);
      return res;
    }).catch(async (err) => {
      console.log("가입에러", err.response);
      return err.response;
    });

    if (JoinRes) {
      if (JoinRes.data === userID) {
        alert('가입이 완료되었습니다.');
        location.href = process.env.NEXT_PUBLIC_DOMAIN_URL // 가입완료 후 메인페이지로 이동
      } else if (JoinRes.data.status !== '200') {
        if (JoinRes.data.errorMessage === 'VALIDATION_EXCEPTION') {
          alert("입력값(아이디, 이메일, 패스워드)의 형식이 잘못되었습니다.")
        } else {
          alert(JoinRes.data.errorMessage);
        }
      }
    }
  }

  //! 이메일 규칙 확인
  const checkEMAIL = (value, emailOption) => {
    if (emailOption === "none") {
      // 직접입력
      const regExp = /^[a-zA-Z0-9]([-_.0-9a-zA-Z])+@[0-9a-zA-Z]+\.[a-z]{2,3}$/;
      if (value == '') {
        setCheckEMAILMsg('');
        return
      } else if (regExp.test(value)) {
        setCheckEMAILMsg('사용 가능한 이메일입니다.');
      }
    }
    setEmailId(value)
  }


  //! 비밀번호 규칙 확인
  const checkPW1 = (setCheckPWMsg1) => {

    const pass = document.querySelector('#password1').value;

    var num = pass.search(/[0-9]/g);
    var eng = pass.search(/[a-z]/ig);
    var spe = pass.search(/[&@$!%^*#]/gi);

    if (pass.length === 0) {
      setCheckPWMsg1('8~16자 영문 대/소문자, 숫자, 특수문자(&@$!%^*#) 중 2가지 이상 조합');
    } else if (pass.length < 8 || pass.length > 16) {
      setCheckPWMsg1("8자리 ~ 16자리 이내로 입력해주세요.");
    } else if (pass.search(/\s/) != -1) {
      setCheckPWMsg1("비밀번호는 공백 없이 입력해주세요.");
    } else if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
      setCheckPWMsg1("영문 대/소문자, 숫자, 특수문자(&@$!%^*#) 중 2가지 이상을 조합")
    } else {
      setCheckPWMsg1("사용 가능한 비밀번호 입니다.");
    }

  }


  //! 비밀번호 확인
  const checkPW2 = (setCheckPWMsg2) => {
    const pass1 = document.querySelector('#password1').value;
    const pass2 = document.querySelector('#password2').value;
    if (pass1 === pass2 && pass2 !== '') {
      setCheckPWMsg2('패스워드가 일치합니다.');
    } else if (pass1 !== pass2) {
      setCheckPWMsg2('패스워드가 일치하지 않습니다.');
    } else {
      setCheckPWMsg2('')
    }
  }


  //! 아이디 중복검사
  const checkID = async (e, setCheckIDMsg) => {
    e.preventDefault();
    const userId = document.querySelector('#userId').value;
    const regExp = /^[a-z]{1}[a-z0-9]{4,12}$/;

    if (!regExp.test(userId)) {
      setCheckIDMsg('사용할 수 없는 아이디입니다.');
      return;
    }

    const checkIdRes = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/users/exist?username=${userId}`)
      .then((res) => {
        return res.data;
      }).catch(async (err) => {
        console.log("사용 가능한 아이디 확인 에러", err);
        return err;
      });

    if (checkIdRes === false) {
      setCheckIDMsg('사용 가능한 아이디입니다.');
    } else {
      setCheckIDMsg('사용할 수 없는 아이디입니다.');
      document.querySelector('#userId').value = '';
    }
  }

  //! 비밀번호 보이기/숨기기
  const [passwordOnOff, setPasswordOnOff] = useState({ password1: 'off', password2: 'off' });
  const passwordOnOffHandler = (e) => {
    const target = e.currentTarget.previousElementSibling;
    const type = target.getAttribute('type');
    const id = target.getAttribute('id');
    if (type === 'password') {
      target.setAttribute('type', 'text');
      setPasswordOnOff({ ...passwordOnOff, [id]: 'on' });
    } else {
      target.setAttribute('type', 'password');
      setPasswordOnOff({ ...passwordOnOff, [id]: 'off' });
    }
  }


  //! 아이디 입력값 실시간 체크 및 메시지 출력
  const idWriteHandler = (e, setCheckIDMsg) => {
    e.target.value = e.target.value.toLowerCase()
    const value = e.target.value;
    const firstStringCheck = /^[a-z]{1}/;
    const specialCharactersCheck = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
    const emoji = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;

    if (!firstStringCheck.test(value)) {   // 입력값이 소문자로 시작하지 않는 경우
      setCheckIDMsg('첫글자는 영문 소문자 시작해주세요.');
    } else if (value.length < 5) { // 입력값이 5자리 이상인 경우
      setCheckIDMsg('5자리 이상 입력해주세요.');
    } else if (value.includes(' ')) { // 공백이 포함된 경우
      setCheckIDMsg('공백은 입력할 수 없습니다.');
    } else if (value.length >= 5) { // 입력값이 5자리 이상인 경우
      setCheckIDMsg('아이디 중복검사를 해주세요.');
      if (value.length > 12) { // 입력값이 12자리 이상인 경우
        setCheckIDMsg('12자리 이하로 입력이 가능합니다.');
      }
    }

    if (specialCharactersCheck.test(value) || emoji.test(value)) { // 특수문자가 포함된 경우
      setCheckIDMsg('이모지 및 특수문자는 사용할 수 없습니다.');
    }

    if (value === "") { // 아무런 입력값이 없는 경우
      setCheckIDMsg('5 ~ 12자의 영문 소문자, 숫자만 사용가능합니다.');
    }
  }


  return (
    <>
      <PageTop backPath="/login/signup">
        회원가입
      </PageTop>
      <form
        className={styles.joinForm}
        action={`${process.env.NEXT_PUBLIC_AUTH_URL}/join`}
        onSubmit={(e) => JoinSubmit(e)}
      >
        <label htmlFor="name">
          <span className={styles.title}>이 름</span>
          <div className={styles.buttonBox}>
            <input type="text" id="RSLT_NAME" name="RSLT_NAME" value={RSLT_NAME} readOnly />
          </div>
        </label>

        <label htmlFor="phone">
          <span className={styles.title}>연락처</span>
          <div className={styles.buttonBox}>
            <input type="tel" id="TEL_NO" name="TEL_NO" value={TEL_NO} readOnly />
          </div>
        </label>

        <label htmlFor="email">
          <span className={styles.title}>이메일</span>
          <div className={styles.emailSetBox}>
            {emailOption !== "none" ?
              (
                <>
                  <input type="text" name="emailId" placeholder='메일주소를 입력해주세요' defaultValue={emailID} onChange={(e) => checkEMAIL(e.target.value, emailOption)} />
                  <input type="hidden" id='email' name="email" defaultValue={emailID + emailOption} />
                </>
              ) : (
                <input type="email" id="email" name="email" defaultValue={emailID} placeholder='메일주소를 입력해주세요' onChange={(e) => checkEMAIL(e.target.value, emailOption)} />
              )
            }
            <span>{emailOption !== "none" && "@"}</span>
            <select defaultValue={"none"} onChange={(e) => { setEmailOption(e.target.value); setEmailId(emailID) }}>
              <option value="none">직접입력</option>
              <option value="@naver.com">naver.com</option>
              <option value="@gmail.com">gmail.com</option>
              <option value="@hanmail.net">hanmail.net</option>
              <option value="@nate.com">nate.com</option>
            </select>
          </div>
          <span className={styles.alertLogin + (CheckEMAILMsg.includes("사용 가능한") ? ` ${styles.success}` : "")} name="email">{CheckEMAILMsg}</span>
        </label>

        <label htmlFor="userID">
          <span className={styles.title}>아이디</span>
          <div className={styles.buttonBox}>
            <input type="text" id="userId" name="userId" placeholder='아이디를 입력해주세요' onChange={(e) => idWriteHandler(e, setCheckIDMsg)} />
            <Button sizeStyle="sm" variantStyle="color" onClick={(e) => checkID(e, setCheckIDMsg)}>중복검사</Button>
          </div>
          <span className={styles.alertLogin + (CheckIDMsg.includes("사용 가능한") ? ` ${styles.success}` : "")} name="userID">{CheckIDMsg === ' ' ? "" : CheckIDMsg} </span>
        </label>

        <label htmlFor="password1">
          <span className={styles.title}>비밀번호</span>
          <div className={styles.inBox}>
            <input type="password" id="password1" name="password1" autoComplete='password' placeholder='비밀번호 입력' onChange={() => checkPW1(setCheckPWMsg1)} />
            <div className={styles.passwordOnoffBtn} onClick={(e) => passwordOnOffHandler(e)}><PasswordShowHideIcon onoff={passwordOnOff.password1} /></div>
          </div>
          <span className={styles.alertLogin + (CheckPWMsg1.includes("사용 가능한") ? ` ${styles.success}` : "")} htmlFor="password1"> {CheckPWMsg1}</span>
        </label>

        <label htmlFor="password2">
          <span className={styles.title}>비밀번호 확인</span>
          <div className={styles.inBox}>
            <input type="password" id="password2" name="password2" autoComplete='password' placeholder='비밀번호 확인' onChange={() => checkPW2(setCheckPWMsg2)} />
            <div className={styles.passwordOnoffBtn} onClick={(e) => passwordOnOffHandler(e)}><PasswordShowHideIcon onoff={passwordOnOff.password2} /></div>
          </div>
          <span className={styles.alertLogin + (CheckPWMsg2.includes("일치합니다.") ? ` ${styles.success}` : "")} htmlFor="password2">{CheckPWMsg2}</span>
        </label>

        <Button sizeStyle="lg" variantStyle="color" type="submit">가입하기</Button>
      </form>
    </>
  )
}

JoinPage.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
  const getBody = util.promisify(bodyParser.urlencoded());
  await getBody(context.req, context.res);
  const params = context.req.body;
  return {
    props: { params },
  };
};