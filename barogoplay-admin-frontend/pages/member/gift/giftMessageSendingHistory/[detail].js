
import styles from './../gift.module.scss'
import GiftTemplate from '@/components/GiftTemplate/GiftTemplate'
import { FormWarp, SentTarget, SentContent, SentInput, SentDate } from '@/components/FormSet/FormSet'
import Layout from '@/components/Layout/Layout';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'

export default function GiftMessageSendingHistoryDetail(props) {

  const { detailType, giftMessageSendCompleteData } = props;

  const giftProduct = giftMessageSendCompleteData.templateInfo.product
  const templateData = giftMessageSendCompleteData.templateInfo

  const GiftTemplateForm = {
    "템플릿명": templateData.templateName,
    "템플릿 ID": templateData.templateTraceId,
    "브랜드명": giftProduct.brandName,
    "상품명": giftProduct.productName,
    "상품 가격": giftProduct.productPrice.toLocaleString("ko-KR") + "원",
    "발송가능 시작 일시": templateData.startAt ? templateData.startAt.slice(2, 8).replace(/\B(?<!\.\d*)(?=(\d{2})+(?!\d))/g, ".") : "없음",
    "발송가능 종료 일시": templateData.endAt ? templateData.endAt.slice(2, 8).replace(/\B(?<!\.\d*)(?=(\d{2})+(?!\d))/g, ".") : "없음",
    "템플릿 상태": templateData.orderTemplateStatus,
    "발송 한도 수량": templateData.giftBudgetCount,
    "발송 가능 수량": templateData.giftStockCount,
    "기발송 수량": templateData.giftSentCount,
  }

  return (
    <div className='basicBox'>
      <h2>선물 메세지 발송 내역 상세</h2>
      <div className={styles.giftTemplate}>
        <GiftTemplate templateData={GiftTemplateForm} />
      </div>
      <FormWarp>
        {/* <SentTarget FileView={target} limitCount={GiftTemplateForm["발송 가능 수량"]} readOnly /> */}
        <SentInput
          title="제목"
          type="text"
          value={subject}
          name='giftMessageSubject'
          readOnly
        />
        <SentContent
          title="내용"
          maxLength="30"
          value={content}
          name='giftMessageContent'
          readOnly
        />
        <SentDate
          title="예약시간"
          dateFormat='yyyy.MM.dd HH:mm'
          selected={new Date(reservationDate)}
          showTimeInput
          minDate={new Date(reservationDate)} // !오늘 이전 날짜 선택 불가
          maxDate={new Date(reservationDate)} // !오늘 이전 날짜 선택 불가
          disabledKeyboardNavigation
          readOnly
        />

      </FormWarp>
    </div>
  )
}

GiftMessageSendingHistoryDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}


export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = await getToken(context);
  const { detailId, detailType } = context.query

  // 선물 메시지 발송 완료 데이터
  const giftMessageSendCompleteRes = await serverSideGetApi(`/api/gifts/reserved/${detailId}`, accessToken, refreshToken, context)
  const giftMessageSendCompleteData = await giftMessageSendCompleteRes.data || []

  return {
    props: {
      detailId,
      detailType,
      giftMessageSendCompleteData
    }
  }
}