import SubNav from '@/components/SubNav/SubNav';
import BasicTable from '@/components/TableBox/BasicTable';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi';
import { FilterDataSet } from '@/components/utils/FilterDataSet';
import { queryString } from '@/components/utils/queryString';
import Layout from '@/components/Layout/Layout';
import { useRouter } from 'next/router';

export default function GiftMessageSendingHistory(props) {
  const { giftMessageOrdersData } = props;
  console.log(giftMessageOrdersData, 'giftMessageOrdersData')
  const router = useRouter();

  return (
    <div className='basicBox maxWidth100'>
      <SubNav />
      <BasicTable
        filterCategory="giftMessageOrders"
        data={giftMessageOrdersData}
        filterListSet={[
          "received",
        ]}
        filterSearchSet={["templateId"]}
        downOnOff={true}
      // itemDetail={true}
      />
    </div>
  )
}

GiftMessageSendingHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}



export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const queryUrl = queryString(FilterDataSet("giftMessageOrders", context.query));
  const giftMessageOrdersRes = await serverSideGetApi(`/api/gifts/orders?${queryUrl}`, accessToken, refreshToken, context)
  const giftMessageOrdersData = await giftMessageOrdersRes.data || []

  return {
    props: {
      giftMessageOrdersData,
    }
  }
}