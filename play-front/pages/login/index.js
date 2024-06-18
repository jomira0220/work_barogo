import Image from 'next/image'
import styles from './login.module.scss'
import Link from 'next/link'
import Button from '@/components/Button/Button'
import { CheckBoxIcon } from '@/components/Icon/Icon';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { PasswordShowHideIcon } from "@/components/Icon/Icon";
import { passwordShowHideHandler } from "@/utils/passwordShowHideHandler";
import util from "util";
import bodyParser from "body-parser";
import { deleteCookie } from 'cookies-next';

export default function LoginPage(props) {

  const router = useRouter()
  const [passwordShow, setPasswordShow] = useState({ password: "off" });
  const [checkArr, setCheckArr] = useState([1])

  // ! 로그인 유지 체크박스 핸들러
  const CheckHandler = (e) => {
    const dummy = [...checkArr]
    if (e.target.name === "remember-me") {
      dummy[0] = !dummy[0]
    }
    setCheckArr(dummy)
  }

  console.log("로그인 페이지 props", props)

  useEffect(() => {
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('error') === "sessionExpired") {
      deleteCookie('accessToken')
      deleteCookie('refreshToken')
    }

    if (props.error && props.isLogin === "false") {
      if (props.error === "sessionExpired") {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.")
      } else {
        alert(props.error)
      }
    }
  }, [props])

  return (
    <div className={styles.loginWrap}>
      <form className={styles.loginForm} method="post" action={`${process.env.NEXT_PUBLIC_AUTH_URL}/login`}>
        <h1 className="main-logo">
          <Link href="/">
            <Image src="/images/logo/logo_riderplay.png" width="200" height="35" alt="라이더플레이" priority />
          </Link>
        </h1>

        <div className={styles.inputBox}>
          <label htmlFor="username">아이디</label>
          <input type="text"
            id="username"
            name="username"
            className="form-control"
            required=""
            autoFocus
            placeholder="아이디를 입력해주세요"
            defaultValue={router.query.id ? router.query.id : ""}
          />
        </div>
        <div className={styles.inputBox}>
          <label htmlFor="password">비밀번호</label>
          <div className={styles.passwordBox}>
            <input type="password" id="password" name="password" className="form-control" required="" placeholder="비밀번호를 입력해주세요" autoComplete="true" />
            <div onClick={(e) => passwordShowHideHandler(e, setPasswordShow, passwordShow)}><PasswordShowHideIcon onoff={passwordShow.password} /></div>
          </div>
        </div>

        <div className={styles.findStaus}>
          <div className={styles.loginStateBox}>
            <label htmlFor="remember-me"><CheckBoxIcon onoff={String(checkArr[0])} /></label>
            <input type="checkbox" className="blind" id="remember-me" defaultChecked={checkArr[0]} name="remember-me" onChange={(e) => CheckHandler(e)} value={String(checkArr[0])} />
            <label htmlFor="remember-me">로그인 상태 유지</label>
          </div>
          <Link href="/login/findId" id="findIdPw">아이디 · 비밀번호 찾기</Link>
        </div>

        <Button type="submit" variantStyle="color" sizeStyle="lg">로그인</Button>
        <Link className={styles.joinBtn} href="/login/signup">회원가입</Link>
        <Link className={styles.noJoinIng} href="/">비회원으로 계속하기</Link>
      </form>
    </div>


  )
}

export const getServerSideProps = async (context) => {

  const getBody = util.promisify(bodyParser.urlencoded());
  await getBody(context.req, context.res);
  const params = context.req.query

  const query = context.query
  const error = query.error ? query.error : null
  return {
    props: { error },
  };
};