import Image from "next/image";
import styles from "./LeaderBoard.module.scss";
import RootLayout from "@/components/LayoutBox/RootLayout";
import { CheeringIcon, LineBasicArrow } from "@/components/Icon/Icon";
import Button from "@/components/Button/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { serverSideGetApi, getToken } from "@/utils/serverSideGetApi";
import Apis from "@/utils/Apis";
import { loginCheck } from "@/utils/loginCheck";
import Modal from "@/components/Modal/Modal";
import PaginationBox from "@/components/Pagination/PaginationBox";
import InfoDetailBtn from "@/components/InfoDetailBtn/InfoDetailBtn";
import SocialInfo from "@/components/SocialInfo/SocialInfo";

export default function LeaderBoard(props) {
  const router = useRouter();
  const {
    isLogin,
    userInfo,
    friendList: friendData,
    friendRequested,
  } = props;

  // !로그인 체크
  loginCheck(isLogin);

  console.log("소셜리더보드 데이터", props);

  // 친구 리스트 데이터
  const [friendList, setFriendList] = useState(friendData);
  const { number, totalElements, size } = friendList;

  // 안내 팝업
  const [infoOpen, setInfoOpen] = useState({ onoff: false, modalText: "" });

  // 안내 팝업 닫기
  const InfoClose = () => {
    setInfoOpen({ onoff: false, modalText: "" });
  };

  // !친구 클릭시 해당 친구 정보 보기
  const [friendInfo, setFriendInfo] = useState({
    onoff: false,
    info: "",
  });

  // !친구 리스트 데이터 새로 가져오기
  const FriendListRefresh = async () => {
    const friendListRes = await Apis.get("/api/friends");
    const friendListNewData = await friendListRes.data.data;
    setFriendList(friendListNewData);
  };


  useEffect(() => {
    // !친구 응원 버튼 이벤트
    const CheeringEvent = async (friendId) => {
      const cheeringCheck = friendList.content.filter((item) => String(item.userId) === String(friendId))[0].userLikeInThisMonth // 응원여부 확인용 - false일때만 응원가능
      if (cheeringCheck === false) { // 응원이 가능할때만 응원하기
        const cheeringPost = await Apis.post(`/api/userlike/${friendId}`);
        if (cheeringPost.status === 200 && cheeringPost.data.message === "") {
          // 응원 성공
          setInfoOpen({
            onoff: true, modalText: (
              <>
                <h3>응원이 완료되었습니다.</h3>
                <Button sizeStyle="lg" onClick={() => InfoClose()}>닫기</Button>
              </>
            ),
          });
          FriendListRefresh(); // 친구 목록 다시 가져오기
        } else {
          // 응원 실패
          setInfoOpen({
            onoff: true, modalText: (
              <>
                <h3>{cheeringPost.data.message}</h3>
                <Button sizeStyle="lg" onClick={() => InfoClose()}>닫기</Button>
              </>
            )
          });
        }
      }
    };
    if (typeof window !== "undefined") {
      const cheeringBtn = document.querySelectorAll(`.${styles.cheeringBtn}:not(.${styles.on})`); // 응원이 안된 버튼만 이벤트
      cheeringBtn.forEach((item) => {
        item.addEventListener("click", (e) => {
          const friendId = e.currentTarget.dataset.friendid;
          CheeringEvent(friendId);
        }, { once: true });
      });

      const cheeringOnBtn = document.querySelectorAll(`.${styles.cheeringBtn}.${styles.on}`); // 응원이 된 버튼은 클릭시 안내
      cheeringOnBtn.forEach((item) => {
        item.addEventListener("click", (e) => {
          setInfoOpen({
            onoff: true, modalText: (
              <>
                <h3>이번 달 응원이 이미 완료된 상태입니다.</h3>
                <Button sizeStyle="lg" onClick={() => InfoClose()}>닫기</Button>
              </>
            )
          });
        });
      })
    }
  }, [friendList]);

  // !친구 삭제
  const FriendDel = (friendId, friendNickName) => {
    // console.log("친구 삭제", friendId, friendNickName);
    setInfoOpen({
      onoff: true, modalText: (
        <>
          <h3>정말로 {friendNickName}님을 친구에서<br />삭제하시겠습니까?</h3>
          <div className={styles.buttonBox}>
            <Button sizeStyle="lg" onClick={() => DelAlert("remove", friendId, friendNickName)}>삭제</Button>
            <Button sizeStyle="lg" variantStyle="gray" onClick={() => DelAlert("cancel", friendId, friendNickName)}>취소</Button>
          </div>
        </>
      ),
    });
  };

  // !친구 삭제 확인 팝업
  const DelAlert = async (type, friendId, friendNickName) => {
    if (type === "remove") {
      const friendDelRes = await Apis.delete(`/api/friends/${friendId}`);
      const friendDelData = await friendDelRes.data;
      if (friendDelData.status === "success") {
        setInfoOpen({
          onoff: true, modalText: (
            <>
              <h3>{friendNickName}님을 친구에서<br />삭제하였습니다.</h3>
              <Button sizeStyle="lg" onClick={() => InfoClose()}>닫기</Button>
            </>
          ),
        });

        FriendListRefresh(); // 친구 목록 다시 가져오기
      } else {
        setInfoOpen({ onoff: true, modalText: friendDelData.message });
      }
    } else {
      setInfoOpen({
        onoff: false,
        modalText: "",
      });
    }
  };


  // !친구 리스트에서 친구 클릭시 해당 친구 정보 보기
  const FriendInfoViewEvent = async (friendId, type) => {

    if (type === "me") {
      // !내 정보 가져오기
      const myRepresentedBadgeRes = await Apis.get(`/api/badges/represented?page=0&size=4`); // 대표뱃지데이터 가져오기
      const myRepresentedBadgeData = await myRepresentedBadgeRes.data.data.content;
      const myInfo = {
        userId: userInfo.userId,
        nickname: userInfo.nickname,
        userLevelGrade: userInfo.userLevelGrade,
        userLevelName: userInfo.userLevelName,
        representedBadgeList: myRepresentedBadgeData,
        userLikeCount: userInfo.userLikeCount,
        badgeAchievementCount: userInfo.badgeCount,
        seasonRanking: userInfo.seasonRanking,
      };
      setFriendInfo({ onoff: true, info: myInfo, });
    } else {
      // !클릭한 친구 정보 가져오기
      const friendInfoRes = await Apis.get(`/api/users/${friendId}`);
      console.log("클릭한 친구 정보 ", friendInfoRes)
      if (friendInfoRes.status === 200 && friendInfoRes.data.status === "success") {
        const friendInfoData = await friendInfoRes.data.data;
        setFriendInfo({ onoff: true, info: friendInfoData, });
      } else {
        setInfoOpen({ onoff: true, modalText: "해당 유저의 정보를 불러올 수 없습니다. 사유 : " + friendInfoRes.data.message });
      }
    }

  };

  if (isLogin === "true") {
    return (
      <div className={styles.socialWarp}>
        <div className={styles.mySocialInfo}>
          <div className={styles.titleInfo}>
            <h3 className={styles.title}>
              나의 소셜 정보
              <Button variantStyle="color2" sizeStyle="xs" className={styles.friendSetBtn} onClick={() => router.push("/social/friendRequest")}>
                친구 요청{" "}
                {friendRequested.length > 0 && (friendRequested.length).toLocaleString("ko-KR") + "건"}
                <LineBasicArrow color="var(--play-color-1)" width="7" height="10" />
              </Button>
            </h3>

            <div className={styles.infoBtn}>
              <InfoDetailBtn className={styles.infoBtn}>
                <h5>소셜 리더보드란?</h5>
                <b>
                  다른 라이더와 친구를 맺고<br /> 이번 달 수행기록을 공유해보세요!
                  <br /> ‘응원하기’를 눌러 친구에게 한 달에 한 번 1Exp를<br /> 선물할 수 있습니다.<br />
                </b>
              </InfoDetailBtn>
            </div>
          </div>

          <div className={styles.socialInfoBox}>
            {/* 나의 소셜 정보 - 클릭시 팝업형태로 내 정보도 보이도록*/}
            <div className={styles.nickName} onClick={() => FriendInfoViewEvent(userInfo.userId, "me")}>
              <Image
                className={styles.levelImg}
                src={`/images/level/${userInfo.userLevelGrade ? userInfo.userLevelGrade : "D1"}.png`}
                alt={userInfo.userLevelGrade ? userInfo.userLevelGrade : "레벨없음"}
                width={50}
                height={50}
                priority={true}
              />
              <span className="blind">닉네임</span>
              {userInfo.nickname}
            </div>
            <div>
              <div className={styles.countTitle}>누적 응원</div>
              <span className={styles.performCount}>
                {userInfo.userLikeCount ? Number(userInfo.userLikeCount) : 0}건
              </span>
            </div>

            <div>
              <div className={styles.countTitle}>월간 수행건수</div>
              <span className={styles.performCount}>
                {userInfo.deliveryCountInThisMonth ? Number(userInfo.deliveryCountInThisMonth) : 0}건
              </span>
            </div>
          </div>
        </div>

        {/* 친구 목록 */}
        {friendList.totalElements === 0 ? (
          <div className={styles.empty_text}>
            <p>
              현재 등록된 친구가 없습니다<br />
              <span><b>새로운 친구</b>를 추가해보세요!</span>
            </p>
            <Button
              variantStyle="color"
              className={styles.addFriend}
              onClick={() => router.push("/social/friendRequest")}
            >
              새로운 친구 추가
            </Button>
          </div>
        ) : (
          friendList.length !== 0 && ( // 친구 목록이 있을때만 렌더링
            <div className={styles.friendListWarp}>
              <h3 className={styles.title}>
                나의 친구 목록 <span>{friendList.totalElements}</span>
              </h3>
              <div className={styles.friendListInner}>
                <div className={styles.tableTop}>
                  <span>라이더 닉네임</span>
                  <span>월간 수행건수</span>
                  <span>응원</span>
                </div>
                <ul className={styles.socialList}>
                  {friendList.content.map((item, index) => {
                    // console.log("친구목록 친구정보", item);
                    return (
                      <li key={index}>
                        <div className={styles.inner}>
                          <div
                            className={styles.nickName}
                            onClick={() => FriendInfoViewEvent(item.userId)}
                          >
                            <Image
                              className={styles.levelImg}
                              src={`/images/level/${item.userLevelGrade ? item.userLevelGrade : "D1"}.png`}
                              alt={`레벨 ${item.userLevelGrade ? item.userLevelGrade : "D1"}`}
                              width={50}
                              height={50}
                              priority={true}
                            />
                            <span className="blind">닉네임</span>
                            {item.nickname}
                          </div>
                          <span
                            className={styles.performCount}
                            onClick={() => FriendInfoViewEvent(item.userId)}
                          >
                            <span className="blind">이번달 수행건수</span>
                            {item.deliveryCountInThisMonth ? item.deliveryCountInThisMonth : 0}건
                          </span>
                          <span>
                            <button
                              data-friendid={item.userId}
                              className={
                                styles.cheeringBtn +
                                (item.userLikeInThisMonth
                                  ? ` ${styles.on}`
                                  : "")
                              }
                            >
                              <span className="blind">응원하기</span>
                              <CheeringIcon color="var(--play-color-1)"></CheeringIcon>
                            </button>
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <PaginationBox
                pagePath={router.asPath}
                activePage={Number(number) + 1}
                itemsCountPerPage={size}
                totalItemsCount={totalElements}
                pageRangeDisplayed={5}
              />
            </div>
          )
        )}

        {/* 친구 클릭시 친구 정보 및 내 정보 안내 팝업 */}
        <SocialInfo
          friendInfo={friendInfo}
          setFriendInfo={setFriendInfo}
          userInfo={userInfo}
          FriendDel={FriendDel}
        />

        {/* 이벤트 관련 안내 팝업 - 응원 완료 & 취소 안내 & 친구 삭제 완료 안내 */}
        {
          infoOpen.onoff && (
            <Modal type="alert" closePortal={() => InfoClose()} className={styles.modal}>
              {infoOpen.modalText}
            </Modal>
          )
        }
      </div >
    );
  }

}

LeaderBoard.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);

  const userInfoRes = await serverSideGetApi("/api/users/me/info", accessToken, refreshToken, context);
  const userInfo = (await userInfoRes.data) || null;

  const friendListRes = await serverSideGetApi("/api/friends", accessToken, refreshToken, context);
  const friendList = (await friendListRes.data) || [];
  // console.log("friendList", friendList);

  const friendRequestedRes = await serverSideGetApi("/api/friends/requested", accessToken, refreshToken, context);
  const friendRequested = (await friendRequestedRes.data) || [];

  return {
    props: {
      friendList,
      friendRequested,
      userInfo,
    },
  };
};
