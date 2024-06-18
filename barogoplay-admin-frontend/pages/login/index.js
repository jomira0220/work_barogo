// import styles from "@/styles/login.module.scss";
// import Image from "next/image";
// import Button from "@/components/Button/Button";
// import PasswordView from '@/components/PasswordView';

import { getToken, serverSideGetApi } from "@/components/utils/serverSideGetApi";



export default function Login(props) {
  return ""
  // return (
  //   <div className={styles.loginBox}>
  //     <div className={styles.inner}>
  //       <Image className={styles.logoImg} src="/images/logo_riderplay.png" alt="riderplay" width={170} height={33} priority />
  //       <form action={`https://auth.riderplay.co.kr/login`} method="post">
  //         <input type="text" placeholder="아이디" name='username' />
  //         <PasswordView />
  //         <Button type="submit" variantStyle="color" sizeStyle="lg">관리자 로그인</Button>
  //       </form>
  //     </div>
  //   </div>
  // );
}

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = getToken(context);
  if (!accessToken || !refreshToken) {
    return {
      redirect: {
        destination: `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`,
        permanent: false,
      },
    };
  }
}