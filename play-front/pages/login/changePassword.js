import PageTop from "@/components/PageTop/PageTop";
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import Image from "next/image";
import Button from "@/components/Button/Button";
import styles from "./login.module.scss";
import { PasswordShowHideIcon } from "@/components/Icon/Icon";
import { useEffect, useState } from "react";
import { passwordShowHideHandler } from "@/utils/passwordShowHideHandler";
import util from "util";
import bodyParser from "body-parser";
import axios from "axios";

export default function ChangePassword(props) {

  const { isLogin, brandCheck } = props;
  const [passwordShow, setPasswordShow] = useState({ newPassword: "off", newPasswordCheck: "off" });
  const [passwordMessage, setPasswordMessage] = useState({ newPassword: "8~16자 영문 대/소문자, 숫자, 특수문자(&@$!%^*#?) 중 2가지 이상 조합", newPasswordCheck: "" });

  // !아이디 입력값에 따른 본인인증 체크 - 로그인 하지 않은 상태에서만 실행
  const idCheck = async () => {
    const idCheckRes = await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/ci/check`);
    console.log(idCheckRes);
    if (idCheckRes.data) {
      console.log("아이디에 따른 본인인증 성공")
    } else {
      console.log("아이디에 따른 본인인증 실패")
      alert("해당 아이디에 인증된 정보가 맞지 않습니다.")
      location.href = "/login/findPassword";
    }
  }

  useEffect(() => {
    idCheck();
  }, []);




  // !비밀번호 양식 체크
  const checkPasswordPattern = (e) => {

    let passwordMessageArr = { ...passwordMessage };

    const pass = e.target.value;
    const name = e.target.id;

    var num = pass.search(/[0-9]/g);
    var eng = pass.search(/[a-z]/ig);
    var spe = pass.search(/[&@$!%^*#]/gi);

    if (pass.length > 0) {

      if (name === "newPassword") {

        if (pass.length < 8 || pass.length > 16) {
          passwordMessageArr["newPassword"] = "8자리 ~ 16자리 이내로 입력해주세요.";
        } else if (pass.search(/\s/) != -1) {
          passwordMessageArr["newPassword"] = "비밀번호는 공백 없이 입력해주세요.";
        } else if ((num < 0 && eng < 0) || (eng < 0 && spe < 0) || (spe < 0 && num < 0)) {
          passwordMessageArr["newPassword"] = "영문 대/소문자, 숫자, 특수문자(&@$!%^*#) 중 2가지 이상을 조합"
        } else {
          passwordMessageArr["newPassword"] = "사용 가능한 비밀번호 입니다.";
        }

      } else {
        const newPasswordValue = document.getElementById("newPassword").value;
        const newPasswordCheckValue = document.getElementById("newPasswordCheck").value;
        if (
          (newPasswordValue.length === newPasswordCheckValue.length && newPasswordValue !== newPasswordCheckValue)
          || (newPasswordValue.length < newPasswordCheckValue.length)
        ) {
          passwordMessageArr["newPasswordCheck"] = "비밀번호가 일치하지 않습니다.";
        } else {
          passwordMessageArr["newPasswordCheck"] = "";
        }
      }

    } else {
      passwordMessageArr["newPassword"] = "";
      passwordMessageArr["newPasswordCheck"] = "";
    }

    setPasswordMessage(passwordMessageArr);
  }

  // !비밀번호 변경
  const ChangePasswordHandler = async () => {
    const newPassword = document.getElementById("newPassword").value;
    const newPasswordRes = await axios.put(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/find/password`, { newPassword: newPassword })
      .then((res) => {
        location.href = process.env.NEXT_PUBLIC_DOMAIN_URL;
      }).catch((err) => {
        alert(err.response.data.errorMessage)
      })
  }

  return (
    <>
      <PageTop>비밀번호 변경</PageTop>
      <div className={styles.findForm}>
        <div className={styles.findFormInner}>
          <h3>
            {isLogin === "true" && brandCheck !== null ?
              (brandCheck === "MOALINE" ? (
                <Image
                  src="/images/logo/logo_moaline.png"
                  alt="moaline logo"
                  width={130}
                  height={30.8}
                  priority={true}
                />
              ) : brandCheck === "DEALVER" ? (
                <Image
                  src="/images/logo/logo_dealver.png"
                  alt="dealver logo"
                  width={150}
                  height={23.7}
                  priority={true}
                />
              ) : brandCheck === "BAROGO" ? (
                <Image
                  src="/images/logo/logo_bk.png"
                  alt="barogo logo"
                  width={200}
                  height={30}
                  priority={true}
                />
              ) : (
                <Image
                  src="/images/logo/logo_riderplay.png"
                  alt="barogo logo"
                  width={160}
                  height={31}
                  priority={true}
                />
              )) : (
                <Image
                  src="/images/logo/logo_riderplay.png"
                  alt="barogo logo"
                  width={200}
                  height={39}
                  priority={true}
                />
              )}
          </h3>

          <form className={styles.inputWrapBox}>
            <input type="text" name="username" defaultValue="" style={{ "display": "none" }} autoComplete='username' />
            <div className={styles.inputBox}>
              <label htmlFor="newPassword">새 비밀번호</label>
              <div className={styles.passwordInputBox}>
                <input onChange={(e) => checkPasswordPattern(e)} type="password" autoComplete="new-password" id="newPassword" placeholder='새 비밀번호를 입력해주세요' />
                <div onClick={(e) => passwordShowHideHandler(e, setPasswordShow, passwordShow)}><PasswordShowHideIcon onoff={passwordShow.newPassword} /></div>
              </div>
              <p className={styles.checkText + (passwordMessage.newPassword.includes("사용 가능한") ? " " + styles.default : "")}>{passwordMessage.newPassword}</p>
            </div>
            <div className={styles.inputBox}>
              <label htmlFor="newPasswordCheck">새 비밀번호 확인</label>
              <div className={styles.passwordInputBox}>
                <input onChange={(e) => checkPasswordPattern(e)} type="password" autoComplete="new-password" id="newPasswordCheck" placeholder='새 비밀번호를 한번 더 입력해주세요' />
                <div onClick={(e) => passwordShowHideHandler(e, setPasswordShow, passwordShow)}><PasswordShowHideIcon onoff={passwordShow.newPasswordCheck} /></div>
              </div>
              <p className={styles.checkText}>{passwordMessage.newPasswordCheck}</p>
            </div>
          </form>
          <Button type="submit" sizeStyle="lg" variantStyle="color" onClick={() => ChangePasswordHandler()}>비밀번호 변경</Button>

        </div>
      </div>
    </>
  )
}

ChangePassword.getLayout = function getLayout(page) {
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