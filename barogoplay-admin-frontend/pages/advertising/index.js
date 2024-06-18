import BasicTable from '@/components/TableBox/BasicTable'
import Button from '@/components/Button/Button'
import Layout from '@/components/Layout/Layout'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { queryString } from '@/components/utils/queryString'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import Apis from '@/components/utils/Apis'

export default function Marketing(props) {
  const { advertisingData } = props;
  console.log("배너관리 페이지", advertisingData)

  const AdvertisingDelete = async (e) => {
    const confirmCheck = confirm('선택한 배너를 삭제하시겠습니까?');
    if (!confirmCheck) return false;
    const getId = e.target.getAttribute('data-checklist');
    const idList = getId.includes(',') ? getId.split(',').join('&idList=') : getId;
    const advertisingDelRes = await Apis.delete(`/api/advertisements?idList=${idList}`);
    console.log(advertisingDelRes)
    if (advertisingDelRes.status === 200) {
      alert('삭제되었습니다.');
      location.reload();
    }
  }

  return (
    <div className='basicBox maxWidth100'>
      <BasicTable
        data={advertisingData}
        downOnOff={true}
        checkOnOff={true}
        filterCategory="advertising"
        filterListSet={["advertisingDate", "isEnabled", "type"]}
        addButton={
          <>
            <Button variantStyle="border" sizeStyle="sm" onClick={() => location.href = "/advertising/newAdvertising"}>배너 신규 등록</Button>
            <Button className="listCheckBtn" variantStyle="darkgray" sizeStyle="sm" onClick={(e) => AdvertisingDelete(e)}>배너 삭제</Button>
          </>
        }
        filterSearchSet={["name"]}
        itemDetail={true}
      />
    </div>
  )
}

Marketing.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const queryUrl = queryString(FilterDataSet("advertising", context.query));
  // console.log(queryUrl)

  const advertisingRes = await serverSideGetApi(`/api/advertisements?${queryUrl}`, accessToken, refreshToken, context);
  const advertisingData = await advertisingRes.data || null;

  return {
    props: {
      advertisingData
    }
  }

}
