import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function BlockBoardPop(props) {

  const { isLogin } = props;
  const router = useRouter();
  const [riderSetPop, setRiderSetPop] = useState(false);

  useEffect(() => {
    // 권한이 없는 게시글 접근시 팝업 노출
    router.query.blockDetailId && setRiderSetPop(true);
  }, [router.query.blockDetailId]);

  const BlockLinkBtn = (isLogin) => {
    isLogin === "true" ? router.push("/user/riderPhoneNumber") : router.push("/login")
    setRiderSetPop(false)
  }

  if (!riderSetPop) return null;
  return (
    <Modal type="alert" closePortal={() => setRiderSetPop(false)}>
      <h5>{isLogin === "true" ? <>라이더 계정 연동 후<br /> 게시글 확인이 가능합니다.</> : <>로그인 후 게시글 확인이<br /> 가능합니다.</>}</h5>
      <div className="buttonWrap">
        <Button variantStyle="darkgray" sizeStyle="lg" onClick={() => setRiderSetPop(false)}>닫기</Button>
        <Button variantStyle="color" sizeStyle="lg" onClick={() => BlockLinkBtn(isLogin)}>
          {isLogin === "true" ? "라이더 계정 연동" : "로그인"}
        </Button>
      </div>
    </Modal>
  )
}