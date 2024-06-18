import SubNav from '@/components/SubNav/SubNav'
import BasicTable from '@/components/TableBox/BasicTable'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import Layout from '@/components/Layout/Layout';

export default function CommunityNoticePage(props) {
  const { boardNoticeData } = props;
  console.log(props)
  return (
    <div className='basicBox maxWidth100'>
      <SubNav />
      <BasicTable
        filterCategory="communityNotice"
        data={boardNoticeData}
        // downOnOff={true}
        // checkOnOff={true}
        itemDetail={true}
        filterListSet={[
          "boardCode",
          "writeDate",
          "hidden",
          "containFile",
          "containVote",
          "containDeleted"
        ]}
        filterSearchSet={[
          "id",
          "title",
          "authorNickname",
          "userCode",
          "hashtags",
        ]}
        defaultViewCount={10}
      />
    </div>
  )
}

CommunityNoticePage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const query = context.query;
  const boardCode = query.boardCode || "free";
  const queryUrl = queryString(FilterDataSet("communityNotice", query));


  const boardNoticeRes = await serverSideGetApi(
    `/api/boards/${boardCode}/notices?${queryUrl}`,
    accessToken,
    refreshToken,
    context
  );
  const boardNoticeData = await boardNoticeRes.data || [];

  return {
    props: {
      boardNoticeData,
    },
  };
}