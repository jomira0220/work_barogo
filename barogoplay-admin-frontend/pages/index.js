import styles from "@/styles/Home.module.scss";
import { ArrowZigZagIcon } from "@/components/Icon/Icon";
import { Filter } from "@/components/Filter/Filter";
import { BarChart, LineChart } from "@/components/Chart/Chart";
import { FilterNewArray } from "@/components/utils/FilterNewArray";
import { getToken, serverSideGetApi } from "@/components/utils/serverSideGetApi";
import { useEffect, useState } from "react";
import { daySet, monthSet } from "@/components/utils/daySet";
import Layout from "@/components/Layout/Layout";
import Button from "@/components/Button/Button";
import { useRouter } from "next/router";
import Apis from "@/components/utils/Apis";


export default function HomePage(props) {

  const router = useRouter();

  const { topCountBaseDayData, varianceData, levelData, memberCountData, isLogin } = props;

  const [conditionItem, setConditionItem] = useState(["회원수", "활성사용자수", "작성게시글수"])

  useEffect(() => {
    // ! 그래프 데이터 생성
    let ShowArr = [false, false, false]
    conditionItem.forEach((item, index) => {
      if (item.indexOf("회원수") !== -1) ShowArr[0] = true
      if (item.indexOf("활성사용자수") !== -1) ShowArr[1] = true
      if (item.indexOf("작성게시글수") !== -1) ShowArr[2] = true
    })
    const memberDataSet = memberCountData.map((i, index) => {
      const arr = {}
      arr.name = i.statisticsDate.slice(2).replace(/-/g, ".") // 날짜
      if (ShowArr[0]) arr["회원수"] = i.totalUserCount
      if (ShowArr[1]) arr["활성사용자수"] = i.activeUserCount
      if (ShowArr[2]) arr["작성게시글수"] = i.postCount
      return arr
    });

    setLineGraphData(memberDataSet)
  }, [memberCountData, conditionItem]);


  const [lineGraphData, setLineGraphData] = useState();
  const memberDistribution_filterListSet = ["brandRadio"];
  const periodMemberCondition_filterListSet = ["period", "brandRadio2", "conditionItem"]; // 기간, 브랜드, 조건항목

  // 브랜드별 회원 분포 데이터
  const [memberDistributionData, setMemberDistributionData] = useState(FilterNewArray(
    memberDistribution_filterListSet
  ));
  // 기간별 회원 조건 항목 필터 데이터
  const [periodMemberConditionData, setPeriodMemberConditionData] = useState(FilterNewArray(
    periodMemberCondition_filterListSet
  ));

  // 회원 티어 분포 데이터
  const barGraphData = levelData.map((item, index) => {
    return {
      name: item.levelName.replace("라이더", ""),
      countData: item.userCount,
      color: `var(--play-color-${index % 4 !== 0 ? index % 4 : 2})`,
    };
  });


  const queryString = (queryArr) => Object.keys(queryArr).map((key) => {
    return key + "=" + queryArr[key];
  }).join("&");

  // 회원 티어 분포 필터 조건에 따른 쿼리스트링 변경
  const MemberDistributionSearch = () => {
    const brandValue = document.querySelector(`.${styles.memberData} [name="brandRadio"]:checked`).value;
    router.query.levelBrand = brandValue;
    router.push(`/?${queryString(router.query)}`)
  }

  // 기간별 회원 조건 항목 필터 조건에 따른 쿼리스트링 변경
  const PeriodMemberConditionSearch = () => {

    const pathName = router.pathname; // 현재 페이지 경로

    // 브랜드 체크 사항 확인
    const brandValue = document.querySelector(`.${styles.periodMember} [name="brandRadio2"]:checked`).value; // 브랜드
    router.query.countBrand = brandValue;
    // console.log("브랜드", brandValue)

    // 조건 항목 체크 사항 배열로 변환
    const conditionItemValue = document.querySelectorAll(`.${styles.periodMember} [name="conditionItem"]:checked`);
    let conditionItemValueArr = Array.from(conditionItemValue).map((item) => { return item.value }); // 조건 항목 중 체크된 값만 배열로 변환
    conditionItemValueArr[0] === "전체" ? conditionItemValueArr = ["회원수", "활성사용자수", "작성게시글수"] : conditionItemValueArr;
    // console.log("조건항목", conditionItemValueArr)
    setConditionItem(conditionItemValueArr);

    if (document.querySelector(`.${styles.periodMember} [name="period"]:checked`).value === "기간선택") {
      // 기간 선택일 경우 countBaseDate 쿼리스트링 삭제
      delete router.query.countBaseDate;

      // 기간 선택일 경우
      const startDate = document.querySelector(`input[name="기준날짜 시작"]`).value;
      const endDate = document.querySelector(`input[name="기준날짜 종료"]`).value;
      router.query.radioStartDate = new Date(startDate).toISOString().split("T")[0];
      router.query.radioEndDate = new Date(endDate).toISOString().split("T")[0];
      router.push(`${pathName}?${queryString(router.query)}`)
    } else {
      // 기간 선택이 아닐 경우 기간 선택 쿼리스트링 삭제
      delete router.query.radioStartDate;
      delete router.query.radioEndDate;

      // 기간 선택이 아닐 경우
      const periodValue = document.querySelector(`.${styles.periodMember} [name="period"]:checked`).value;
      router.query.countBaseDate = periodValue === "7" ? daySet(new Date(), 7) : monthSet(new Date(), 6);
      router.push(`${pathName}?${queryString(router.query)}`)
    }
  }


  const [MemberView, setMemberView] = useState({ onoff: false, data: null })
  const [MemberViewTime, setMemberViewTime] = useState(null)
  const NowMemberView = async () => {
    const nowCountRes = await Apis('/api/dashboard/now/counts')
    const nowCountData = await nowCountRes.data;
    // console.log(nowCountData)
    if (nowCountData.status === "success" && nowCountData.data !== null && nowCountData.data !== undefined && nowCountData.data.length !== 0) {
      setMemberViewTime(new Date().toLocaleString())
      setMemberView({ onoff: true, data: nowCountData.data })
    }
  }


  if (isLogin === "true")
    return (
      <>
        <main className={styles.main}>
          <Button className={styles.nowMemberBtn} variantStyle="darkgray" sizeStyle="sm" onClick={() => NowMemberView()}>실시간 회원수 조회</Button>
          {MemberViewTime && <span className={styles.nowMemberTime}>조회시간 : {MemberViewTime}</span>}

          <div className={styles.dataTop + ` maxWidth`}>
            {MemberView.onoff && (
              MemberView.data.map((item, index) => {
                const brandName = {
                  "BAROGO": "바로고",
                  "DEALVER": "딜버",
                  "MOALINE": "모아라인",
                  "null": "미연동",
                }
                return <div key={index} className='basicBox'>
                  <h3>{brandName[item.brandCode]} 회원수</h3>
                  <div className={styles.dataTopCount}>
                    <p className={styles.count}>
                      {item.count.toLocaleString("ko-KR")} 명
                    </p>
                  </div>
                </div>
              })
            )
            }
          </div>
          <div className={styles.dataTop + ` maxWidth`}>
            {Object.keys(varianceData)
              .map((item, index) => {
                const title =
                  item === "totalUserCount"
                    ? "회원수"
                    : item === "activeUserCount"
                      ? "활성사용자수"
                      : "작성게시글수";
                const colorSet =
                  varianceData[item] < 0
                    ? "#1400ff"
                    : varianceData[item] === 0
                      ? "#000"
                      : "#f41d1d";

                return (
                  <div key={index} className="basicBox">
                    <h3>{title}</h3>
                    <div className={styles.dataTopCount}>
                      <p className={styles.count}>
                        {topCountBaseDayData[0][item].toLocaleString("ko-KR")}
                        {title === "작성게시글수" ? "건" : "명"}
                      </p>
                      <p className={styles.variance}>
                        {varianceData[item].toLocaleString("ko-KR")}
                        {title === "작성게시글수" ? "건" : "명"}
                        <span
                          className={
                            styles.arrowIcon +
                            (varianceData[item] < 0 ? ` ${styles.down}` : "")
                          }
                        >
                          <ArrowZigZagIcon color={colorSet} />
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className={styles.memberData}>
            <div className="basicBox maxWidth100">
              <h3>회원 티어 분포</h3>
              <div className={styles.searchFilter}>
                {memberDistribution_filterListSet.map((item, index) => {
                  return (
                    <Filter
                      key={index}
                      filterTotalData={memberDistributionData}
                      setFilterTotalData={setMemberDistributionData}
                      filterTitleSet={item}
                      filterCategory={"memberTier"}
                    />
                  );
                })}
                <Button variantStyle="color" sizeStyle="sm" onClick={() => MemberDistributionSearch()}>검색</Button>
              </div>
              <div className={styles.barGraph}>
                <BarChart data={barGraphData} countName="티어 수" />
              </div>
            </div>
          </div>

          <div className={styles.periodMember}>
            <div className="basicBox maxWidth100">
              <h3>기간별 회원 조건 항목</h3>
              <div className={styles.searchFilter}>
                <div>
                  {periodMemberCondition_filterListSet.map((item, index) => {
                    return (
                      <Filter
                        key={index}
                        filterTotalData={periodMemberConditionData}
                        setFilterTotalData={setPeriodMemberConditionData}
                        filterTitleSet={item}
                        filterCategory={"periodMemberCondition"}
                      />
                    );
                  })}
                </div>
                <Button variantStyle="color" sizeStyle="sm" onClick={() => PeriodMemberConditionSearch()}>검색</Button>
              </div>
              <div className={styles.lineGraph}>
                {lineGraphData && <LineChart data={lineGraphData} />}
              </div>
            </div>
          </div>
        </main>
      </>
    );
}

HomePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}


export async function getServerSideProps(context) {

  const { accessToken, refreshToken } = getToken(context);

  // 1. 쿠키에 accessToken, refreshToken이 없으면 로그인 페이지로 이동
  if (!accessToken || !refreshToken) {
    return {
      redirect: {
        destination: `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`,
        permanent: false,
      },
    };
  } else {

    let { levelBrand, countBrand, countBaseDate, radioStartDate, radioEndDate } = context.query;

    // 회원 티어 분포
    const leverBrand = levelBrand || "BAROGO";
    const levelRes = await serverSideGetApi(`/api/dashboard/level/${leverBrand}`, accessToken, refreshToken, context);

    // 회원 티어 분포 데이터
    const levelData = (await levelRes.data) || [];

    // 어제 날짜
    const yesterDay = daySet(new Date(), 1);

    // 그제 날짜
    const yesterDayBefore = daySet(new Date(), 2);



    // 빈 데이터 생성 처리용
    const NullSet = (startDate, endDate) => {

      // 날짜 범위에 따른 날짜 데이터 배열 생성
      const getDateRangeData = (param1, param2) => {  //param1은 시작일, param2는 종료일이다.
        var res_day = [];
        var ss_day = new Date(param1);
        var ee_day = new Date(param2);
        while (ss_day.getTime() <= ee_day.getTime()) {
          var _mon_ = (ss_day.getMonth() + 1);
          _mon_ = _mon_ < 10 ? '0' + _mon_ : _mon_;
          var _day_ = ss_day.getDate();
          _day_ = _day_ < 10 ? '0' + _day_ : _day_;
          res_day.push(ss_day.getFullYear() + '-' + _mon_ + '-' + _day_);
          ss_day.setDate(ss_day.getDate() + 1);
        }
        return res_day;
      }

      const dateRangeArr = getDateRangeData(startDate, endDate);
      const DayData = [];
      for (let i = 0; i < dateRangeArr.length; i++) {
        DayData.push({
          statisticsDate: dateRangeArr[i],
          totalUserCount: 0,
          activeUserCount: 0,
          postCount: 0,
        });
      }
      return DayData;
    }


    // 날짜 범위에 따른 브랜드별 회원 조건 항목 데이터 호출
    const dataRes = async (startDate, endDate, brand) => {

      let brandName = brand.toLowerCase();
      const res = await serverSideGetApi(
        `/api/dashboard/counts?startDate=${startDate}&endDate=${endDate}&brand=${brandName}`,
        accessToken, refreshToken, context
      );

      let data = await res.data;
      if (data === null || data === undefined || data.length === 0) {
        data = NullSet(startDate, endDate);
      }
      return data;
    };

    // 어제 날짜를 기준으로 회원수, 활성사용자수, 작성게시글수 호출
    const topCountBaseDayData = await dataRes(yesterDay, yesterDay, "total")
    // 그제 날짜의 회원수, 활성사용자수, 작성게시글수 호출
    const topCountBeforeData = await dataRes(yesterDayBefore, yesterDayBefore, "total")



    // 어제 날짜와 그제 날짜의 회원수, 활성사용자수, 작성게시글수의 차이 데이터
    const varianceData = {};
    Object.keys(topCountBaseDayData[0])
      .filter((item) => {
        return typeof topCountBaseDayData[0][item] === "number";
      })
      .forEach((item) => {
        varianceData[item] = topCountBaseDayData[0][item] - topCountBeforeData[0][item];
      });

    // 기준 날짜를 기준으로 7일간 브랜드 회원수, 활성사용자수, 작성게시글수 호출
    const brandSet = countBrand || "BAROGO"; // 브랜드가 없으면 바로고가 기본값
    const baseDay = yesterDay; // 기준 날짜가 없으면 어제 날짜가 기본값
    const beforeSevenDay = countBaseDate || daySet(baseDay, 7); // 기준 날짜를 기준으로 7일 전 날짜
    // console.log(countBaseDate, "countBaseDate", beforeSevenDay, "beforeSevenDay")

    let memberCountData = [];
    if (radioStartDate && radioEndDate && radioStartDate !== "" && radioEndDate !== "") {
      //라디오 버튼으로 날짜 선택시 데이터
      memberCountData = await dataRes(radioStartDate, radioEndDate, brandSet) || [];
    } else {
      //기본 7일 데이터
      memberCountData = await dataRes(beforeSevenDay, baseDay, brandSet) || []
      // console.log("beforeSevenDay", beforeSevenDay, "baseDay", baseDay)
    }

    return {
      props: {
        topCountBaseDayData,
        varianceData,
        levelData,
        memberCountData,
      },
    };
  }
};

