import SubNav from '@/components/SubNav/SubNav'
import SearchBox from '@/components/SearchBox/SearchBox'
import styles from './../gift.module.scss'
import Button from '@/components/Button/Button'
import { RefreshIcon } from '@/components/Icon/Icon'
import BasicTable from '@/components/TableBox/BasicTable'
import { useRouter } from 'next/router'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import Layout from '@/components/Layout/Layout';
import Apis from '@/components/utils/Apis'

export default function GiftList(props) {

  const { giftTemplateData, giftMessageReservedData, giftMessageSendCompleteData } = props;
  console.log("선물 리스트 데이터", props)

  const router = useRouter()

  //! 선물 템플릿 토큰 등록  
  const setTemplateId = async (value) => {
    const giftTemplate = await Apis.post('/api/gifts/templates', { templateToken: value })
    console.log("템플릿 등록 api", giftTemplate)
    if (giftTemplate.status === 200) {
      alert('템플릿 등록이 완료되었습니다.')
      router.reload()
    } else {
      alert('템플릿 등록에 실패하였습니다.')
    }
    console.log(giftTemplate)
  }

  //! 신규 선물메시지 생성
  const newGiftMessage = (e) => {
    const checkListStringValue = e.currentTarget.dataset.checklist;
    if (checkListStringValue === "EXPIRED") {
      alert('만료된 템플릿은 신규 선물메시지 생성을 할 수 없습니다.')
      return
    } else if (checkListStringValue === undefined) {
      alert('선택된 템플릿이 없습니다.')
      return
    } else if (checkListStringValue.includes(",")) {
      alert('선택된 템플릿이 1개 이상이면 신규 선물메시지 생성을 할 수 없습니다.')
      return
    }
    const templateId = checkListStringValue
    router.push(`/member/gift/newGift?templateId=${templateId}`)
  }


  //! 선물메시지 예약 취소
  const giftReservedDelete = async (e) => {
    const checkListStringValue = e.currentTarget.dataset.checklist
    if (checkListStringValue === undefined) {
      alert('선택된 선물메시지가 없습니다.')
      return
    } else if (checkListStringValue.includes(",")) {
      alert('선택된 선물메시지가 1개 이상이면 예약 취소를 할 수 없습니다.')
      return
    }

    const giftReservedId = checkListStringValue
    const giftMessageReserved = await Apis.delete(`/api/gifts/reserved/${giftReservedId}`)
    console.log("선물 예약 취소 api", giftMessageReserved)
    if (giftMessageReserved.status === 200 && giftMessageReserved.data.status === 'success') {
      alert('선물메시지 예약이 취소되었습니다.')
      router.replace()
    } else {
      alert('선물메시지 예약 취소에 실패하였습니다. 사유 : ' + giftMessageReserved.data.message)
    }
  }


  return (
    <div className={styles.giftList}>
      <div className='basicBox maxWidth100'>
        <SubNav />
        <h3>선물 템플릿 리스트</h3>
        <div className={styles.control}>
          <SearchBox
            className={styles.tokenRegistration}
            placeholder="템플릿 토큰 등록"
            buttonText="등록"
            onClick={(value) => { setTemplateId(value) }}
          />
        </div>
        <BasicTable
          filterCategory="giftTemplate"
          data={giftTemplateData}
          checkOnOff={true}
          itemDetail={true}
          addButton={
            <>
              <Button
                className="listCheckBtn"
                sizeStyle="sm"
                variantStyle="color"
                onClick={(e) => newGiftMessage(e)}
              >
                신규 선물메시지 생성
              </Button>
              <Button
                sizeStyle="sm"
                variantStyle="darkgray"
                onClick={() => router.reload()}
              >
                <RefreshIcon /><span className='blind'>리프레시</span>
              </Button>
            </>
          }
        />
      </div>
      <div className='basicBox maxWidth100'>
        <div className={styles.control}>
          <h3>선물 메시지 발송 대기</h3>
        </div>
        <BasicTable
          filterCategory="giftMessageReserved"
          data={giftMessageReservedData}
          checkOnOff={true}
          itemDetail={true}
          addButton={
            <Button className="listCheckBtn" sizeStyle="sm" variantStyle="color" onClick={(e) => giftReservedDelete(e)}>선물 메시지 예약 취소</Button>
          }
        />
      </div>
      <div className='basicBox maxWidth100'>
        <h3>선물 메시지 발송 완료</h3>
        <BasicTable
          filterCategory="giftMessageSendComplete"
          data={giftMessageSendCompleteData}
          itemDetail={true}
        />
      </div>
    </div>
  )
}

GiftList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = getToken(context)

  const queryUrl1 = queryString(FilterDataSet("giftTemplate", context.query));
  const queryUrl2 = queryString(FilterDataSet("giftMessageReserved", context.query));
  const queryUrl3 = queryString(FilterDataSet("giftMessageSendComplete", context.query));

  const giftTemplate = await serverSideGetApi(`/api/gifts/templates?${queryUrl1}`, accessToken, refreshToken, context)
  const giftMessageReserved = await serverSideGetApi(`/api/gifts/reserved?${queryUrl2}`, accessToken, refreshToken, context)
  const giftMessageSendComplete = await serverSideGetApi(`/api/gifts/reserved?${queryUrl3}`, accessToken, refreshToken, context)

  let giftTemplateData = await giftTemplate.data || []
  let giftMessageReservedData = await giftMessageReserved.data || []
  let giftMessageSendCompleteData = await giftMessageSendComplete.data || []

  return {
    props: {
      giftTemplateData,
      giftMessageReservedData,
      giftMessageSendCompleteData
    }
  }

}