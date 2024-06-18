import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        {
          /* 구글 테그매니저 */
          process.env.NEXT_PUBLIC_RUN_MODE === "production" && (
            <>
              <noscript
                dangerouslySetInnerHTML={{
                  __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5TLCNX6C" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
                }}
              />
            </>
          )
        }
      </body>
    </Html>
  );
}
