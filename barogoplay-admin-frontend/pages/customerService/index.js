import Layout from '@/components/Layout/Layout'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import BasicTable from '@/components/TableBox/BasicTable'
import Button from '@/components/Button/Button'
import { communityPostListDownload } from '@/components/utils/communityPostListDownload'
import { useRouter } from 'next/router';

export default function CustomerService(props) {
  const { customerServiceData } = props;
  const router = useRouter();
  console.log("고객센터 데이터", customerServiceData)
  return (
    <div className="basicBox maxWidth100">
      <BasicTable
        data={customerServiceData}
        filterCategory="customerService"
        filterListSet={["writeDate"]}
        filterSearchSet={["userCode", "authorNickname",]}
        itemDetail={true}
        addButton={
          <Button variantStyle="border" sizeStyle="sm" onClick={() => communityPostListDownload("customerService", router.query)}>게시글 목록 다운</Button>
        }
      />
    </div>
  )
}

CustomerService.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const queryUrl = queryString(FilterDataSet("customerService", context.query));

  const customerServiceRes = await serverSideGetApi(
    `/api/boards/qna/posts?${queryUrl}`,
    accessToken,
    refreshToken,
    context
  );
  const customerServiceData = await customerServiceRes.data || [];

  return {
    props: {
      customerServiceData,
    },
  };

}