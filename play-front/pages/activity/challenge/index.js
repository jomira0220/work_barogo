import RootLayout from "@/components/LayoutBox/RootLayout";
import Modal from "@/components/Modal/Modal";
import InfoModal from "@/components/InfoModal/InfoModal";
import Button from "@/components/Button/Button";
import { useState } from "react";
import styles from "./Challenge.module.scss";
import { serverSideGetApi, getToken } from "@/utils/serverSideGetApi";
import Apis from "@/utils/Apis";
import { loginCheck } from "@/utils/loginCheck";
import InfoDetailBtn from "@/components/InfoDetailBtn/InfoDetailBtn";
import RiderCodeNull from '@/components/RiderCodeNull';
import ChallengeInfoBox from "@/components/ChallengeInfoBox";

export default function Challenge(props) {
  const { isLogin, challengeData: challenge, brandCheck } = props;

  const [modalOpened, setModalOpened] = useState(false);
  const [getPoint, getPointSet] = useState(0);

  const [challengeData, setChallengeData] = useState(challenge);

  loginCheck(isLogin);

  console.log("챌린지 데이터", challengeData);

  // 팝업 클로즈
  const HandleClose = () => {
    setModalOpened(false);
  };

  //! 챌린지 성공 및 실패 여부와 보상 수령 여부 확인에 따른 스타일 적용
  const ChallengeCheckStyle = (acquireDate, received) => {
    // acquireDate = 챌린지 달성완료 날짜(2023-10-12), received = 보상 수령 여부
    const result =
      acquireDate !== null // 챌린지를 달성 완료했을 경우
        ? received
          ? styles.received // 보상을 수령한 상태면
          : styles.notReceived // 보상을 수령하지 않은 상태면
        : styles.failed; // 챌린지를 달성하지 못했을 경우
    return result;
  };

  // ! 챌린지 보상 받기
  const GetPointHandler = async (id, point) => {
    const pointGetRes = await Apis.post(`/api/challenge/${id}/received`);
    console.log("챌린지 보상 받기 api", pointGetRes);
    if (pointGetRes.status === 200 && pointGetRes.data.status === "success") {
      // 챌린지 보상 내용 확인 팝업 노출
      getPointSet(point); // 획득한 경험치 금액 셋팅
      setModalOpened(true); // 획득한 경험치 금액 확인 팝업 노출

      const newDataRes = await Apis.get(`/api/challenge`);
      const newData = (await newDataRes.data) || [];
      setChallengeData(newData.data); // 챌린지 데이터 리프레시

    } else {
      alert("챌린지 보상 받기에 실패하였습니다 사유: " + pointGetData.data.message);
    }
  };


  if (isLogin === "true" && brandCheck) {
    return (
      <>
        {modalOpened && (
          <Modal closePortal={() => HandleClose()}>
            <InfoModal
              title={<>
                챌린지 달성 보상으로<br />
                <b>{getPoint}Exp</b>를 받았습니다.
              </>}
            >
              <Button
                variantStyle="color"
                sizeStyle="md"
                onClick={() => HandleClose()}
              >
                닫기
              </Button>
            </InfoModal>
          </Modal>
        )}
        <div className={styles.challengeWarp}>
          <div className={styles.thisWeek}>
            <div className={styles.infoTitle}>
              <h2>진행중인 챌린지</h2>
              <InfoDetailBtn className={styles.infoBtn}>
                <h5>챌린지란?</h5>
                <b>
                  매주 챌린지를 달성하고 플레이<br /> 경험치를 획득해보세요!<br />
                  꾸준히 챌린지를 달성하는 것은 <br />플레이 경험치를 모으는 가장 빠른 방법입니다
                </b>
              </InfoDetailBtn>
            </div>
            {challengeData.thisWeekChallengeList !== undefined &&
              challengeData.thisWeekChallengeList.length === 0 ? (
              <p className={styles.empty}>진행중인 챌린지가 없습니다.</p>
            ) : (
              <ul>
                {challengeData.thisWeekChallengeList.map((item, index) => {
                  const styleCheck = ChallengeCheckStyle(item.acquireDate, item.received);
                  return (
                    <li key={index} className={styleCheck !== styles.failed ? styleCheck : ""}>
                      {((styleCheck === styles.received) || (styleCheck === styles.notReceived))
                        && (
                          <div className={styles.coverBox}>
                            <div className={styles.inner}>
                              {styleCheck === styles.received ? ( // 챌린지 성공 경험치 수령 후
                                <>
                                  <div className={styles.challengeSuccess}>
                                    <p><b>챌린지 달성 보상 획득 완료</b></p>
                                  </div>
                                  <span className="blind">
                                    경험치 획득 완료한 챌린지
                                  </span>
                                </>
                              ) : ( // 챌린지 성공 경험치 수령 전 
                                <>
                                  <p>
                                    <b>챌린지 성공</b>
                                    보상 경험치를 받으세요!
                                  </p>
                                  <Button
                                    sizeStyle="sm"
                                    variantStyle="gradient"
                                    onClick={() => GetPointHandler(item.id, item.point)}>
                                    경험치 받기
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                      <ChallengeInfoBox item={item} failCheck={false} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className={styles.lastWeek}>
            <h2>지난주 챌린지</h2>
            {challengeData.lastWeekChallengeList.length === 0 ? (
              <p className={styles.empty}>진행된 챌린지가 없습니다.</p>
            ) : (
              <ul>
                {challengeData.lastWeekChallengeList.map((item, index) => {
                  const styleCheck = ChallengeCheckStyle(item.acquireDate, item.received);
                  return (
                    <li key={index} className={styleCheck}>
                      <div className={styles.coverBox}>
                        <div className={styles.inner}>
                          {styleCheck === styles.failed ? ( //챌린지 실패
                            <b>
                              챌린지 종료
                              <br />
                              <span>다음 챌린지에 도전해보세요!</span>
                            </b>
                          ) : styleCheck === styles.received ? ( // 챌린지 성공 경험치 수령완료
                            <>
                              <div className={styles.challengeSuccess}>
                                <p><b>챌린지 달성 보상 획득 완료</b></p>
                              </div>
                              <span className="blind">
                                경험치 획득을 완료한 챌린지
                              </span>
                            </>
                          ) : ( // 챌린지 성공 경험치 수령전
                            <>
                              <p>
                                <b>챌린지 성공</b>
                                보상 경험치를 받으세요!
                              </p>
                              <Button
                                sizeStyle="sm"
                                variantStyle="gradient"
                                onClick={() => GetPointHandler(item.id, item.point)}>
                                경험치 받기
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <ChallengeInfoBox item={item} failCheck={styleCheck === styles.failed} />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <RiderCodeNull />
    );
  }
}

Challenge.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = getToken(context);
  const res = await serverSideGetApi(
    `/api/challenge`,
    accessToken,
    refreshToken,
    context
  );
  const challengeData = (await res.data) || {
    thisWeekChallengeList: [],
    lastWeekChallengeList: [],
  };

  return {
    props: {
      challengeData,
    },
  };
}
