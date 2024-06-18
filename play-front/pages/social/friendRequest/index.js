import PageTop from "@/components/PageTop/PageTop";
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import styles from "./friendRequest.module.scss";
import Image from "next/image";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import { useState } from "react";
import { serverSideGetApi, getToken } from "@/utils/serverSideGetApi";
import Apis from "@/utils/Apis";
import { CopyIcon, AddFriendIcon } from "@/components/Icon/Icon";
import { loginCheck } from "@/utils/loginCheck";

export default function FriendRequest(props) {
  const { isLogin, userData, friendRequested: friendData } = props;
  const [friendRequested, setFriendRequested] = useState(friendData);
  const [StringCount, setStringCount] = useState(0); // 검색 아이디 입력 글자수
  const [FriendModal, FriendModalSet] = useState({ onoff: false, modalText: [""] }); // 모달 상태

  loginCheck(isLogin);

  console.log("친구 요청 데이터", friendData)

  // !친구 요청 Api 호출
  const AddFriendBtn = async () => {

    const searchType = document.querySelector(`.${styles.selectSearch}`).value; // searchType - 검색할 타입
    const searchId = document.querySelector(`.${styles.searchInput} input`).value; // searchId - 검색할 아이디 혹은 닉네임

    if (searchId === "") {
      // 아이디 입력 안했을때
      FriendModalSet({
        onoff: true,
        modalText: <>
          <h3>아이디를 입력해주세요.</h3>
          <Button variantStyle="color" sizeStyle="lg" onClick={() => ClosePortal()}>닫기</Button>
        </>
      });
      return;
    } else if (searchId === userData.username) {
      // 자기 자신 아이디 입력했을때
      FriendModalSet({
        onoff: true,
        modalText: <>
          <h3>자기 자신은 친구로<br />등록할 수 없습니다.</h3>
          <Button variantStyle="color" sizeStyle="lg" onClick={() => ClosePortal()}>닫기</Button>
        </>
      });
    } else {

      // !친구 요청 api 호출
      const addFriendRes = await Apis.post(`/api/friends`, { searchType: searchType, name: searchId });
      console.log("친구 요청", addFriendRes);

      if (addFriendRes.status === 200 && addFriendRes.data.status === "success") {
        // 친구 요청 성공
        FriendModalSet({
          onoff: true,
          modalText: <>
            <h3>친구 요청을 완료하였습니다.</h3>
            <Button variantStyle="color" sizeStyle="lg" onClick={() => ClosePortal()}>닫기</Button>
          </>
        });
      } else {
        // 친구 요청 실패
        FriendModalSet({
          onoff: true,
          modalText: <>
            <h3>{addFriendRes.data.message}</h3>
            <Button variantStyle="color" sizeStyle="lg" onClick={() => ClosePortal()}>닫기</Button>
          </>
        });
      }

    };
  };

  // !검색 아이디 입력 글자수 변경
  const StringCountChange = (e) => {
    setStringCount(e.target.value.length);
  };

  // !모달 닫기
  const ClosePortal = () => {
    FriendModalSet({ onoff: false, modalText: [""] });
  };

  // !아이디 클립보드 복사
  const HandleCopyClipBoard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("복사 완료");
    } catch (error) {
      alert("복사 실패!");
    }
  };

  // !친구 수락 혹은 거절
  const FriendSubmit = async (type, friendId, nickname) => {
    if (type === "deny") {
      // !친구 요청 거절
      const FriendDeny = async () => {
        const DenyRes = await Apis.delete(`/api/friends/${friendId}/${type}`)
        if (DenyRes.status === 200 && DenyRes.data.status === "success") {
          FriendModalSet({
            onoff: true,
            modalText: <>
              <h3>{nickname}님의 친구 요청을<br />거절하였습니다.</h3>
              <Button variantStyle="color" sizeStyle="lg" onClick={() => ClosePortal()}>닫기</Button>
            </>
          });
          // 친구 요청 목록 다시 불러오기
          const newRequestedRes = await Apis.get("/api/friends/requested");
          setFriendRequested(newRequestedRes.data.data || []);
        } else {
          FriendModalSet({
            onoff: true,
            modalText: <>
              <h3>{delRes.data.message}</h3>
              <Button variantStyle="color" sizeStyle="lg" onClick={() => ClosePortal()}>닫기</Button>
            </>
          });
        }
      }
      //친구 요청 거절 팝업 안내
      FriendModalSet({
        onoff: true,
        modalText: <>
          <h3>{nickname}님의 친구 요청을<br />정말로 거절하시겠습니까?</h3>
          <div className='buttonWrap'>
            <Button variantStyle="color" sizeStyle="lg" onClick={() => FriendDeny()}>거절</Button>
            <Button variantStyle="darkgray" sizeStyle="lg" onClick={() => ClosePortal()}>닫기</Button>
          </div>
        </>,
      });

    } else {
      // !친구 요청 수락
      const FriendApprove = await Apis.post(`/api/friends/${friendId}/${type}`)
      if (FriendApprove.status === 200 && FriendApprove.data.status === "success") {
        // 친구 수락 성공
        FriendModalSet({
          onoff: true,
          modalText: <>
            <h3>{nickname}님과 친구가 되었습니다.</h3>
            <Button variantStyle="color" sizeStyle="lg" onClick={() => ClosePortal()}>닫기</Button>
          </>
        });

        // 친구 요청 목록 리프레시
        const newRequestedRes = await Apis.get("/api/friends/requested");
        setFriendRequested(newRequestedRes.data.data || []);

      } else {
        // 친구 수락 실패
        FriendModalSet({
          onoff: true,
          modalText: <>
            <h3>{FriendRes.data.message}</h3>
            <Button variantStyle="color" sizeStyle="lg" onClick={() => ClosePortal()}>닫기</Button>
          </>
        });
      }
    }
  };

  if (isLogin === "true")
    return (
      <>
        {FriendModal.onoff && (
          <Modal type="alert" closePortal={() => ClosePortal()}>
            {FriendModal.modalText}
          </Modal>
        )}
        <PageTop>친구 요청</PageTop>
        <div className={styles.friendRequestedWarp}>
          <div className={styles.searchBox}>
            <div className={styles.idSearch}>
              <div className={styles.searchInput}>
                <select className={styles.selectSearch} defaultValue="USERNAME">
                  <option value="USERNAME">아이디</option>
                  <option value="NICKNAME">닉네임</option>
                </select>
                <input
                  type="text"
                  placeholder="친구 아이디 입력"
                  maxLength={20}
                  onChange={(e) => StringCountChange(e)}
                  name="addFriendId"
                />
                <div className={styles.stringCount}>{StringCount}/20</div>
              </div>
              <button
                className={styles.userFriendReq}
                onClick={() => AddFriendBtn()}
              ><span className="blind">친구요청</span>
                <AddFriendIcon />
              </button>
            </div>

            <div>
              <button
                className={styles.myId}
                onClick={() => HandleCopyClipBoard(userData.username)}
              >
                내 아이디 <span>{userData.username} <CopyIcon /></span>
              </button>
              <button
                className={styles.myId}
                onClick={() => HandleCopyClipBoard(userData.nickname)}
              >
                내 닉네임 <span>{userData.nickname} <CopyIcon /></span>
              </button>
            </div>
          </div>

          <div className={styles.friendList}>
            <h3>친구 요청 목록</h3>

            {friendRequested.length === 0 ? (
              <p className={styles.emptyText}>친구를 요청한 사람이 없습니다.</p>
            ) : (
              <ul>
                {friendRequested.map((item, index) => {
                  console.log("친구요청목록 친구정보", item);
                  return (
                    <li key={item.id}>
                      <span>
                        <Image
                          src={`/images/level/${item.userLevelGrade ? item.userLevelGrade : "D1"}.png`}
                          alt={item.userLevelGrade ? item.userLevelGrade : "레벨없음"}
                          width={40}
                          height={40}
                        />
                        {item.nickname}
                      </span>
                      <span>
                        <Button
                          variantStyle="color"
                          sizeStyle="xs"
                          onClick={() => FriendSubmit("approve", item.userId, item.nickname)}>
                          수락
                        </Button>
                        <Button
                          variantStyle="gray"
                          sizeStyle="xs"
                          onClick={() => FriendSubmit("deny", item.userId, item.nickname)}>
                          거절
                        </Button>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </>
    );
}

FriendRequest.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);

  const userDataRes = await serverSideGetApi("/api/users/me/account", accessToken, refreshToken, context);
  const userData = (await userDataRes.data) || {};

  const friendRequestedRes = await serverSideGetApi("/api/friends/requested", accessToken, refreshToken, context);
  const friendRequested = (await friendRequestedRes.data) || [];

  return {
    props: {
      friendRequested,
      userData,
    },
  };
};
