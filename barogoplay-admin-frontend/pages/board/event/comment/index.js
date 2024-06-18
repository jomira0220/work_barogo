import SubNav from '@/components/SubNav/SubNav'
import BasicTable from '@/components/TableBox/BasicTable'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import Layout from '@/components/Layout/Layout';
export default function EventCommentPage(props) {
  const { eventCommentData } = props;
  console.log("관리자 게시판 댓글 목록", props)
  return (
    <div className='basicBox maxWidth100'>
      <SubNav />
      <BasicTable
        filterCategory="eventComment"
        data={eventCommentData}
        downOnOff={true}
        // checkOnOff={true}
        itemDetail={true}
        filterListSet={[
          "boardCode",
          "writeDate",
          "containDeleted"
        ]}
        filterSearchSet={[
          "id",
          "userId",
          "authorNickname",
          "content"
        ]}
      />
    </div>
  )
}

EventCommentPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const query = context.query;
  const boardCode = query.boardCode || "event";
  const queryUrl = queryString(FilterDataSet("eventComment", query));

  const eventCommentRes = await serverSideGetApi(
    `/api/boards/${boardCode}/comments?${queryUrl}`,
    accessToken,
    refreshToken,
    context
  );
  const eventCommentData = await eventCommentRes.data || [];

  return {
    props: {
      eventCommentData,
    },
  };
}