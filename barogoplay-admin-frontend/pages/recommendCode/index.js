import Layout from '@/components/Layout/Layout'
import BasicTable from '@/components/TableBox/BasicTable'
import Button from '@/components/Button/Button'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { queryString } from '@/components/utils/queryString'
import { FilterDataSet } from '@/components/utils/FilterDataSet'

export default function RecommendCode(props) {
  const { advertisingData } = props;
  console.log(advertisingData)
  return (
    <div className="basicBox">
      <BasicTable
        data={advertisingData}
        downOnOff={true}
        checkOnOff={true}
        filterCategory="advertising"
        addButton={
          <>
            <Button variantStyle="border" sizeStyle="sm" onClick={() => location.href = "/recommendCode/newRecommendCode"}>추천 코드 신규 등록</Button>
          </>
        }
        // filterSearchSet={["name"]}
        itemDetail={true}
      />
    </div>
  )
}

RecommendCode.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const queryUrl = queryString(FilterDataSet("advertising", context.query));
  // console.log(queryUrl)

  const advertisingRes = await serverSideGetApi(`/api/advertisements?${queryUrl}`, accessToken, refreshToken, context);
  const advertisingData = await advertisingRes.data || null;

  return {
    props: {
      advertisingData
    }
  }

}
