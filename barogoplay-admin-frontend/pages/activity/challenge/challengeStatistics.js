import SubNav from '@/components/SubNav/SubNav'
import BasicTable from '@/components/TableBox/BasicTable'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import Layout from '@/components/Layout/Layout';


export default function ChallengeStatistics(props) {
  const { challengeStatisticsData } = props;
  console.log("props", props)
  return (
    <div className='basicBox'>
      <SubNav />
      <BasicTable
        filterCategory="challengeStatistics"
        data={challengeStatisticsData}
        downOnOff={true}
        checkOnOff={true}
        filterListSet={[
          "challengePeriod"
        ]}
        filterSearchSet={[
          "challengeId", "challengeName"
        ]}
      />
    </div>
  )
}

ChallengeStatistics.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const queryUrl = queryString(FilterDataSet("challengeStatistics", context.query));
  const challengeStatisticsRes = await serverSideGetApi(
    `/api/challenges/progresses?${queryUrl}`,
    accessToken,
    refreshToken,
    context
  );

  const challengeStatisticsData = await challengeStatisticsRes.data || [];
  return {
    props: {
      challengeStatisticsData,
    }
  }
}