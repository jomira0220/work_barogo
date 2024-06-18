import SubNav from '@/components/SubNav/SubNav';
import BasicTable from '@/components/TableBox/BasicTable';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi';
import Layout from '@/components/Layout/Layout';
import { FilterDataSet } from '@/components/utils/FilterDataSet';
import { queryString } from '@/components/utils/queryString';


export default function MessageSendingHistory(props) {
  const { messageData } = props;
  console.log("messageData", messageData)
  return (
    <div className='basicBox'>
      <SubNav />
      <BasicTable
        filterCategory="messageSendingHistory"
        data={messageData}
        filterListSet={[
          "isConfirmed",
        ]}
        filterSearchSet={[
          "notificationId"
        ]}
        itemDetail={true}
      />
    </div>
  )
}

MessageSendingHistory.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = getToken(context);
  const queryUrl = queryString(FilterDataSet("messageSendingHistory", context.query));
  const messageRes = await serverSideGetApi(
    `/api/notifications/history?${queryUrl}`,
    accessToken,
    refreshToken,
    context,
  );

  console.log(queryUrl)

  const messageData = await messageRes.data || [];

  return {
    props: {
      messageData,
    },
  };
}