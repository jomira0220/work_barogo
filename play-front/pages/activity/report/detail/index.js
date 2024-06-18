import PageTop from "@/components/PageTop/PageTop";
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import styles from "./ReportDetail.module.scss";
import PaginationBox from "@/components/Pagination/PaginationBox";
import InfoDetailBtn from "@/components/InfoDetailBtn/InfoDetailBtn";
import { loginCheck } from "@/utils/loginCheck";
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";


export default function ReportDetail(props) {
  const { isLogin, reportDetailData, errorMessage } = props;

  console.log("리포트 상세 데이터", reportDetailData);

  loginCheck(isLogin);

  const ItemData = ({ title, data }) => {
    return (
      <div className={styles.itemData}>
        <span className={styles.title}>{title}</span>
        <span>{data}</span>
      </div>
    );
  };

  return (
    <>
      <PageTop>
        수행기록 상세보기
        <InfoDetailBtn className={styles.infoBtn}>
          <h5>데이터 기준 안내</h5>
          <p>
            당월 1월 1일부터 현재까지의 누적
            <br />
            수행건수 : 바로고 플레이 가입 이후 수행건수
            <br />
            수행거리 : 바로고 플레이 가입 이후
            <br />
            출발지에서 도착지까지의 직선거리
            <br />
            라이더수익 : 바로고 플레이 가입 이후 바로머니 수익
            <br />
            *원천세와 허브 수수료 등을 제거한 수익
          </p>
        </InfoDetailBtn>
      </PageTop>
      <div className={styles.reportDetailWrap}>
        {reportDetailData !== null && (
          <>
            {reportDetailData.content.map((data, index) => {
              return (
                <div key={index}>
                  <div className={styles.item}>
                    <ItemData title="주문번호" data={data.cid} />
                    <ItemData title="상점명" data={data.sname} />
                    <ItemData title="발주시각" data={data.otime.replace("T", " ")} />
                    <ItemData title="배차시각" data={data.atime.replace("T", " ")} />
                    <ItemData title="완료시각" data={data.ctime.replace("T", " ")} />
                    <ItemData title="직선거리(m)" data={`${data.deliveryDistance}m`} />
                    <ItemData title="라이더 수익(원)" data={`${data.charge.toLocaleString("ko-kr")}원`} />
                  </div>
                  <div className={styles.line}></div>
                </div>
              );
            })}

            {Number(reportDetailData.totalElements) > 0 && (
              <PaginationBox
                activePage={Number(reportDetailData.number) + 1}
                itemsCountPerPage={reportDetailData.size}
                totalItemsCount={reportDetailData.totalElements}
                pageRangeDisplayed={5}
              />
            )}
          </>
        )}

        {/* 상세 데이터가 없는 경우 메세지 노출 */}
        {errorMessage && (
          <div className={styles.noData}>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </>
  );
}

ReportDetail.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  const { date, page, size } = context.query;
  const detailDate = date || "2023-12-09";
  const detailPageNum = page || 0;
  const detailSize = size || 5;

  const reportDetailRes = await serverSideGetApi(
    `/api/reports/deliveries/${detailDate}?page=${detailPageNum}&size=${detailSize}`,
    accessToken,
    refreshToken,
    context
  );

  let errorMessage = null;
  if (reportDetailRes.status === "error") {
    errorMessage = reportDetailRes.message;
  }

  const reportDetailData = await reportDetailRes.data || null;
  // console.log("리포트디테일", reportDetailData);

  return {
    props: {
      reportDetailData,
      errorMessage
    },
  };
};
