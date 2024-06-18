import styles from "@/pages/member/memberList/memberList.module.scss";
import Layout from "@/components/Layout/Layout";
import Apis from "@/components/utils/Apis";
import { useState } from "react";
import { useRouter } from "next/router";
import { getToken, serverSideGetApi } from "@/components/utils/serverSideGetApi";
import { stringKrChange } from "@/components/utils/stringKrChange";
import Button from "@/components/Button/Button";
import BlockPopup from "@/components/BlockPopup";


export default function BlockMemberDetail(props) {
  const { userDetailData } = props;
  const router = useRouter();
  console.log(userDetailData);

  // 닉네임 변경
  const NickNameEdit = async () => {
    const nickName = document.querySelector("input[name=nickName]").value;
    const nickNameRes = await Apis.put(`/api/users/nickname?userId=${userDetailData.id}&nickname=${nickName}`);
    console.log(nickNameRes)
    if (nickNameRes.status === 200 && nickNameRes.data.status === "success") {
      alert("닉네임 변경이 완료되었습니다.")
      router.reload()
    } else {
      // 실패시 메시지 출력
      alert(nickNameRes.data.message)
    }
  }

  const [blockPopup, setBlockPopup] = useState({ onoff: false, userId: null, targetId: null, targetType: null })

  // 닉네임 변경 차단 버튼 클릭시 차단 사유 작성 팝업 노출
  const NickNameChangeBlock = (userId) => {
    console.log("유저 아이디", userId)
    setBlockPopup({ onoff: true, userId: userId, targetId: null, targetType: null })
  }

  // 닉네임 변경 차단 해제
  const NickNameUnBlockHandler = async (userId) => {
    const unblockRes = await Apis.post(`/api/users/unblock?userIds=${userId}&blockedType=NICKNAME`);
    console.log("닉네임 변경 차단 해제 api", unblockRes)

    if (unblockRes.status === 200 && unblockRes.data.status === "success") {
      alert("차단 해제가 완료되었습니다.")
      router.reload()
    } else {
      // 실패시 메시지 출력
      alert(unblockRes.data.message)
    }
  }

  // 탈퇴한 유저의 경우 탈퇴 해제 클릭시 실행
  const UnDelete = async () => {
    const unDeleteRes = await Apis.post(`/api/users/undelete/${userDetailData.id}`);
    console.log("탈퇴 처리 api", unDeleteRes)

    if (unDeleteRes.status === 200 && unDeleteRes.data.status === "success") {
      alert("탈퇴 해제가 완료되었습니다.")
      router.reload()
    } else {
      // 실패시 메시지 출력
      alert("탈퇴 해제 실패 / 사유: ", unDeleteRes.data.message)
    }
  }


  // COMMUNITY 차단 회원 해제
  const UnBlockHandler = async () => {
    const unblockRes = await Apis.post(`/api/users/unblock?userIds=${userDetailData.id}&blockedType=COMMUNITY`);
    console.log(unblockRes)
    if (unblockRes.status === 200 && unblockRes.data.status === "success") {
      alert("차단 해제가 완료되었습니다.")
      router.push("/member/blockManagement")
    } else {
      alert("차단 해제 실패 / 사유: ", unblockRes.data.message)
    }
  }

  return (
    <div className={styles.memberDetailWrap}>
      <div className="basicBox">
        {blockPopup.onoff && <BlockPopup blockPopup={blockPopup} setBlockPopup={setBlockPopup} />}
        <h2>차단 회원 상세</h2>
        <h3>기본정보</h3>
        <ul className={styles.infoList}>
          {Object.keys(userDetailData)
            .filter((item, index) => index <= 5)
            .map((title, index) => {
              let value = userDetailData[title];
              const titleKr = stringKrChange["memberListDetail"][title];
              const changeCount = userDetailData.userNicknameChangedCount; // !나중에 수정횟수 받아서 노출하기
              return (
                <li key={index}>
                  <span className={styles.itemTitle}>
                    {titleKr}
                  </span>
                  <span>
                    {
                      titleKr === "닉네임" ? (
                        <>
                          <div className={styles.nickNameChange}>
                            <input type="text" defaultValue={value} name="nickName" />
                            <Button variantStyle="color" sizeStyle="sm" onClick={() => NickNameEdit()}>닉네임 변경</Button>
                            <Button
                              variantStyle={userDetailData.nicknameBlocked ? "color2" : "darkgray"} sizeStyle="sm"
                              onClick={
                                () => {
                                  userDetailData.nicknameBlocked
                                    ? NickNameUnBlockHandler(userDetailData.id)
                                    : NickNameChangeBlock(userDetailData.id)
                                }
                              }
                            >닉네임 변경 차단 {userDetailData.nicknameBlocked && "해제"}</Button>
                          </div>
                          <p style={{ color: "red" }}>관리자 변경 횟수 : {changeCount}</p>
                        </>
                      ) :
                        !title.includes("ID") && value === "number"
                          ? value.toLocaleString("ko-KR")
                          : value === null ? "-" : value
                    }
                    {/* 탈퇴한 유저인 경우 탈퇴 해제 버튼 노출 */}
                    {titleKr === "탈퇴일" && value !== null && (
                      <Button variantStyle="color" sizeStyle="sm" onClick={() => UnDelete()}>탈퇴 해제</Button>
                    )}
                    {/*회원 상태에 따라서 차단 및 활성 기능 제공 */}
                    {titleKr === "회원상태" && value === "차단" && (
                      <Button
                        className={styles.memberBlockBtn}
                        variantStyle="color"
                        sizeStyle="sm"
                        // !!!! 밑에 팝업 노출 함수 변수 넣어주기!!!!!!!!!!!!!!!
                        onClick={() => UnBlockHandler()}
                      >
                        회원 차단 해제
                      </Button>
                    )}
                  </span>
                </li>
              );
            })}
        </ul>
      </div>

      <div className="basicBox">
        <h3>라이더 정보</h3>
        <ul className={styles.infoList}>
          {Object.keys(userDetailData)
            .filter((item, index) => 5 < index && index <= 10)
            .map((title, index) => {
              const value = userDetailData[title];
              return (
                <li key={index}>
                  <span className={styles.itemTitle}>
                    {stringKrChange["memberListDetail"][title]}
                  </span>
                  <span>
                    {
                      typeof value === "number"
                        ? value.toLocaleString("ko-KR")
                        : value === null ? "-" : value
                    }
                  </span>
                </li>
              );
            })}
        </ul>
      </div>

      <div className="basicBox">
        <h3>활동기록</h3>
        <ul className={styles.infoList}>
          {Object.keys(userDetailData)
            .filter((item, index) => 10 < index && index <= 19)
            .map((title, index) => {
              let value = userDetailData[title];
              return (
                <li key={index}>
                  <span className={styles.itemTitle}>
                    {stringKrChange["memberListDetail"][title]}
                  </span>
                  <span>
                    {typeof value === "number"
                      ? Number(value).toLocaleString("ko-KR")
                      : value === null ? "-" : value}
                  </span>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  )
}

BlockMemberDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const userDetailRes = await serverSideGetApi(`/api/users/${context.query.detailId}`, accessToken, refreshToken, context);
  const userDetailData = (await userDetailRes.data) || {};
  return {
    props: {
      userDetailData
    },
  };
}
