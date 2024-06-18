import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { getCookie, deleteCookie, setCookie } from "cookies-next";
import NextNProgress from "nextjs-progressbar";
import Head from 'next/head';

export default function App({ Component, pageProps: { ...pageProps } }) {
  const [isLogin, setIsLogin] = useState("loading"); // 로그인 상태..
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    if (getCookie("accessToken") && getCookie("refreshToken")) {
      setIsLogin("true");
    } else {
      setIsLogin("false");
    }
  }, []);

  const titleSet =
    "라이더플레이 어드민" +
    (process.env.NEXT_PUBLIC_RUN_MODE !== "production"
      ? " " + process.env.NEXT_PUBLIC_RUN_MODE
      : "");

  return (
    <>
      <Head>
        <title>{titleSet}</title>
      </Head>

      <NextNProgress
        color="#000"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ showSpinner: false }} // 원형 로딩바 사용 여부
      />
      {getLayout(
        <Component isLogin={isLogin} {...pageProps} />
      )}
    </>
  );

}
