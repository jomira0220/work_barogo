import Image from "next/image";
import Button from "@/components/Button/Button";
import styles from "./AppPopup.module.scss";
import { useEffect } from "react";
import { ShareIcon, AddHomeIcon } from "@/components/Icon/Icon";
import { GetBrowser } from "@/utils/GetBrowser";

export default function AppPopup(props) {

  const { isDeviceIOS, setIsDeviceIOS, deferredPrompt, setDeferredPrompt, appPop, setAppPop, setAppInstall } = props;

  useEffect(() => {
    // 앱설치여부 확인 함수
    const isAppInstalled = () => {
      if (navigator.standalone) {
        console.log("앱이 설치되어 있습니다.");
        return true;
      } else if (matchMedia("(display-mode: standalone)").matches) {
        console.log("앱이 설치되어 있습니다.");
        return true;
      } else {
        console.log("앱이 설치되어 있지 않습니다.");
        return false;
      }
    };
    isAppInstalled();
    setIsDeviceIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, [setIsDeviceIOS])

  useEffect(() => {
    // 앱 설치가 완료된 경우 이벤트 발생 - 사파리에서 지원하지 않음
    window.addEventListener('appinstalled', (event) => {
      console.log('앱이 설치되었습니다.');
      setAppPop(false);
      setDeferredPrompt(null);
    });

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setAppInstall(true);
      console.log('Layout: beforeinstallprompt 이벤트가 발생했습니다.');
    }

    if (isDeviceIOS === true) {
      setDeferredPrompt(true)
    } else {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt); // ios에서는 지원하지 않음
    }

  }, [setAppPop, setDeferredPrompt, isDeviceIOS, setAppInstall])

  useEffect(() => {
    console.log("접속한 브라우저:", GetBrowser(), " 아이폰 여부:", isDeviceIOS)
  }, [isDeviceIOS])



  //! 안드로이드에서 앱 설치 버튼 클릭시 
  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("사용자가 설치 프롬프트에 동의했습니다.");
          setAppPop(false);
        } else {
          console.log("사용자가 설치 프롬프트를 무시했습니다.");
        }
        setDeferredPrompt(null);
      });
    } else {
      console.log("이미 앱이 설치되어 있거나 앱을 설치할 수 없는 환경입니다")
      setAppPop(false);
      return
    }
  };

  // 오늘 하루 안보기를 누른 경우 expires에 오늘 24시까지의 시간을 저장 및 팝업을 닫음
  const closeTodayPop = () => {
    let expires = new Date();
    expires = expires.setHours(23, 59, 59, 0); //오늘 23시 59분 59초까지의 시간을 구함
    localStorage.setItem("expires", expires);
    setAppPop(false);
    setDeferredPrompt(null); //앱 설치 팝업도 닫음
  };

  useEffect(() => {
    //오늘 하루 안보기를 누른 상태인 경우 오늘 24시까지 팝업을 띄우지 않음
    if (typeof window !== 'undefined') {
      const expires = localStorage.getItem("expires");
      const todayTime = new Date().getTime();
      if (expires && Number(todayTime) < Number(expires)) {
        console.log("layout: 오늘 하루 안보기를 누른 상태입니다.")
        setAppPop(false);
      }
    }
  }, [deferredPrompt, setAppPop]);



  return (
    deferredPrompt !== null && appPop && (
      <div className={styles.installAppBox}>
        <div className={styles.installAppBoxInner}>
          <button className={styles.dayClose} onClick={() => closeTodayPop()}>하루동안 닫기</button>
          {isDeviceIOS ? (
            // IOS인 경우
            <div className={styles.textBox}>
              <Image src="/images/favicon.png" width={40} height={40} alt="라이더플레이 앱 이미지" fetchPriority="high" />
              <p className={styles.ios}>
                편리한 라이더플레이를 위해
                <span> {GetBrowser() === "chrome" ? "주소표시줄 오른쪽 " : GetBrowser() === "safari" ? "브라우저 하단에 " : ""}</span>
                <ShareIcon /> 을 <br />누르고 <span>홈화면에 추가 <AddHomeIcon /> 로</span> <b>앱을 설치해주세요!</b>
              </p>
            </div>
          ) : (
            // 안드로이드인 경우
            <div className={styles.textBox}>
              <Image src="/images/favicon.png" width={40} height={40} alt="라이더플레이 앱 이미지" fetchPriority="high" />
              <p>편리한 라이더플레이를 위해 <br /><b>앱을 설치하시겠습니까?</b></p>
              <Button className={styles.installBtn} variantStyle="color" sizeStyle="sm" onClick={() => handleInstallClick()}>설치하기</Button>
            </div>
          )}
        </div>
      </div>

    )
  );
}