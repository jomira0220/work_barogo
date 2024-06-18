import SubNav from '@/components/SubNav/SubNav'
import BasicTable from '@/components/TableBox/BasicTable'
import Button from '@/components/Button/Button'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import Layout from '@/components/Layout/Layout';
import Apis from '@/components/utils/Apis';
import { useRouter } from 'next/router';
import { communityPostListDownload } from '@/components/utils/communityPostListDownload'

export default function EventPostPage(props) {
  const { eventPostData } = props;
  const router = useRouter();

  console.log("관리자 게시판 게시글 목록", props)

  // 숨김처리 버튼 클릭시
  const PostHiddenHandler = async (e) => {
    let hiddenIdList = e.target.getAttribute('data-checklist')
    if (hiddenIdList && hiddenIdList.includes(',')) {
      alert('숨김 처리할 게시글을 하나만 선택해주세요.')
      return
    }
    if (hiddenIdList) {
      const hideResList = hiddenIdList.map(async (item) => {
        const boardCode = document.querySelector("[name='boardCode']:checked").value
        const hideRes = await Apis.put(`/api/boards/${boardCode}/posts/${item}/hide`)
        console.log(hideRes)
        if (hideRes.status === 200 && hideRes.data.status === "success") {
          alert('숨김처리가 완료되었습니다.')
        } else {
          alert('숨김처리에 실패하였습니다.')
        }
      })
    } else {
      alert('숨김처리할 게시글을 선택해주세요.')
    }
  }


  return (
    <div className='basicBox maxWidth100'>
      <SubNav />
      <BasicTable
        filterCategory="eventPost"
        data={eventPostData}
        downOnOff={true}
        checkOnOff={true}
        itemDetail={true}
        filterListSet={
          router.query.boardCode === "event" ? [
            "boardCode",
            "writeDate",
            "ongoing",
            "containFile",
            "containVote",
            "containDeleted"
          ] : [
            "boardCode",
            "writeDate",
            "containDeleted"
          ]}
        filterSearchSet={[
          "id",
          "authorNickname",
          "title",
          "userCode",
          "hashtag",
        ]}
        addButton={
          <>
            <Button
              variantStyle="color"
              sizeStyle="sm"
              className="listCheckBtn"
              onClick={(e) => PostHiddenHandler(e)}>
              숨김처리
            </Button>
            <Button variantStyle="border" sizeStyle="sm" onClick={() => communityPostListDownload("eventPost", router.query)}>게시글 목록 다운</Button>
          </>
        }
      />
    </div>
  )
}

EventPostPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}



export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const query = context.query;
  const boardCode = query.boardCode || "event";
  const queryUrl = queryString(FilterDataSet("eventPost", query));

  console.log(queryUrl)
  const eventPostRes = await serverSideGetApi(
    `/api/boards/${boardCode}/posts?${queryUrl}`,
    accessToken,
    refreshToken,
    context
  );
  const eventPostData = await eventPostRes.data || [];

  return {
    props: {
      eventPostData,
    },
  };
}