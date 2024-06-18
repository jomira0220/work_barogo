export function GetBrowser() {
  // 브라우저 정보 가져오기
  var user = window.navigator.userAgent.toLowerCase();
  var browser = user.indexOf("edge") > -1 ? "edge" //MS 엣지
    : user.indexOf("edg/") > -1 ? "edge(chromium based)" //크롬기반 엣지
      : user.indexOf("opr") > -1 ? "opera" //오페라
        : user.indexOf("chrome") > -1 ? "chrome"	//크롬
          : user.indexOf("trident") > -1 ? "ie"	//익스플로러
            : user.indexOf("firefox") > -1 ? "firefox"	//파이어폭스
              : user.indexOf("safari") > -1 ? "safari"	//사파리
                : user.indexOf("whale") > -1 ? "whale"	//네이버웨일
                  : "other browser"; // 기타

  return browser;
}