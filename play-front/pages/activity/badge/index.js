import RootLayout from "@/components/LayoutBox/RootLayout";
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";
import Modal from "@/components/Modal/Modal";
import BadgeModal from "@/components/BadgeModal/BadgeModal";
import Button from "@/components/Button/Button";
import { useEffect, useState } from "react";
import styles from "./Badge.module.scss";
import styled from "styled-components";
import PaginationBox from "@/components/Pagination/PaginationBox";
import { useRouter } from "next/router";
import Apis from "@/utils/Apis";
import InfoDetailBtn from "@/components/InfoDetailBtn/InfoDetailBtn";
import RiderCodeNull from '@/components/RiderCodeNull';
import { GearIcon } from "@/components/Icon/Icon";

// 배지 이미지 스타일
// 배지 팝업 모달에 연결되어있음
export const BadgeImg = styled.span`
  display: block;
  width: 100%;
  height: 100%;
  background-image: ${(props) => {
    return `url("${props.$badgeImgUrl}")`;
  }};
  background-size: 95%;
  background-position: center;
  background-repeat: no-repeat;
  // 팝업에서는 배지 이미지 확대 처리
  &.popStyle {
    width: 90px;
    height: 90px;
    background-size: 100%;
    margin-bottom: var(--space-1);
  }
`;

