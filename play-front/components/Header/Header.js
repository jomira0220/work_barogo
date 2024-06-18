import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import { usePathname } from "next/navigation";
import { MainMenuList, SubMenuList } from "@/components/Header/HeaderMenuData";
import Apis from "@/utils/Apis";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";
import { UserIcon, AlramIcon, GiftIcon, LoginIcon, AppDownloadIcon } from "@/components/Icon/Icon";
import { useRouter } from "next/router";
import AppPopup from '@/components/AppPopup';

export default function Header(props) {
  const router = useRouter();
  const { isLogin, brandCheck } = props;

  // !헤더에 선물 개수 및 알림 개수 표시
  const [userCountData, setUserCountData] = useState({ giftCount: 0, notificationCount: 0 });

  useEffect(() => {
    //! 유저 선물 및 알림 개수 가져오기
    const UserCountGet = async () => {
      if (isLogin === "true") {
        const res = await Apis.get(`/api/users/me/counts`);
        const loginData = await res.data;
        setUserCountData(loginData.data);
      }
    };

    UserCountGet();
  }, [isLogin, brandCheck]);

  // 미로그인 상태에서 활동 기록 페이지는 로그인 페이지로 이동
  // 미로그인시 소셜은 시즌 랭킹 페이지로 이동
  MainMenuList.map((item, index) => {
    if (item.name === "활동기록")
      item.link = isLogin === "false" ? "#" : item.link;
    if (item.name === "소셜")
      item.link = isLogin === "false" ? "#" : item.link;
  });

  // console.log("isLogin", userData)

  const pathname = usePathname();
  const parentLink = pathname.split("/")[1];
  const childLink = pathname.split("/")[2] ? pathname.split("/")[2] : "";

  const SubMenuListSet = SubMenuList[parentLink]
    ? SubMenuList[parentLink]
    : brandCheck
      ? SubMenuList.activity
      : SubMenuList.event; // SubMenuList.board
  let SubMenuLinkSet = SubMenuList[parentLink]
    ? [`/${parentLink}/`]
    : brandCheck
      ? ["/activity/"]
      : ["/event/"]; // ["/board/"]

  const [alertModal, setAlertModal] = useState({ onoff: false, message: "" });

  const loginUrl = `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`;


  // 로그인 여부에 따른 메뉴 클릭시 알림창
  const LoginMenuCheck = (name) => {
    if ("활동기록" === name || "소셜 리더보드" === name || "소셜" === name) {
      isLogin === "false" &&
        setAlertModal({
          onoff: true,
          message: (
            <>
              <h5>로그인이 필요한 서비스입니다.</h5>
              <div className={styles.buttonWarp}>
                <Button variantStyle="color" sizeStyle="lg" onClick={() => router.push(loginUrl)}>로그인</Button>
                <Button variantStyle="darkgray" sizeStyle="lg" onClick={() => setAlertModal({ onoff: false, message: "" })}>닫기</Button>
              </div>
            </>
          ),
        });
    }
  };

  // 접속한 기기가 IOS인지 확인
  let [isDeviceIOS, setIsDeviceIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null); // 접속한 기기가 ios인 경우 무조건 true로 설정 
  const [appPop, setAppPop] = useState(true); // 하루동안 보지않기 버튼을 누르지 않은 경우 true - 팝업을 띄움
  const [appInstall, setAppInstall] = useState(); // 앱 설치 버튼을 띄울지 말지 결정



  //! 안드로이드에서 앱 설치 버튼 클릭시 
  const handleInstallClick = () => {
    console.log("deferredPrompt", deferredPrompt, "isDeviceIOS", isDeviceIOS)
    if (isDeviceIOS === true && deferredPrompt === true) {
      setAppPop(true);
      setAppInstall(true)
      alert("하단 팝업에 나온 설치 방법을 따라주세요.")
    } else {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("사용자가 설치 프롬프트에 동의했습니다.");
            setAppPop(false);
          } else {
            console.log("사용자가 설치 프롬프트를 무시했습니다.");
          }
        });
      } else {
        alert("이미 앱이 설치되어 있거나 앱을 설치할 수 없는 환경입니다")
        setAppPop(false);
        // IOS가 아닌 경우에만 앱 설치 버튼을 띄우지 않음
        isDeviceIOS !== true && setAppInstall(false);
      }
    }

  };


  return (
    <>
      {alertModal.onoff && (
        <Modal type="alert" closePortal={() => setAlertModal({ onoff: false, message: "" })}>
          {alertModal.message}
        </Modal>
      )}
      <header className={styles.headerBox}>
        <div className={styles.headerTop}>
          <div className={`${styles.headerMenu} ${styles.left}`}>
            <AppPopup
              isDeviceIOS={isDeviceIOS}
              setIsDeviceIOS={setIsDeviceIOS}
              deferredPrompt={deferredPrompt}
              setDeferredPrompt={setDeferredPrompt}
              appPop={appPop}
              setAppPop={setAppPop}
              setAppInstall={setAppInstall}
            />
            {isLogin === "true" ? (
              <>
                {appInstall && (
                  <button className={styles.appDownloadBtn}
                    onClick={() => handleInstallClick()}><AppDownloadIcon /></button>
                )}
                <Link className={styles.headerItem} href="/user/gift">
                  {userCountData.giftCount > 0 && (
                    <span className={styles.countBox}>
                      {userCountData.giftCount}
                    </span>
                  )}
                  <span className={styles.headerIcon}>
                    <GiftIcon />
                  </span>
                  <span className="blind">선물함</span>
                </Link>
              </>
            ) : (
              appInstall && <button style={{ marginRight: "var(--space-9)" }} className={styles.appDownloadBtn} onClick={() => handleInstallClick()}><AppDownloadIcon /></button>
            )}
          </div>
          <h1 className={styles.headerLogo}>
            <Link href="/">
              {isLogin === "true"
                ? (
                  // 로그인 한 상태
                  brandCheck === "MOALINE" ? (
                    <Image
                      src="/images/logo/logo_moaline.png"
                      alt="moaline logo"
                      width={80}
                      height={20}
                      priority={true}
                    />
                  ) : brandCheck === "DEALVER" ? (
                    <Image
                      src="/images/logo/logo_dealver.png"
                      alt="dealver logo"
                      width={101}
                      height={16}
                      priority={true}
                    />
                  ) : brandCheck === "BAROGO" ? (
                    <Image
                      src="/images/logo/logo_bk.png"
                      alt="barogo logo"
                      width={113}
                      height={17}
                      priority={true}
                    />
                  ) : (
                    // 라이더 코드 등록이 안되어있을 경우
                    <Image
                      src="/images/logo/logo_riderplay.png"
                      alt="riderplay logo"
                      width={115}
                      height={21}
                      priority={true}
                    />
                  )
                ) : (
                  // 로그인 안한 상태
                  <Image
                    src="/images/logo/logo_riderplay.png"
                    alt="riderplay logo"
                    width={115}
                    height={21}
                    priority={true}
                  />
                )
              }

            </Link>
          </h1>
          <ul
            className={
              `${styles.headerMenu}` +
              (isLogin === "true" ? "" : ` ${styles.right}`)
            }
          >
            {isLogin === "true" && (
              <li>
                <Link
                  className={styles.headerItem}
                  href={`/user/notificationList`}
                >
                  {userCountData.notificationCount > 0 && (
                    <span className={styles.countBox}>
                      {userCountData.notificationCount}
                    </span>
                  )}
                  <span className={styles.headerIcon + " " + styles.alramIcon}>
                    <AlramIcon />
                  </span>
                  <span className="blind">알림</span>
                </Link>
              </li>
            )}
            <li>
              <Link
                className={styles.headerItem}
                href={
                  isLogin === "true"
                    ? "/user/myPage"
                    : loginUrl
                }
              >
                <span className={styles.headerIcon}>
                  {isLogin === "true"
                    ? <UserIcon color={"var(--black-color-1)"} />
                    : <LoginIcon color={"var(--black-color-1)"} />}
                </span>
                <span className="blind">마이페이지</span>
              </Link>
            </li>
          </ul>
        </div>

        <ul className={styles.mainMenu}>
          {pathname.indexOf(parentLink) > 0
            ? MainMenuList.map((item) => {
              return (
                <li key={item.name}>
                  <Link
                    className={
                      styles.mainMenuLink +
                      (item.link.indexOf(parentLink) !== -1
                        ? ` ${styles.active}`
                        : "")
                    }
                    href={item.link}
                    name={item.name}
                    onClick={() => LoginMenuCheck(item.name)}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })
            : MainMenuList.map((item, index) => {
              return (
                <li key={item.name}>
                  <Link
                    className={
                      styles.mainMenuLink + (
                        brandCheck // 라이더 코드 등록이 되어있을 경우
                          ? item.name === "활동기록"
                            ? ` ${styles.active}`
                            : ""
                          : item.name === "이벤트 · 소식" //"커뮤니티"
                            ? ` ${styles.active}`
                            : ""
                      )}
                    href={item.link}
                    name={item.name}
                    onClick={() => LoginMenuCheck(item.name)}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
        </ul>

        <ul className={styles.subMenu}>
          {SubMenuListSet.map((item, index) => {
            const itemOff = (subName) => {
              if (subName === "소셜 리더보드") {
                if (isLogin === "false") {
                  return true;
                } else if (isLogin === "true") {
                  // 로그인 한 상태에서 라이더 코드 등록이 안되어있을 경우
                  return brandCheck ? false : true;
                }
              }
            };

            return (
              <li key={item.subName}>
                <Link
                  className={
                    styles.subMenuLink +
                    // (`${childLink}` === `${item.subLink}` // 현재 페이지가 해당 메뉴에 속하는지 확인
                    (
                      item.subLink === childLink ||
                        (
                          pathname.indexOf(parentLink) === 0 &&
                          (
                            brandCheck // 메인 페이지로 접속한 경우 라이더 코드 여부에 따라서 메뉴에 active 클래스 추가
                              ? item.subLink === "report"
                              : item.subLink === "event"  // "hot"
                          )
                        )
                        ? ` ${styles.active}`
                        : ""
                    )
                  }
                  href={
                    // itemOff(item.subName)
                    //   ? "/social/seasonRank?ㄹㄹ"
                    //   : SubMenuLinkSet + item.subLink
                    SubMenuLinkSet + item.subLink
                  }
                  name={item.subName}
                  onClick={() => LoginMenuCheck(item.subName)}
                >
                  {item.subName}
                </Link>
              </li>
            );
          })}
        </ul>
      </header>
    </>
  );
}
