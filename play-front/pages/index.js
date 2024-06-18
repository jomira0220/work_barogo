import RootLayout from "@/components/LayoutBox/RootLayout";
import ReportPage from '@/pages/activity/report';
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";
import { LoadingIcon } from "@/components/Icon/Icon";
import getReportDate from "@/utils/func";
import Event from '@/pages/event/[...eventPage]';
import { OnMessageFCM } from "@/utils/OnMessageFCM";
import { useEffect, useState } from "react";


export default function HomePage(props) {

  // 푸시메시지 전송시 확인하여 상태값 노출 처리용
  const [PushData, setPushData] = useState(null);

  useEffect(() => {
    // 푸시메시지 수신시 처리
    OnMessageFCM(setPushData)
  }, [])

  const { data, brandCheck, isLogin, userinfo } = props;

  if (isLogin === "loading") {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 134px)" }}><LoadingIcon /></div>;
  } else if (isLogin === "true" && brandCheck) {
    return (<ReportPage data={data} brandCheck={brandCheck} isLogin={isLogin} userinfo={userinfo} />)
  } else {
    return (
      <>
        {/* 푸시메시지 발송 확인용 {PushData !== null && <div>{PushData.title}{PushData.body}</div>} */}
        <Event pageName="event" pageType={true} data={data} />
      </>
    )
  }
}

HomePage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};


export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = await getToken(context);

  let { searchType, searchKeyword, page: pageNum } = context.query;

  pageNum = Number(pageNum) || 0;
  searchType = searchType || "titleOrContent";
  searchKeyword = searchKeyword || "";

  const brandCheckRes = await serverSideGetApi("/api/users/me/brand", accessToken, refreshToken, context);

  if (accessToken && refreshToken && brandCheckRes !== undefined) {
    // !로그인 체크 및 브랜드 확인 (라이더 코드 등록 여부)
    let brandCheck = await brandCheckRes.data || null;
    brandCheck = brandCheck === "" ? null : brandCheck;

    if (brandCheck === null) {

      // !라이더 코드가 없으면 이벤트 게시판 데이터를 가져옴 -> **나중에 hot게시판으로 바꾸기
      const EventBoardRes = await serverSideGetApi(
        `/api/boards/event/posts?searchType=${searchType}&searchKeyword=${searchKeyword}&page=${pageNum}&size=20&sort=hotTime,desc&sort=createdDate,desc`,
        accessToken, refreshToken, context
      );
      const data = await EventBoardRes.data || null;
      return { props: { data } }

    } else {

      // !라이더 코드가 있으면 리포트 데이터를 가져옴
      let { standard, date } = context.query;

      // 근무 수행이 있는 마지막 날짜 확인
      const lastDateRes = await serverSideGetApi("/api/reports/last", accessToken, refreshToken, context);
      const lastDate = await lastDateRes.data || null;

      standard = standard || "day";
      date = date || getReportDate(lastDate);

      const dateArr = date.split("-");
      const apiDate =
        standard === "day" || standard === undefined
          ? `${date}`
          : standard === "month"
            ? `${dateArr[0]}-${dateArr[1]}`
            : `${date}`;

      const ReportRes = await serverSideGetApi(`/api/reports/me?type=${standard}&param=${apiDate}`, accessToken, refreshToken, context);
      const reportData = (await ReportRes.data) || null;

      const accountRes = await serverSideGetApi('/api/users/me/account', accessToken, refreshToken, context);
      const userinfo = (await accountRes.data) || null;

      const data = { standard, reportData, date };
      return { props: { data, userinfo }, };
    }
  } else {

    // !로그인이 안되어 있을 경우 이벤트 데이터를 가져옴
    const { accessToken, refreshToken } = getToken(context);
    let { searchType, searchKeyword, page } = context.query;
    const pageNum = page ? page : 0; // 페이지 번호
    const EventRes = await serverSideGetApi(
      `/api/boards/event/posts?searchType=${searchType}&searchKeyword=${searchKeyword}&ongoing=on&page=${pageNum}&size=5&sort=createdDate,desc`,
      accessToken, refreshToken, context
    );

    const boardData = await EventRes.data || {};

    return { props: { data: boardData } }
  }
};
