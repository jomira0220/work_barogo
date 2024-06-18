
import Button from '@/components/Button/Button'
import { useRouter } from 'next/router';
import SubNav from '@/components/SubNav/SubNav'
import BasicTable from '@/components/TableBox/BasicTable'
import { serverSideGetApi, getToken } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import Layout from '@/components/Layout/Layout';

export default function BadgeManagement(props) {
  const { badgeData } = props;
  const router = useRouter();
  console.log("badgeData", badgeData)

  return (
    <div className='basicBox maxWidth100'>
      <SubNav />
      <Button
        style={{ float: "right", marginBottom: "25px" }}
        variantStyle="color"
        sizeStyle="sm"
        onClick={() => router.push("/activity/badge/newBadge")}>
        배지 신규 등록
      </Button>
      <BasicTable
        filterCategory="badgeManagement"
        data={badgeData}
        // checkOnOff={true}
        itemDetail={true}
        filterSearchSet={[
          "id", "name", "description",
          "conditionDescription", "conditionType",
          "targetCompany"
          // ,"updatedBy"
        ]}
      />

    </div >
  )
}


BadgeManagement.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { refreshToken, accessToken } = getToken(context);
  const queryUrl = queryString(FilterDataSet("badgeManagement", context.query));
  const badgeRes = await serverSideGetApi(
    `/api/badges?${queryUrl}`,
    accessToken, refreshToken, context);
  const badgeData = await badgeRes.data || [];
  return {
    props: {
      badgeData
    }, // will be passed to the page component as props
  }
}
