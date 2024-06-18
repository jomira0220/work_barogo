import BasicTable from '@/components/TableBox/BasicTable';
import Button from '@/components/Button/Button';
import Layout from '@/components/Layout/Layout';
import SubNav from '@/components/SubNav/SubNav';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi';
import { FilterDataSet } from '@/components/utils/FilterDataSet';
import { queryString } from '@/components/utils/queryString';
import Apis from '@/components/utils/Apis';
import { useRouter } from 'next/router';
import { communityPostListDownload } from '@/components/utils/communityPostListDownload';

export default function HidingPost(props) {
  const { hiddenData } = props;
  const router = useRouter();
  console.log(props)

  //! 숨김해제 버튼 클릭시
  const CancelHide = async (e) => {
    let cancelHiddenIdList = e.target.getAttribute('data-checklist')
    if (cancelHiddenIdList && cancelHiddenIdList.includes(',')) {
      cancelHiddenIdList = cancelHiddenIdList.split(',')
    } else {
      cancelHiddenIdList = [cancelHiddenIdList]
    }

    const cancelIdQuery = cancelHiddenIdList.map((item) => { return `postIds=${item}` }).join('&')
    console.log(cancelIdQuery)

    if (cancelHiddenIdList) {

      const cancelHideRes = await Apis.put(`/api/boards/all/posts/cancelhide?${cancelIdQuery}`)
      console.log(cancelHideRes)
      if (cancelHideRes.status === 200 && cancelHideRes.data.status === "success") {
        alert('숨김해제가 완료되었습니다.')
        router.reload()
      } else {
        alert('숨김해제에 실패하였습니다.')
      }

    } else {
      alert('숨김해제할 게시글을 선택해주세요.')
    }
  }

  return (
    <div className='basicBox maxWidth100'>
      <SubNav />
      <BasicTable
        filterCategory="hidingPost"
        data={hiddenData}
        downOnOff={true}
        checkOnOff={true}
        itemDetail={true}
        filterListSet={[
          "boardCode",
          "writeDate",
          "hiddenDate",
        ]}
        filterSearchSet={[
          "all",
          "boardCode",
          "authorCode",
          "authornickname",
          "hidingHandler"
        ]}
        addButton={
          <>
            <Button variantStyle="color" sizeStyle="sm" className="listCheckBtn" onClick={(e) => CancelHide(e)}>숨김 해제</Button>
            <Button variantStyle="border" sizeStyle="sm" onClick={() => communityPostListDownload("hidingPost", router.query)}>게시글 목록 다운</Button>
          </>
        }
      />
    </div>
  )
}

HidingPost.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const query = context.query;
  const queryUrl = queryString(FilterDataSet("hidingPost", query));
  const hiddenRes = await serverSideGetApi(`/api/boards/${query.boardCode ? query.boardCode : "free"}/posts/hidden?${queryUrl}`, accessToken, refreshToken, context);
  const hiddenData = await hiddenRes.data || [];

  return {
    props: {
      hiddenData
    }
  }
}