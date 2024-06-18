import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import Layout from '@/components/Layout/Layout'
import BoardPostDetail from '@/components/BoardPostDetail';

export default function CommunityPostDetail(props) {
  return (
    <BoardPostDetail {...props} />
  );
}

CommunityPostDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}


export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  const { boardName, detailId, page, size } = context.query;

  const detailBoardName = boardName; //게시판 이름
  const sizeNum = size ? size : 20; //댓글 페이지당 갯수
  const commentPage = page ? page : 0; //댓글 페이지

  const detailConRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}`, accessToken, refreshToken, context);
  const commentRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}/comments?page=${commentPage}&size=${sizeNum}`, accessToken, refreshToken, context);
  const voteRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}/votes`, accessToken, refreshToken, context);
  const hashTagRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}/hashtags`, accessToken, refreshToken, context);

  const detailData = (await detailConRes.data) || null;
  const commentDataProps = (await commentRes.data) || null;
  const voteData = (await voteRes.data) || null;
  const hashTagData = (await hashTagRes.data) || null;

  return {
    props: {
      detailBoardName,
      detailData,
      commentDataProps,
      voteData,
      hashTagData,
      commentPage,
    },
  };
};

