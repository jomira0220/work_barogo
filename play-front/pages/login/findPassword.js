import LayoutBox from "@/components/LayoutBox/LayoutBox";
import PageTop from "@/components/PageTop/PageTop";
import Image from 'next/image'
import styles from './login.module.scss'
import { useRouter } from 'next/router';
import Link from 'next/link'
import Button from "@/components/Button/Button";

export default function FindPasswordPage() {
  const router = useRouter();
  return (
    <>
      <PageTop backPath="/login">
        아이디 · 비밀번호 찾기
      </PageTop>
      <div className={styles.findForm}>
        <div className={styles.findFormInner}>
          <h3><Image src="/images/logo/logo_riderplay.png" width="200" height="35" alt="RiderPlay" priority={true} /></h3>
          <ul className={styles.findSelect}>
            <li className={router.asPath.includes("findId") ? styles.active : ""}><Link href="/login/findId">아이디 찾기</Link></li>
            <li className={router.asPath.includes("findPassword") ? styles.active : ""}><Link href="/login/findPassword">비밀번호 찾기</Link></li>
          </ul>
          <form
            className={styles.changeIdForm}
            method="post"
            action={`${process.env.NEXT_PUBLIC_AUTH_URL}/cert`}
          >
            <div className={styles.inputWrapBox}>
              <div className={styles.inputBox}>
                <label htmlFor='username'>아이디</label>
                <input
                  id='username'
                  type="text"
                  name="username"
                  placeholder='회원님의 아이디를 입력해주세요'
                  defaultValue={router.query.id ? router.query.id : ""}
                />
              </div>
            </div>
            <input
              type="hidden"
              id="retURL"
              name="retURL"
              value={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/changePassword`}
            />
            <Button type="submit" sizeStyle="lg">본인인증 후 비밀번호 변경</Button>
          </form>
        </div>
      </div>
    </>
  )
}

FindPasswordPage.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};