export default function Badge(props) {


  const router = useRouter();
  const {
    isLogin,
    AchievementData: Achievement,
    ProgressingData: Progressing,
    FutureData,
    RepresentedData: Represented,
    brandCheck,
  } = props;

  console.log("배지 페이지", props)


  const [AchievementData, setAchievementData] = useState(Achievement); // 달성배지
  const [RepresentedData, setRepresentedData] = useState(Represented); // 대표배지
  const [ProgressingData, setProgressingData] = useState(Progressing); // 달성중인 배지

  useEffect(() => {
    setAchievementData(Achievement);
    setRepresentedData(Represented);
    setProgressingData(Progressing);
  }, [Achievement, Represented, Progressing]);

  // 배지 정보 팝업
  // {
  // onoff: 팝업노출여부,
  // badgeId: 배지아이디코드(고유값),
  // status:배지 상태는 아래와 같다.
  //   represented - 대표 배지인 경우
  //   Achievement - 달성 배지인 경우
  //   Received - 달성중인 배지 (달성 완료하여 보상 수령 대기 상태)
  //   Progressing - 달성중인 배지 (달성 진행중인 상태)
  //   Future - 오픈 예정 배지
  // }

  // 배지 정보 팝업
  const [modalBadgeCode, setModalBadgeCode] = useState({
    onoff: false,
    badgeId: 1,
    status: "Future",
  });

  //대표배지 설정 안내 모달 오픈
  const [infoModalOpen, infoModalOpenSet] = useState({
    onoff: false,
    title: [],
  });

  // 대표배지 설정 버튼 이벤트 토글 처리용
  const [RepresentedEvent, setRepresentedEvent] = useState(false);

  // 클릭한 배지 정보 저장용
  const [badgeContent, setBadgeContent] = useState({});

  // !클릭한 배지 정보 가져오기
  const BadgeDataGet = async (badgeId, status, AchievementData, ProgressingData) => {

    const apiStatus = status === "Received" ? "progressing" : status.toLowerCase();

    const badgeRes = await Apis.get(`/api/badges/${apiStatus}`);
    const badgeData = await badgeRes.data.data;
    const badgeItemData = badgeData.content.filter((item) => item.id === badgeId).map((item) => item);

    setBadgeContent(badgeItemData[0]); // 배지 정보 업데이트

    if (status === "Received") {
      // 달성완료 표시 배지 (달성 완료하여 보상 수령 대기 상태)
      const badgePost = await Apis.post(`/api/badges/${badgeId}/received`);
      const badgePostData = await badgePost.data;

      if (badgePostData.status === "error") {
        console.log("배지 획득 실패", badgePostData.message);
        alert("배지 획득에 실패했습니다. 사유: " + badgePostData.message);
      } else {
        console.log("배지 획득 성공", badgePostData);

        // 달성 배지 목록 리프레시
        const achievementNewData = await Apis.get(`/api/badges/achievement?page=${AchievementData.number}&size=${AchievementData.size}`);
        setAchievementData(await achievementNewData.data.data);

        // 달성중인 배지 목록 리프레시
        const progressingNewData = await Apis.get(`/api/badges/progressing?page=${ProgressingData.number}&size=${ProgressingData.size}`);
        setProgressingData(await progressingNewData.data.data);

        // 팝업 모달 오픈
        infoModalOpenSet({
          onoff: true,
          title: (
            <p className={styles.receivedText}>
              배지 달성 보상으로<br />
              <b>{Number(badgeItemData[0].point).toLocaleString("ko-kr")}Exp</b>를 받았습니다.
            </p>
          )
        });
      }

    } else {
      // 배지 정보 팝업 오픈 - 달성완료배지 제외
      setModalBadgeCode({ onoff: true, badgeId: badgeId, status: status });
    }
  };


  // !배지 정보 팝업 클로즈
  const HandleClose = (modalBadgeCode, setModalBadgeCode) => {
    setModalBadgeCode({
      onoff: false,
      badgeId: modalBadgeCode.badgeId,
      status: modalBadgeCode.status,
    });
  };

  // !대표 배지 설정 관련 안내 팝업 클로즈
  const InfoModalCloseEvent = () => {
    infoModalOpenSet({ onoff: false, title: [] });
  };

  // !대표배지가 3개이하인 경우 빈배지 생성
  const EmptyBadge = (RepresentedData) => {
    const emptyBadgeList = [];
    for (let i = 0; i < 4 - RepresentedData.length; i++) {
      emptyBadgeList.push(
        <li key={i}>
          <div className={styles.emptyBadge}>
            <span className="blind">대표 배지 미설정</span>
          </div>
        </li>
      );
    }
    return emptyBadgeList;
  };

  // !대표배지 설정하기 버튼 클릭시 이벤트
  const MainBadgeSet = (AchievementData, RepresentedEvent, infoModalOpenSet, setRepresentedEvent) => {
    if (AchievementData.totalElements === 0) {
      // 달성 완료된 배지가 없는 경우 (대표배지로 설정 가능한 배지가 없는 경우)
      infoModalOpenSet({
        onoff: true,
        title: <h3>달성한 배지가 없습니다.</h3>,
      });
    } else {
      if (!RepresentedEvent) {
        // 달성 완료된 배지가 있는 경우
        infoModalOpenSet({
          onoff: true,
          title: [
            <p key={0}>
              달성 배지 목록에서 최대 4개의
              <br />
              <b>
                배지를 선택하면 <span>대표 배지로 설정</span>
              </b>
              됩니다.
            </p>,
          ],
        });
      }
      setRepresentedEvent(!RepresentedEvent);
    }
  };

  // !대표 배지 설정 또는 해제하기 API
  const MainBadgeControlApi = async (type, badgeId, AchievementData) => {
    const badge = type === "delete" ? await Apis.delete(`/api/badges/${badgeId}/represented`) : await Apis.put(`/api/badges/${badgeId}/represented`);
    const badgeData = await badge.data;
    if (badgeData.status === "error") {
      infoModalOpenSet({ onoff: true, title: [badgePut.data.message] });
    } else {
      console.log(`대표배지 ${type === "delete" ? "해제" : "설정"} 완료`);

      // 대표배지 목록 리프레시
      const representedNewData = await Apis.get(`/api/badges/represented`);
      setRepresentedData(representedNewData.data.data);
      // 달성배지 목록 리프레시
      const achievementNewData = await Apis.get(`/api/badges/achievement?page=${AchievementData.number}&size=${AchievementData.size}`);
      setAchievementData(achievementNewData.data.data);
    }
  };

  // !달성배지 영역에서 대표배지 설정하기 상태로 버튼 클릭시 이벤트
  const RepresentedBadgeSet = (badgeId, mainBadgeCheck) => {
    console.log("배지아이디", badgeId, "대표배지여부", mainBadgeCheck);

    if (mainBadgeCheck) {
      // 클릭한 배지가 이미 대표배지인 경우 - 대표배지 해제
      MainBadgeControlApi("delete", badgeId, AchievementData);
    } else {
      // 클릭한 배지가 대표배지가 아닌 경우 - 대표배지 설정
      if (RepresentedData.length >= 4) {
        // 이미 대표배지가 4개인 경우
        infoModalOpenSet({
          onoff: true,
          title: <>
            대표 배지는<b>최대 4개까지<br /> 설정</b>이 가능합니다.<br />
            기존 대표 배지를 해제 후 새로운 대표배지를 선택해주세요.
          </>,
        });
      } else {
        MainBadgeControlApi("set", badgeId, AchievementData);
      }
    }
  };

  if (isLogin === "true" && brandCheck) {
    return (
      <>
        {modalBadgeCode.onoff && ( // 배지 정보 안내 팝업
          <Modal closePortal={() => HandleClose(modalBadgeCode, setModalBadgeCode)}>
            <BadgeModal
              boxTitle={modalBadgeCode.status}
              badgeContent={badgeContent}
              handleClose={() => HandleClose(modalBadgeCode, setModalBadgeCode)}
            />
          </Modal>
        )}
        {infoModalOpen.onoff && ( // 대표 배지 설정 최대 4개 안내 팝업
          <Modal type="alert" closePortal={() => InfoModalCloseEvent(infoModalOpenSet)}>
            <p>{infoModalOpen.title}</p>
            <Button
              variantStyle="color"
              sizeStyle="lg"
              onClick={() => InfoModalCloseEvent(infoModalOpenSet)}
            >
              닫기
            </Button>
          </Modal>
        )}
        {/* 대표 배지 */}
        <div id={styles.mainBadge} className={styles.badgeBox}>
          <div className={styles.title}>
            <h3>대표 배지</h3>
            <InfoDetailBtn color="var(--play-color-1)" className={styles.infoBtn}>
              <h5>배지란?</h5>
              <b>
                배지를 획득하고 친구들에게 자랑해보세요!<br />
                배지가 요구하는 조건의 배달을 수행하면,<br />
                배지와 경험치를 보상으로 받습니다.
              </b>
            </InfoDetailBtn>
          </div>
          {RepresentedData.totalElements === 0 ? (
            <p className={styles.empty}>
              달성 배지 목록에서 대표 배지를 설정해주세요
            </p>
          ) : (
            <ul className={styles.badgeList}>
              {RepresentedData.content.map((item, index) => {
                return (
                  <li
                    code={item.id}
                    key={index}
                    onClick={() => BadgeDataGet(item.id, "represented", AchievementData, ProgressingData)}
                  >
                    <BadgeImg $badgeImgUrl={item.image} />
                    <span className="blind">{item.name}</span>
                  </li>
                );
              })}
              {/* 대표배지가 3개이하인 경우 빈 박스 노출 처리용 */}
              {EmptyBadge(RepresentedData)}
            </ul>
          )}
        </div>
        {/* 달성 배지 */}
        <div id={styles.attainmentBadge} className={styles.badgeBox}>
          <div className={styles.title}>
            <h3>
              달성 배지
              <span className={styles.count}>
                {AchievementData.totalElements}
              </span>
              <Button
                className={!RepresentedEvent ? "" : styles.on}
                sizeStyle="xs"
                variantStyle="color"
                onClick={() => MainBadgeSet(AchievementData, RepresentedEvent, infoModalOpenSet, setRepresentedEvent)}
              >
                {!RepresentedEvent ? "배지 설정" : "설정 완료"}
                <GearIcon color={!RepresentedEvent ? "var(--white-color-1)" : "var(--play-color-1)"} />
              </Button>
            </h3>
            <div className={styles.buttonBox}>
              <PaginationBox
                activePage={Number(AchievementData.number) + 1}
                itemsCountPerPage={AchievementData.size}
                totalItemsCount={AchievementData.totalElements}
                pageRangeDisplayed={-1}
                pageType="achievementPage"
              // onChange={(page) => setAchievementPage(page)}
              />
            </div>
          </div>
          {AchievementData.totalElements === 0 ? (
            <p className={styles.empty}>달성한 배지가 없습니다.</p>
          ) : (
            <ul className={styles.badgeList}>
              {AchievementData.content.map((item, index) => {
                //달성 완료된 배지 중 대표배지인 경우 판단
                let mainBadgeCheck = false;
                let mainBadgeNum = -1;
                for (var i = 0; i < RepresentedData.content.length; i++) {
                  if (RepresentedData.content[i].id === item.id) {
                    mainBadgeCheck = true;
                    mainBadgeNum = i + 1;
                    break;
                  } else {
                    mainBadgeCheck = false;
                  }
                }
                return (
                  <li
                    code={item.id}
                    key={index}
                    data-status={RepresentedEvent ? "RepresentedEvent" : ""}
                    className={mainBadgeCheck ? styles.on : ""}
                    onClick={() => {
                      RepresentedEvent // 대표배지 설정하기 상태인 경우, 대표배지 설정 이벤트 실행
                        ? RepresentedBadgeSet(item.id, mainBadgeCheck)
                        : mainBadgeCheck // 대표배지 설정하기 상태가 아닌 경우, 배지 타입에 따른 팝업 오픈
                          ? BadgeDataGet(item.id, "represented", AchievementData, ProgressingData)
                          : BadgeDataGet(item.id, "Achievement", AchievementData, ProgressingData);
                    }}
                  >
                    <BadgeImg $badgeImgUrl={item.image} />
                    <span className="blind">{item.name}</span>
                    {mainBadgeCheck && (
                      <span className={styles.mainBadgeNum}>
                        {mainBadgeNum}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {/* 달성중인 배지 */}
        <div id={styles.unattainedBadge} className={styles.badgeBox}>
          <div className={styles.title}>
            <h3>
              달성중인 배지
              <span className={styles.count}>
                {ProgressingData.totalElements}
              </span>
            </h3>
            <div className={styles.buttonBox}>
              <PaginationBox
                pagePath={router.asPath}
                activePage={Number(ProgressingData.number) + 1}
                itemsCountPerPage={ProgressingData.size}
                totalItemsCount={ProgressingData.totalElements}
                pageRangeDisplayed={-1}
                pageType="progressingPage"
              // onChange={(page) => setProgressingPage(page)}
              />
            </div>
          </div>
          {ProgressingData.totalElements === 0 ? (
            <p className={styles.empty}>달성중인 배지가 없습니다.</p>
          ) : (
            <ul className={styles.badgeList}>
              {ProgressingData.content.map((item, index) => {
                // 달성중인 배지 영역에서 달성 완료된 배지이면서 보상 수령 전인 배지 판단
                const AttainmentCheck = (item.acquireDate !== null && item.received === false) ? true : false;
                return (
                  <li
                    code={item.id}
                    key={index}
                    className={AttainmentCheck ? styles.on : ""}
                    onClick={() =>
                      AttainmentCheck
                        ? BadgeDataGet(item.id, "Received", AchievementData, ProgressingData)
                        : BadgeDataGet(item.id, "Progressing", AchievementData, ProgressingData)
                    }
                  >
                    <BadgeImg
                      className={styles.badgeImg}
                      $badgeImgUrl={item.image}
                    />
                    <span className="blind">{item.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {/* 오픈예정배지 */}
        <div id={styles.unattainedBadge} className={styles.badgeBox}>
          <div className={styles.title}>
            <h3>
              오픈 예정 배지
              <span className={styles.count}>{FutureData.totalElements}</span>
            </h3>
            <div className={styles.buttonBox}>
              <PaginationBox
                pagePath={router.asPath}
                activePage={Number(FutureData.number) + 1}
                itemsCountPerPage={FutureData.size}
                totalItemsCount={FutureData.totalElements}
                pageRangeDisplayed={-1}
                pageType="futurePage"
              // onChange={(page) => setFuturePage(page)}
              />
            </div>
          </div>
          {FutureData.totalElements === 0 ? (
            <p className={styles.empty}>달성중인 배지가 없습니다.</p>
          ) : (
            <ul className={styles.badgeList}>
              {FutureData.content.map((item, index) => {
                return (
                  <li
                    key={index}
                    code={item.id}
                    onClick={() => BadgeDataGet(item.id, "Future", AchievementData, ProgressingData)}
                  >
                    <BadgeImg
                      $badgeImgUrl={item.image}
                      className={styles.badgeImg}
                    />
                    <span className="blind">{item.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </>
    );
  } else {
    return (
      <RiderCodeNull />
    );
  }
}

Badge.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export async function getServerSideProps(context) {
  const { achievementPage, futurePage, progressingPage } = context.query;
  achievementPage || 0;
  futurePage || 0;
  progressingPage || 0;

  const { accessToken, refreshToken } = getToken(context);

  if (!accessToken || !refreshToken) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }


  // 대표 배지
  const RepresentedRes = await serverSideGetApi(`/api/badges/represented?page=0&size=4`, accessToken, refreshToken, context);
  const RepresentedData = (await RepresentedRes.data) || null;

  // 달성배지
  const AchievementRes = await serverSideGetApi(`/api/badges/achievement?page=${achievementPage}&size=12`, accessToken, refreshToken, context);
  const AchievementData = (await AchievementRes.data) || null;

  // 오픈 예정 배지
  const FutureRes = await serverSideGetApi(`/api/badges/future?page=${futurePage}&size=12`, accessToken, refreshToken, context);
  const FutureData = (await FutureRes.data) || null;

  // 달성 진행중인 배지
  const ProgressingRes = await serverSideGetApi(`/api/badges/progressing?page=${progressingPage}&size=12`, accessToken, refreshToken, context);
  const ProgressingData = (await ProgressingRes.data) || null;

  return {
    props: {
      AchievementData,
      FutureData,
      ProgressingData,
      RepresentedData,
    },
  };
}
