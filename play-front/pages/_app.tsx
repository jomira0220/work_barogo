import "./globals.css";
import { useEffect, useState } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import Apis from "../utils/Apis";
import NextNProgress from "nextjs-progressbar";
import BrandColorSet from "../utils/BrandColorSet";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";

export default function App({
  Component,
  pageProps: { ...pageProps },
  // pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page: any) => page);
  const [isLogin, setIsLogin] = useState("loading");
  const [brandCheck, setBrandCheck] = useState(null); // 브랜드 체크

  // 로그인 상태 확인
  const userDataCheck = async () => {
    if (getCookie("accessToken") && getCookie("refreshToken")) {
      const res = await Apis.get("/api/users/me/brand");
      const data = (await res.data) || null;
      const brand = data.data;
      console.log("brand", brand);
      setIsLogin(data.status === "success" ? "true" : "false");
      setBrandCheck(brand);
      BrandColorSet(brand);
    } else {
      setIsLogin("false");
      setBrandCheck(null);
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }

    if (getCookie("accessToken") === "" || getCookie("refreshToken") === "") {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
  };

  useEffect(() => {
    userDataCheck();
    if (getCookie("accessToken") === undefined) {
      setIsLogin("false");
      setBrandCheck(null);
    }
  }, []);

  // 이전 페이지 경로 저장 처리
  useEffect(() => {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;

    let PrevPathArr = storage.getItem("prevPath")
      ? JSON.parse(storage.getItem("prevPath"))
      : [];

    if (
      storage.getItem("currentPath") &&
      !storage.getItem("currentPath").includes("/edit/")
    ) {
      PrevPathArr.unshift(storage.getItem("currentPath"));
      PrevPathArr = new Set(PrevPathArr);
      PrevPathArr = [...PrevPathArr].slice(0, 15);
      storage.setItem("prevPath", JSON.stringify(PrevPathArr));
    } else {
      storage.setItem("prevPath", JSON.stringify(PrevPathArr));
    }

    let asPath = router.asPath;
    asPath.includes("blockDetailId") && (asPath = asPath.split("?")[0]);
    storage.setItem("currentPath", asPath);
  }, [router]);

  // url에 브랜드 코드 있는 경우 브랜드 코드로 색상 변경
  const queryBrandCheck =
    router.query.brandCode === undefined
      ? "play"
      : (router.query.brandCode as String).toLowerCase();

  // 타이틀 노출 설정
  const titleSet =
    "라이더플레이" +
    (process.env.NEXT_PUBLIC_RUN_MODE !== "production"
      ? " " + process.env.NEXT_PUBLIC_RUN_MODE
      : "");

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover, user-scalable=no"
        />
        <meta name="robots" content="index,nofollow" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge;chrome=1" />
        <meta
          name="description"
          content="모든 배달 라이더를 위한 온라인 커뮤니티 이벤트, 선물, 프로모션, 제휴 혜택, 배달 꿀팁까지 한곳에! 매일 새로운 이벤트를 경험하세요"
        />
        <meta
          name="keywords"
          content="라이더플레이,라이더 플레이,riderplay,rider play,바로고플레이,바로고,모아라인,딜버,배달기사,라이더,플레이,바로고몰,모아라인몰,딜버마트,바로고굿즈,배민1,배달,투잡,오토바이,바이크,중고,중고거래,안전,정보,리뷰,보험,고용보험,시간제보험,산재보험,라이더오픈채팅,라이더카페, 라이더커뮤니티, 라이더지원, 배달대행, 배달, 배달세상, 배민커넥터, 배플, 쿠플, 투잡배달 "
        />

        <meta property="og:title" content="라이더플레이" />
        <meta property="og:url" content="https://www.riderplay.co.kr" />
        <meta
          property="og:image"
          content="https://riderplay.co.kr/images/ogImage.jpg"
        />
        <meta
          property="og:description"
          content="모든 배달 라이더를 위한 온라인 커뮤니티 이벤트, 선물, 프로모션, 제휴 혜택, 배달 꿀팁까지 한곳에! 매일 새로운 이벤트를 경험하세요"
        />

        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-title" content="라이더플레이" />

        <link
          rel="manifest"
          href={`/images/${process.env.NEXT_PUBLIC_RUN_MODE}/manifest.json`}
        />
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="icon" href="/images/favicon.png" />
        <meta name="theme-color" content="#537fe7" />

        <meta name="application-name" content="라이더플레이" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="라이더플레이" />
        <meta name="msapplication-TileColor" content="#537fe7" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="naver-site-verification"
          content="46b367056adfb82dde293c111cb0c2356f236875"
        />
        <link
          rel="apple-touch-startup-image"
          href="/images/splash-640x1136.png"
        />
        <title>{titleSet}</title>
      </Head>

      <NextNProgress
        color={`var(--${queryBrandCheck}-color-1)`}
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ showSpinner: false }} // 원형 로딩바 사용 여부
      />
      {process.env.NEXT_PUBLIC_RUN_MODE === "production" && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-5TLCNX6C');`}
          </Script>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=G-ZWXTQVBN19`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('set', 'cookie_flags', 'cookie-name=value;SameSite=None;Secure;');
                gtag('config', 'G-ZWXTQVBN19', { page_path: window.location.pathname});
                gtag('set', 'cookie_expires', 28 * 24 * 60 * 60);
                `,
            }}
          />
        </>
      )}
      {getLayout(
        <Component isLogin={isLogin} brandCheck={brandCheck} {...pageProps} />
      )}
    </>
  );
}
