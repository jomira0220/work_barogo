import SubNav from '@/components/SubNav/SubNav'
import BasicTable from '@/components/TableBox/BasicTable'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { queryString } from '@/components/utils/queryString'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import Layout from '@/components/Layout/Layout';
import Button from '@/components/Button/Button';
import { useRouter } from 'next/router';
import { communityPostListDownload } from '@/components/utils/communityPostListDownload'


export default function CommunityPostPage(props) {
  const router = useRouter();
  const { boardPostData } = props;
  console.log("커뮤니티 게시글 데이터", props)

  return (
    <div className='basicBox maxWidth100'>
      <SubNav />
      <BasicTable
        filterCategory="communityPost"
        data={boardPostData}
        // checkOnOff={true}
        itemDetail={true}
        filterListSet={[
          "boardCode",
          "writeDate",
          "likeCountUpper",
          "containFile",
          "containVote",
          "containDeleted"
        ]}
        filterSearchSet={[
          "id",
          "boardName",
          "title",
          "authorNickname",
          "hashtag",
          "userCode"
        ]}
        addButton={
          <Button variantStyle="border" sizeStyle="sm" onClick={() => communityPostListDownload("communityPost", router.query)}>게시글 목록 다운</Button>
        }
      />
    </div>
  )
}


CommunityPostPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const query = context.query;
  const boardCode = query.boardCode || "free";
  const queryUrl = queryString(FilterDataSet("communityPost", query));

  const boardPostRes = await serverSideGetApi(`/api/boards/${boardCode}/posts?${queryUrl}`, accessToken, refreshToken, context);
  const boardPostData = await boardPostRes.data || [];

  return {
    props: {
      boardPostData,
    },
  };
}