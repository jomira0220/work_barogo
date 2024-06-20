import BasicTable from '@/components/TableBox/BasicTable'
import Layout from '@/components/Layout/Layout';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { queryString } from '@/components/utils/queryString'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { communityPostListDownload } from '@/components/utils/communityPostListDownload'
import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';

export default function SystemNotice(props) {
  const router = useRouter();
  const { systemNoticeData } = props;
  console.log("플레이 운영 공지 페이지", props)
  return (
    <div className='basicBox maxWidth100'>
      <BasicTable
        data={systemNoticeData}
        filterCategory='systemNotice'
        itemDetail={true}
        filterSearchSet={["id", "title"]}
        addButton={
          <Button variantStyle="border" sizeStyle="sm" onClick={() => communityPostListDownload("systemNotice", router.query)}>게시글 목록 다운</Button>
        }
      />
    </div>
  )
}

SystemNotice.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const queryUrl = queryString(FilterDataSet("systemNotice", context.query));
  const systemNoticeRes = await serverSideGetApi(`/api/boards/system/posts?${queryUrl}`, accessToken, refreshToken, context);
  const systemNoticeData = await systemNoticeRes.data || [];

  return {
    props: {
      systemNoticeData
    }
  }

}