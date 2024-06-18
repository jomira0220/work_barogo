import styles from "./Report.module.scss";
import ReportGraph from "@/components/ReportGraph";
import RootLayout from "@/components/LayoutBox/RootLayout";
import { useRouter } from "next/router";
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";
import DatePickerBox from "@/components/DatePickerBox/DatePickerBox";
import Link from "next/link";
import { LineBasicArrow } from "@/components/Icon/Icon";
import getReportDate from "@/utils/func";
import RiderCodeNull from '@/components/RiderCodeNull';
import { useEffect } from 'react';

export default function ReportPage(props) {
  const router = useRouter();
  const { data, brandCheck, isLogin, userinfo } = props;
  let { standard, reportData, date: reportDate } = data;


  console.log("리포트 페이지", reportData)

  useEffect(() => {
    if (reportData === undefined) {
      location.reload()
    } else if (isLogin === "false") {
      // ! 로그인 전 이거나 리포트 데이터가 없는 경우 이벤트 · 소식 페이지가 보이도록 처리
      location.href = '/event/event'
    }
  }, [reportData, isLogin])

  //! 최소 날짜 설정
  const MinDateSet = () => {
    // 2024-04-10 서비스 시작 날짜이후의 데이터만 조회 가능
    // 현재 시간을 기준으로 최대 3개월 전까지만 조회 가능
    const today = new Date();
    const serviceStart = new Date("2024-04-10");
    const threeMonthAgo = new Date(today.setMonth(today.getMonth() - 3));
    return today < serviceStart ? serviceStart : threeMonthAgo;
  }

  //! 수행건수, 수행거리, 배달대행료 클릭시 블러 처리
  const blurEvent = (e) => {
    e.currentTarget.classList.toggle(styles.active);
  }

  const ReportMenuList = [
    { name: "day", title: "일간" },
    { name: "month", title: "월간" },
    { name: "total", title: "누적" },
  ];
  //! 날짜 변경시 쿼리 주소 변경 처리용
  const ChangeDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;
    const dateStr = `${year}-${month}-${day}`
    router.replace(`/activity/report?standard=${standard}&date=${dateStr}`);
  };

  // ! 데이터 아이템 컴포넌트
  const DataItem = ({ title, data }) => {
    return (
      <li>
        {title}
        <span className={styles.scoreNumber} onClick={(e) => blurEvent(e)}>
          <span>
            <span className={styles.backdrop}></span>
            {data}
          </span>
        </span>
      </li>
    );
  }



  // ! 라이더 코드 등록 전이거나 데이터가 없는 경우
  if (brandCheck === null || data === null) {
    return (
      <RiderCodeNull />
    );
  } else if (reportData === undefined) {
    // ! 리포트 데이터가 없는 경우 이벤트 · 소식 페이지가 보이도록 처리
    location.href = '/event/event'
  } else if (reportData !== null && brandCheck !== null) {
    return (
      <>
        {/* ! ReportGraph컴포넌트 안에 페이지 설명 글 있음 */}
        <ReportGraph
          graphInfoTitle={standard === "day" ? "일간" : standard === "month" ? "월간" : "누적"}
          totalAverage={reportData.totalAverage || 0}
          deliveryCount={reportData.deliveryCount || 0}
          nickname={userinfo.nickname || "닉네임"}
          brandCheck={brandCheck}
          earningPoint={reportData.earningPoint || 0}
        />
        <ul className={styles.reportMenu}>
          {ReportMenuList.map((item) => {
            return (
              <li key={item.name}>
                <Link
                  className={
                    styles.reportMenuLink +
                    (item.name === standard ? ` ${styles.active}` : "")
                  }
                  href={`/activity/report?standard=${item.name}&date=${reportDate}`}
                  name={item.name}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
        <div id={styles.reportWrap}>
          {/* 누적이 아닌 경우 노출 처리 */}
          {standard !== "total" ? (
            <div className={styles.datepickerWarp}>
              <DatePickerBox
                dateFormat={standard === "day" ? "M월 d일" : "M월"}
                onChange={(date) => ChangeDate(date)}
                selected={new Date(reportDate)}
                minDate={MinDateSet()}
                maxDate={new Date()}
              />
            </div>
          ) : (
            <div className={styles.dummy}>누적 리포트</div>
          )}
          <ul id={styles.dataList}>
            <DataItem title="배달건수" data={reportData.deliveryCount.toLocaleString("ko-KR")} />
            <DataItem title="배달거리" data={parseInt(reportData.deliveryDistance) / 1000 + "km"} />
            <DataItem title="배달수익" data={reportData.deliveryIncome.toLocaleString("ko-KR") + "원"} />
          </ul>
          {standard === "day" && (
            <Link
              className={styles.detailDataBtn}
              href={`/activity/report/detail?date=${reportDate}`}
            >
              수행 기록 상세
              <LineBasicArrow color="var(--play-color-1)" />
            </Link>
          )}
        </div>
      </>
    );
  }
}

ReportPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};





export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  let { standard, date } = context.query;

  const brandCheckRes = await serverSideGetApi('/api/users/me/brand', accessToken, refreshToken, context);
  let brandCheck = await brandCheckRes.data || null;

  // 근무 수행이 있는 마지막 날짜 확인
  const lastDateRes = await serverSideGetApi(
    "/api/reports/last",
    accessToken,
    refreshToken,
    context
  );
  const lastDate = await lastDateRes.data || null;

  standard = standard || "day";
  date = date || getReportDate(lastDate); // 기본 날짜가 없는 경우 어제 날짜 혹은 마지막 데이터가 있는 날짜로 리턴

  const dateArr = date.split("-");
  const apiDate =
    standard === "day" || standard === undefined
      ? `${date}`
      : standard === "month"
        ? `${dateArr[0]}-${dateArr[1]}`
        : `${date}`;

  const reportRes = await serverSideGetApi(
    `/api/reports/me?type=${standard}&param=${apiDate}`,
    accessToken,
    refreshToken,
    context
  );

  let reportData = (await reportRes.data) || null;

  const userInfoRes = await serverSideGetApi(
    "/api/users/me/account",
    accessToken,
    refreshToken,
    context
  );
  const userinfo = (await userInfoRes.data) || null;

  return {
    props: {
      data: { standard, reportData, date },
      userinfo,
      brandCheck,
      lastDate,
    },
  };
};
