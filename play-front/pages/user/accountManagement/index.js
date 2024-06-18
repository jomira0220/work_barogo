import PageTop from "@/components/PageTop/PageTop";
import { useRouter } from "next/router";
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import Button from "@/components/Button/Button";
import styles from "./accountManagement.module.scss";
import { useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";
import Modal from "@/components/Modal/Modal";
import Link from 'next/link';
import { CheckEmail } from '@/utils/checkEmail';
import {
  EditNickName, UnmappingHandler, StringCountChange,
  EditEmail, SecessionHandler, ModifyOpenHandler,
  ReloadCloseCheck
} from '@/utils/accountManagement';



export default function AccountManagement(props) {

  const { isLogin, userDataAccount, brandCheck } = props;
  const router = useRouter();
  const [StringCount, setStringCount] = useState(0); // 수정 요청 아이디 입력 글자수
  const [NickNameEditOpen, SetNickNameEditOpen] = useState(false); // 닉네임 수정창 열기
  const [nameCheck, SetNameCheck] = useState([false, ""]); // 닉네임 수정시 안내문구 노출
  const [EmailEditOpen, SetEmailEditOpen] = useState(false); // 이메일 수정창 열기
  const [emailCheck, SetEmailCheck] = useState(""); // 이메일 수정시 안내문구 노출
  const [newUserData, setNewUserData] = useState(userDataAccount); // 유저 데이터
  const [alertModal, setAlertModal] = useState({ onoff: false, text: "" }); // 모달창



  // !로그아웃
  const SignOut = async () => {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    if (
      getCookie("accessToken") === undefined
      && getCookie("refreshToken") === undefined
    ) {
      location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/exit`;
    }
  };

  if (isLogin === "true")
    return (
      <>
        <PageTop backPath="/user/myPage">계정관리</PageTop>
        <div className={styles.accountManagementWarp}>
          <h3>계정정보</h3>
          <ul className={styles.info}>
            <li>
              <div className={styles.title}>아이디</div>
              <div>{newUserData.username}</div>
            </li>
            <li>
              <div className={styles.title}>닉네임</div>
              <div>
                <div className={styles.userNickName}>
                  {newUserData.nickname}
                </div>
                <Button
                  variantStyle="white"
                  sizeStyle="sm"
                  onClick={() => ModifyOpenHandler("nickName", NickNameEditOpen, SetNickNameEditOpen, SetNameCheck, setStringCount, SetEmailEditOpen, EmailEditOpen)}
                >
                  {NickNameEditOpen ? "취소" : "수정"}
                </Button>
              </div>
              {NickNameEditOpen && (
                <div className={styles.nickNameBox}>
                  <input
                    className={styles.nickNameInput}
                    name='nickname'
                    type="text"
                    placeholder="변경할 닉네임을 입력해주세요"
                    maxLength={20}
                    onChange={(e) => StringCountChange(e.target.value, SetNameCheck, setStringCount)}
                    defaultValue={""}
                  />
                  <div className={styles.nicknameCount}>{StringCount}/20</div>
                  <Button
                    variantStyle="color"
                    sizeStyle="sm"
                    onClick={() => EditNickName(nameCheck, newUserData.nickname, SetNameCheck, SetNickNameEditOpen, setNewUserData)}>확인</Button>
                </div>
              )}
              {nameCheck[0] && (
                <p className={styles.infoText}>{nameCheck[1]}</p>
              )}
            </li>
            <li>
              <div className={styles.title}>이메일</div>
              <div>
                {newUserData.email}
                <Button
                  variantStyle="white"
                  sizeStyle="sm"
                  onClick={() => ModifyOpenHandler(
                    "email", NickNameEditOpen, SetNickNameEditOpen,
                    SetNameCheck, setStringCount, SetEmailEditOpen, EmailEditOpen,
                    SetEmailCheck
                  )}
                >
                  {EmailEditOpen ? "취소" : "수정"}
                </Button>
              </div>
              {EmailEditOpen && (
                <div className={styles.emailBox}>
                  <input
                    className={styles.emailInput}
                    type="email"
                    name='email'
                    placeholder="변경할 이메일을 입력해주세요"
                    onChange={(e) => CheckEmail(e.target.value)}
                  />
                  <Button variantStyle="color" sizeStyle="sm" onClick={() => EditEmail(emailCheck, SetEmailCheck, EmailEditOpen)}>확인</Button>
                </div>
              )}
              {emailCheck && <p className={styles.infoText + (emailCheck === "사용 가능한 이메일입니다." ? " " + styles.success : "")}>{emailCheck}</p>}
            </li>
            <li>
              <div className={styles.title}>휴대폰번호</div>
              <div>
                {newUserData.phoneNumber ? (newUserData.phoneNumber) : (<p>번호를 등록해주세요</p>)}
                <form action={`${process.env.NEXT_PUBLIC_AUTH_URL}/cert`} method="post">
                  <input type="hidden" name="username" value={newUserData.username} />
                  <input type="hidden" name="retURL" value={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/changePhoneNumber`} />
                  <Button variantStyle="gray" sizeStyle="sm" type="submit">본인인증 후 수정</Button>
                </form>
              </div>
            </li>
          </ul>
          <h3 className={styles.riderInfoTitle}>연결된 라이더 정보</h3>
          <ul className={styles.info}>
            <li>
              <div className={styles.title}>라이더 코드</div>
              <div>
                {/* 모아라인은 라이더 코드 미노출 처리 */}
                {newUserData.riderCode
                  ? (
                    brandCheck === "MOALINE" ? "MOALINE" : newUserData.riderCode
                  ) : (
                    <p className={styles.riderCodeNone}>라이더 계정을 연동해주세요</p>
                  )}

                {/* 브랜드 연결 해제 버튼 */}
                <Button
                  variantStyle="white"
                  sizeStyle="sm"
                  onClick={() =>
                    newUserData.riderCode
                      ? setAlertModal({
                        onoff: true,
                        text: (
                          <>
                            <h5>라이더 계정 연동을 <br /> 해제하시겠습니까?</h5>
                            <div className={styles.buttonWarp}>
                              <Button className="closeBtn" variantStyle="color" sizeStyle="lg" onClick={() => UnmappingHandler(setAlertModal, setNewUserData)}>해제</Button>
                              <Button variantStyle="darkgray" sizeStyle="lg" onClick={() => setAlertModal({ onoff: false, text: "" })}>닫기</Button>
                            </div>
                          </>
                        ),
                      })
                      : router.push("/user/riderPhoneNumber")
                  }
                >
                  라이더 계정 연동 {newUserData.riderCode && "해제"}
                </Button>
              </div>
            </li>
            {/* <li>
              <div className={styles.title}>총판</div>
              <div>{newUserData.distributor}</div>
            </li>
            <li>
              <div className={styles.title}>허브</div>
              <div>{newUserData.hub}</div>
            </li>
            <li>
              <div className={styles.title}>지역</div>
              <div>{newUserData.region}</div>
            </li> */}
          </ul>
          <ul className={styles.buttonMenu}>
            <li><button onClick={() => SignOut()}>로그아웃</button></li>
            <li><Link href={`/login/changePassword_in?username=${newUserData.username}`}>비밀번호 변경</Link></li>
            <li onClick={() => SecessionHandler(setAlertModal)}><button>탈퇴하기</button></li>
          </ul>
        </div>
        {alertModal.onoff && (
          <Modal type="alert" closePortal={() => ReloadCloseCheck()}>{alertModal.text}</Modal>
        )}
      </>
    );
}

AccountManagement.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};


export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = await getToken(context);

  if (!accessToken || !refreshToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const userDataAccountRes = await serverSideGetApi(
    "/api/users/me/account",
    accessToken,
    refreshToken,
    context
  );
  const userDataAccount = (await userDataAccountRes.data) || null;

  return {
    props: {
      userDataAccount,
    },
  };
};
