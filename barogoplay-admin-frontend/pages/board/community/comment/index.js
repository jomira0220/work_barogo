import SubNav from '@/components/SubNav/SubNav'
import BasicTable from '@/components/TableBox/BasicTable'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import Layout from '@/components/Layout/Layout';


export default function CommunityCommentPage(props) {
  const { boardCommentData } = props;
  console.log(props)
  return (
    <div className='basicBox maxWidth100'>
      <SubNav />
      <BasicTable
        filterCategory="communityComment"
        data={boardCommentData}
        filterListSet={[
          "boardCode",
          "writeDate",
          "containDeleted"
        ]}
        filterSearchSet={[
          "id",
          "authorNickname",
          "userId",
          "content"
        ]}
        defaultViewCount={10}
        itemDetail={true}
      />
    </div>
  )
}

CommunityCommentPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const query = context.query;
  const boardCode = query.boardCode || "free";
  const queryUrl = queryString(FilterDataSet("communityComment", query));


  const boardCommentRes = await serverSideGetApi(
    `/api/boards/${boardCode}/comments?${queryUrl}`,
    accessToken,
    refreshToken,
    context
  );
  const boardCommentData = await boardCommentRes.data || [];

  return {
    props: {
      boardCommentData,
    },
  };
}