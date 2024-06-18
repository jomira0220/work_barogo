import SubNav from '@/components/SubNav/SubNav'
import BasicTable from '@/components/TableBox/BasicTable'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import Layout from '@/components/Layout/Layout';

export default function BadgeStatistics(props) {
  const { BadgeStatisticsData } = props;
  console.log(BadgeStatisticsData)
  return (
    <div className='basicBox'>
      <SubNav />
      <BasicTable
        filterCategory="badgeStatistics"
        data={BadgeStatisticsData}
        filterSearchSet={[
          "badgeId", "badgeName"
        ]}
      />
    </div>
  )
}

BadgeStatistics.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const queryUrl = queryString(FilterDataSet("badgeStatistics", context.query));
  const BadgeStatisticsRes = await serverSideGetApi(
    `/api/badges/progresses?${queryUrl}`,
    accessToken,
    refreshToken,
    context
  );

  const BadgeStatisticsData = await BadgeStatisticsRes.data || [];
  return {
    props: {
      BadgeStatisticsData,
    }
  }
}

