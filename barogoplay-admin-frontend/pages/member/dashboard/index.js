import HomePage from '@/pages/index'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi';
import { daySet } from '@/components/utils/daySet';
import Layout from '@/components/Layout/Layout';

export default function DashboardPage(props) {
  const { topCountBaseDayData, varianceData, levelData, memberCountData, isLogin } = props;
  // console.log(props)
  return (
    <HomePage
      isLogin={isLogin}
      topCountBaseDayData={topCountBaseDayData}
      varianceData={varianceData}
      levelData={levelData}
      memberCountData={memberCountData}
    />
  )
}

DashboardPage.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
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
  }

  const { levelBrand, countBrand, countBaseDate, radioStartDate, radioEndDate } = context.query;

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
      accessToken,
      refreshToken,
      context
    );

    let data = await res.data;
    if (data === null || data === undefined || data.length === 0) {
      data = NullSet(startDate, endDate);
    }

    return data;

  };  //close dataRes

  // 어제 날짜를 기준으로 회원수, 활성사용자수, 작성게시글수 호출
  const topCountBaseDayData = await dataRes(yesterDay, yesterDay, "total");
  // 기준 날짜를 기준으로 그제 날짜의 회원수, 활성사용자수, 작성게시글수 호출
  const topCountBeforeData = await dataRes(yesterDayBefore, yesterDayBefore, "total");


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
  // console.log(beforeSevenDay, baseDay)

  let memberCountData = [];
  if (radioStartDate && radioEndDate) {
    //라디오 버튼으로 날짜 선택시 데이터
    memberCountData = await dataRes(radioStartDate, radioEndDate, brandSet) || [];
  } else {
    //기본 7일 데이터
    memberCountData = await dataRes(beforeSevenDay, baseDay, brandSet) || []
  }
  return {
    props: {
      topCountBaseDayData,
      varianceData,
      levelData,
      memberCountData,
    },
  };

};