import BasicTable from '@/components/TableBox/BasicTable';
import Button from '@/components/Button/Button';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi';
import { queryString } from '@/components/utils/queryString';
import { FilterDataSet } from '@/components/utils/FilterDataSet';
import Layout from '@/components/Layout/Layout';
import { useState } from 'react';
import { HiddenPost, ReportStatusPopBox } from '@/components/utils/reportControl';


export default function UnprocessedReport(props) {
  const { unprocessedReportData } = props;
  const [reportStatusPop, setReportStatusPop] = useState(false)

  // useEffect(() => {
  //   console.log("unprocessedReportData", unprocessedReportData)
  // }, [unprocessedReportData])

  console.log("미처리 신고 데이터", props)

  return (
    <div className='basicBox maxWidth100'>
      <h2>미처리 신고 게시글</h2>
      <BasicTable
        filterCategory="unprocessedReport"
        data={unprocessedReportData}
        downOnOff={true}
        checkOnOff={true}
        itemDetail={true}
        addButton={
          <Button
            className="listCheckBtn"
            variantStyle="border"
            sizeStyle="sm"
            onClick={(e) => HiddenPost(e, setReportStatusPop)}
          >신고 상태 변경</Button>
        }
      />
      {reportStatusPop && (
        <ReportStatusPopBox setReportStatusPop={setReportStatusPop} />
      )}
    </div>
  )
}

UnprocessedReport.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const queryUrl = queryString(FilterDataSet("unprocessedReport", context.query));
  const unprocessedReportRes = await serverSideGetApi(`/api/reports?${queryUrl}`, accessToken, refreshToken, context);
  const unprocessedReportData = await unprocessedReportRes.data || [];

  return {
    props: {
      unprocessedReportData,
    },
  };
}