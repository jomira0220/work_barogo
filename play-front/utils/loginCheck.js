import { getCookie, deleteCookie } from 'cookies-next';

export const loginCheck = (isLogin) => {
  // if (isLogin === "false" || (getCookie("accessToken") === undefined)) {

  //   deleteCookie("refreshToken");
  //   const hasWindow = () => {
  //     return typeof window !== 'undefined'
  //   }
  //   if (hasWindow()) {
  //     const script = document.createElement("script");
  //     script.innerHTML = `alert('로그인후 이용해주세요.');location.href='/';`;
  //     document.body.appendChild(script);
  //   }

  // }
}

export const loginCheckForServer = (accessToken, refreshToken) => {
  console.log(accessToken, refreshToken)
  // 1. 쿠키에 accessToken, refreshToken이 없으면 로그인 페이지로 이동
  if (!accessToken || !refreshToken) {
    return {
      redirect: {
        destination: `https://www.riderplay.co.kr/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`,
        permanent: false,
      },
    };
  }
  // if (isLogin === "false" || (context.req.headers.cookie === undefined)) {
  //   context.res.writeHead(302, { Location: '/' });
  //   context.res.end();
  // }
}