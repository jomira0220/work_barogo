import BasicTable from '@/components/TableBox/BasicTable';
import Button from '@/components/Button/Button';
import Layout from '@/components/Layout/Layout';
import SubNav from '@/components/SubNav/SubNav';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi';
import { FilterDataSet } from '@/components/utils/FilterDataSet';
import { queryString } from '@/components/utils/queryString';
import Apis from '@/components/utils/Apis';
import { useRouter } from 'next/router';



export default function HidingComment(props) {
  const router = useRouter();
  const { hiddenData, boardCode } = props;
  console.log(props)

  const CancelHide = async (e) => {
    let cancelHiddenId = e.target.dataset.checklist
    if (cancelHiddenId && cancelHiddenId.includes(',')) {
      alert('하나의 댓글만 선택해주세요.')
      return
    }

    if (cancelHiddenId) {
      const postId = hiddenData.content.filter((item) => item.id === Number(cancelHiddenId))[0].postId
      const cancelHideRes = await Apis.put(`/api/boards/${boardCode}/posts/${postId}/comment/${cancelHiddenId}/cancelhide`)

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
        filterCategory="hidingComment"
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
        defaultViewCount={10}
        addButton={
          <Button className="listCheckBtn" variantStyle="border" sizeStyle="sm" onClick={(e) => CancelHide(e)}>
            숨김 해제
          </Button>
        }
      />
    </div>
  )
}

HidingComment.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const query = context.query;
  let boardCode = query.boardCode ? query.boardCode : "free";
  const queryUrl = queryString(FilterDataSet("hidingComment", query));
  const hiddenRes = await serverSideGetApi(`/api/boards/${boardCode}/comments/hidden?${queryUrl}`, accessToken, refreshToken, context);
  const hiddenData = await hiddenRes.data || [];

  return {
    props: {
      boardCode,
      hiddenData,
    }
  }
}
