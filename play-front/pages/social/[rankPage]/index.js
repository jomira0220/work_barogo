import RootLayout from "@/components/LayoutBox/RootLayout";
import styles from "./RankPage.module.scss";
import InfoDetailBtn from "@/components/InfoDetailBtn/InfoDetailBtn";
import { useEffect, useState } from "react";
import ArrowBtn from "@/components/Button/ArrowBtn";
import { getToken, serverSideGetApi } from '@/utils/serverSideGetApi';
import { useRouter } from 'next/router';
import SocialInfo from '@/components/SocialInfo/SocialInfo';
import Apis from '@/utils/Apis';
import PaginationBox from "@/components/Pagination/PaginationBox";

export default function RankPage(props) {

    const router = useRouter();
    const { title, subtitle, rankData, yearSet, myAreaSet, isLogin, brandCheck, userInfo } = props;

    console.log("랭킹페이지 데이터", props)

    const [MyArea, setMyArea] = useState(myAreaSet); // 내 지역 랭킹보기 온오프
    const serviceStartYear = 2024; //서비스 시작 년도
    const nowYear = new Date().getFullYear(); //현재 년도
    const prevCheck = Number(yearSet) > serviceStartYear; //이전 년도로 이동 가능 여부
    const nextCheck = Number(yearSet) < Number(nowYear); //다음 년도로 이동 가능 여부

    const [friendInfo, setFriendInfo] = useState({ onoff: false, info: "" }); //친구 정보 팝업 노출용

    const UserSocialView = async (userId) => {
        // 랭크에서 클릭한 유저 소셜 정보 가져오기
        const socialInfoRes = await Apis.get(`/api/users/${userId}`);
        const socialInfoData = await socialInfoRes.data.data;
        console.log("클릭한 유저 정보", socialInfoRes)

        if (socialInfoRes.status === 200 && socialInfoRes.data.status === "success") {
            setFriendInfo({
                onoff: true,
                info: socialInfoData,
            });
        } else {
            alert("해당 유저의 정보를 불러올 수 없습니다.")
        }
    }

    //!년도 변경시 쿼리 변경 처리
    const YearQuery = (year) => {
        if (router.asPath.indexOf("?") === -1) {
            // ! 쿼리가 없는 상태인 경우
            router.push(`${router.asPath}?year=${year}`);
        } else {
            //  ! 쿼리가 있고 year 쿼리가 있는 경우와 없는 경우
            router.asPath.indexOf("year") !== -1
                ? router.push(router.asPath.replace(/year=\d{4}/, `year=${year}`))
                : router.push(`${router.asPath}&year=${year}`);
        }
    }

    //!서비스 시작 년도 기준으로 방향키 온오프처리
    const checkYear = (direction) => {
        //서비스가 시작된 년도보다 이전 년도로 이동 불가
        direction === "prev" ? prevCheck && YearQuery(Number(yearSet) - 1) : nextCheck && YearQuery(Number(yearSet) + 1)
    }


    // ! 배열을 특정 길이만큼 분리하는 함수
    const splitIntoChunk = (arr, chunk) => {
        // 빈 배열 생성
        const result = [];
        for (var index = 0; index < arr.length; index += chunk) {
            let tempArray;
            // slice() 메서드를 사용하여 특정 길이만큼 배열을 분리함
            tempArray = arr.slice(index, index + chunk);
            // 빈 배열에 특정 길이만큼 분리된 배열을 추가
            result.push(tempArray);
        }
        return result;
    }

    const rankList = splitIntoChunk(rankData?.rankingList || [], 25); // 랭킹 리스트 25개씩 나눠서 저장
    const [rankPaging, setRankPaging] = useState(Number(router.query.page) || 0);

    useEffect(() => {
        setRankPaging(Number(router.query.page) || 0)
    }, [router.query.page])


    return (
        <>
            <div className={styles.rankWarp}>
                <InfoDetailBtn className={styles.pageInfoBtn}>
                    <h5>{subtitle} 랭킹이란?</h5>
                    <p>
                        라이더 플레이 사용자가 다함께 랭킹을 겨루는 공간입니다.
                        올해 플레이에서 모은 경험치를 기반으로 랭킹이 산정됩니다.
                        <b>새로운 시즌이 시작돼도 티어는 초기화되지 않습니다.</b>
                    </p>
                </InfoDetailBtn>
                {subtitle === '시즌' && (
                    <div className={styles.yearSetBox}>
                        <ArrowBtn className={prevCheck ? "on" : ""} type="prev" onClick={() => checkYear("prev")}>왼쪽화살표</ArrowBtn>
                        {yearSet}
                        <ArrowBtn className={nextCheck ? "on" : ""} type="next" onClick={() => checkYear("next")}>오른쪽화살표</ArrowBtn>
                    </div>
                )}

                {brandCheck && rankData !== null && (
                    <>
                        {/* <ToggleBtn
                                label="내 지역 랭킹보기"
                                toggled={MyArea}
                                onClick={() => LogState(MyArea)}
                            /> */}
                        <h2 className={styles.meRankTitle}>나의 {subtitle} 랭킹</h2>
                        <div className={styles.myDataBox}>
                            <p><span className={styles.myRank}>{rankData.myRank === null || rankData.myRank.rank === "" ? "순위없음" : rankData.myRank.rank.toLocaleString("ko-KR") + "위"}</span>{subtitle} 순위</p>
                            <p><span className={styles.myPoint}>{rankData.myRank === null || rankData.myRank.point === "" ? 0 : rankData.myRank.point.toLocaleString("ko-KR")}Exp</span>경험치</p>
                        </div>
                    </>
                )}

                {rankData !== null ?
                    (
                        <>
                            <div className={styles.infoTitle}>
                                <h3>{MyArea && "내 지역"} {subtitle} 랭킹</h3>
                            </div>

                            <div className={styles.tableTop}>
                                <span>순위</span>
                                <span>라이더명</span>
                                <span>경험치</span>
                            </div>
                            <ul className={styles.rankList}>
                                {rankList[rankPaging].map((item, index) => {
                                    const point = item.point.toLocaleString("ko-KR");
                                    return (
                                        <li key={index} onClick={() => UserSocialView(item.userId)}>
                                            <span><span className='blind'>순위</span>{item.rank || "없음"}</span>
                                            <span><span className='blind'>라이더명</span>{item.name || "없음"}</span>
                                            <span><span className='blind'>포인트</span>{point ? point + "Exp" : "없음"}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                            <PaginationBox
                                activePage={rankPaging + 1}
                                itemsCountPerPage={25}
                                totalItemsCount={rankData?.rankingList.length}
                                pageRangeDisplayed={4}
                                onChange={(page) => setRankPaging(page + 1)}
                            />
                        </>
                    ) : (<p className={styles.empty}>서비스가 오픈된 {serviceStartYear}년부터 <br />현재까지의 랭킹만 조회가 가능합니다.</p>)
                }
            </div>
            {/* 친구 클릭시 친구 정보 및 내 정보 안내 팝업 */}
            <SocialInfo friendInfo={friendInfo} setFriendInfo={setFriendInfo} userInfo={userInfo} />
        </>
    )
}

RankPage.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};


export const getServerSideProps = async (context) => {
    const { accessToken, refreshToken } = getToken(context);

    const { rankPage, year, myArea } = context.query;

    const type = rankPage === 'overAllRank' ? 'total' : 'season';
    const yearSet = year || new Date().getFullYear()
    const myAreaSet = myArea || false;

    const res = await serverSideGetApi(
        `/api/ranking?type=${type}&year=${yearSet}&isOnlyMyArea=${myAreaSet}`,
        accessToken, refreshToken, context)
    const rankData = await res.data || null;

    const title = rankPage === 'overAllRank' ? '명예의 전당' : '시즌 랭킹';
    const subtitle = rankPage === 'overAllRank' ? '누적' : '시즌';

    const userInfoRes = await serverSideGetApi("/api/users/me/info", accessToken, refreshToken, context);
    const userInfo = (await userInfoRes.data) || null;

    return {
        props: {
            title,
            subtitle,
            rankData,
            yearSet,
            myAreaSet,
            userInfo
        }
    }

}