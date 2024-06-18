
import BasicTable from '@/components/TableBox/BasicTable'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import Layout from '@/components/Layout/Layout';

export default function PointManagement(props) {
  const { pointData } = props;
  console.log("pointData", pointData)

  return (
    <div className="basicBox">
      <BasicTable
        filterCategory="pointManagement"
        data={pointData}
        filterListSet={[
          "pointGetPeriod",
        ]}
        filterSearchSet={[
          "userId"
        ]}
      />
    </div>
  )
}


PointManagement.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { refreshToken, accessToken } = getToken(context);

  const queryUrl = queryString(FilterDataSet("pointManagement", context.query))
  const pointRes = await serverSideGetApi(
    `/api/points?${queryUrl}`,
    accessToken, refreshToken, context);

  const pointData = await pointRes.data || [];
  return {
    props: {
      pointData
    }
  }
}