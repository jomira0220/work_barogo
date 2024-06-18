import PageTop from '@/components/PageTop/PageTop';
import LayoutBox from '@/components/LayoutBox/LayoutBox';
import Button from '@/components/Button/Button';
import styles from './RecommendCode.module.scss'
import { setCookie } from 'cookies-next';
import Image from 'next/image';
import { HomeIcon, UserIcon } from '@/components/Icon/Icon';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Modal from '@/components/Modal/Modal';
import Apis from '@/utils/Apis';

export default function RecommendCode(props) {

  const { isLogin } = props;
  console.log("로그인여부", isLogin)

  // 접속한 주소에 쿼리가 qr이면 상단에 링크 아이콘을 두개(홈, 마이페이지) 노출
  const [QrCheck, setQrCheck] = useState(false)

  useEffect(() => {
    location.search === "?qr" && setQrCheck(true) // qr코드 타고 들어온 경우
  }, [])


  //! 접근 권한이 없는 상태로 접근했을 경우 
  //! 로그인 페이지로 이동 처리 및 로그인 후 해당 페이지로 올수 있도록 쿠키 저장 (login페이지에 관련 설정있음)
  const loginGo = () => {
    setCookie("beforeLogin", location.href)
    location.href = `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`
  }

  const [infoText, setInfoText] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const recommendCodeHandler = async () => {
    const recommendCode = document.getElementById("recommendCode").value;
    if (recommendCode === "") {
      setInfoText("추천 코드를 입력해주세요.")
      return
    } else {
      // 추천코드 등록 api 호출
      const RecommendCodeRes = await Apis.post("/api/users/me/coupon", { code: recommendCode });
      console.log("추천코드 등록 결과", RecommendCodeRes.data)
      if (RecommendCodeRes.data.status === "success") {
        setModalOpen(true) // 추천코드 등록 성공시 모달창 오픈
        setInfoText("") // 입력창 하단 메시지 초기화
        document.getElementById("recommendCode").value = "" // 인풋창 초기화
      } else {
        // 추천 코드 등록 실패시 입력창 하단에 메시지 출력
        setInfoText(RecommendCodeRes.data.message)
      }
    }
  }


  if (isLogin === "false") {
    return (
      <>
        <div className={styles.recommendCodeTop}>
          <h2>추천 코드 등록</h2>
          <Link className={styles.linkBtn + " " + styles.homeIcon} href="/"><HomeIcon /></Link>
        </div>
        <div className={styles.recommendCodeBox}>
          <Link href={"/"}>
            <Image src="/images/logo/logo_riderplay.png" alt="riderplay logo" width={175} height={30} priority={true} />
          </Link>
          <p>추천 코드 등록은<br /> 로그인이 필요한 서비스입니다.</p>
          <Button className={styles.loginBtn} variantStyle="color" sizeStyle="lg" onClick={() => loginGo()}>로그인하기</Button>
        </div>
      </>
    )
  }

  if (isLogin === "true") {
    return (
      <>
        {modalOpen && (
          <Modal type="alert" closePortal={() => setModalOpen(false)}>
            <h5>추천 코드 등록이 완료되었습니다.</h5>
            <Button variantStyle="color" sizeStyle="lg" onClick={() => setModalOpen(false)}>확인</Button>
          </Modal>
        )}
        {QrCheck ? (
          <div className={styles.recommendCodeTop}>
            <h2>추천 코드 등록</h2>
            <Link className={styles.linkBtn + " " + styles.homeIcon} href="/"><HomeIcon /></Link>
            <Link className={styles.linkBtn} href="/user/myPage"><UserIcon color="var(--black-color-1)" /></Link>
          </div>
        ) : (
          <PageTop backPath="/user/myPage">추천 코드 등록</PageTop>
        )}
        <div className={styles.recommendCodeBox}>
          <h2>추천 코드</h2>
          <p>아래의 입력창에 추천 코드를 입력하고<br /> 등록 버튼을 눌러주세요.</p>
          <label htmlFor='recommendCode'>
            <input id="recommendCode" type="text" placeholder="추천 코드 입력" onChange={() => setInfoText("")} />
            {infoText !== "" && <p className={styles.infoText}>{infoText}</p>}
            <Button variantStyle="color" sizeStyle="lg" onClick={() => recommendCodeHandler()}>등록하기</Button>
          </label>
        </div>
      </>
    )
  }
}

RecommendCode.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
}