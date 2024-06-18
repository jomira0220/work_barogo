
import BasicTable from '@/components/TableBox/BasicTable'
import styles from './../gift.module.scss'
import GiftTemplate from '@/components/GiftTemplate/GiftTemplate'
import { FormWarp, SentTarget, SentContent, SentInput, SentDate } from '@/components/FormSet/FormSet'
import Button from '@/components/Button/Button'
import { useState } from 'react'
import Layout from '@/components/Layout/Layout'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import { LineBasicArrow } from '@/components/Icon/Icon'



export default function GiftListDetail(props) {

  const { templateId, giftTemplateData, giftTemplateDetailData, detailType, giftMessageSendCompleteData } = props;

  console.log(props)

  const [startDate, setStartDate] = useState(new Date());
  const [FileView, setFileView] = useState();
  //{ fileName: "", data: { processedUserIdList: [], count: 0, repeatedUsers: { count: 0 }, unExistUsers: { count: 0 } }, type: "api" }

  // !선물 메시지 수정하기
  const handleSubmit = (e) => {
    const targetValue = document.querySelector('[name="messageTarget"]:checked').value;
    const data = {
      giftMessageSubject: document.querySelector('[name="giftMessageSubject"]').value,
      giftMessageContent: document.querySelector('[name="giftMessageContent"]').value,
      giftMessageTarget: targetValue === "selectMember" ? FileView.data.map((item) => item[0]) : "allMember",
      giftMessageDate: startDate.toISOString(),
    }
    if (data.giftMessageSubject === "") {
      alert("사용자에게 노출할 제목을 입력해주세요");
    } else if (data.giftMessageContent === "") {
      alert("사용자에게 노출할 내용을 입력해주세요");
    } else if (targetValue === "selectMember" && data.giftMessageTarget.length > GiftTemplateForm["발송 가능 수량"]) {
      alert("발송 가능 수량을 초과하였습니다.");
    }
    console.log('data', data);
  }


  const giftProduct = giftTemplateDetailData ? giftTemplateDetailData.product : giftMessageSendCompleteData.templateInfo.product
  const templateData = giftTemplateDetailData ? giftTemplateDetailData : giftMessageSendCompleteData.templateInfo
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

  const ToggleTableBox = (e) => {
    e.currentTarget.children[1].classList.toggle(styles.active)
  }

  return (
    <div className={styles.giftListDetail}>
      {
        detailType === "giftTemplate" && (
          <>
            <div className='basicBox'>
              <h2>선물 템플릿 상세</h2>
              <GiftTemplate templateData={GiftTemplateForm} />
            </div>
            <div className='basicBox'>
              <div className={styles.topArea}>
                <h3>선물 템플릿 리스트</h3>
                <p>리스트 클릭시 템플릿 내용을 바로 자세히 볼 수 있습니다.</p>
              </div>
              <BasicTable
                filterCategory="giftTemplate"
                data={giftTemplateData}
                filterSearchSet={[
                  "all",
                  "templateId",
                  "templateName",
                  "templateBrand",
                  "productName",
                ]}
                itemDetail={true}
              />
            </div>
          </>
        )
      }
      {
        detailType === "giftMessageSendWait" && (
          <div className='basicBox'>
            <h2>선물 메시지 발송 대기 상세</h2>
            <FormWarp>
              <GiftTemplate templateData={GiftTemplateForm} />
              <SentTarget FileView={FileView} setFileView={setFileView} limitCount={GiftTemplateForm["발송 한도 수량"]} />
              <SentInput
                title="제목"
                type="text"
                placeholder='제목을 입력해주세요'
                name='giftMessageSubject'
                defaultValue={subject}
              />

              <SentContent
                placeholder='사용자에게 노출할 내용을 입력해주세요'
                maxLength="30"
                name='giftMessageContent'
                defaultValue={content}
              />

              <SentDate
                title="예약발송"
                dateFormat='yyyy.MM.dd HH:mm'
                selected={startDate}
                showTimeInput
                minDate={new Date()} // !오늘 이전 날짜 선택 불가
                onChange={(date) => setStartDate(date)}
                name='newMessageDate'
                disabledKeyboardNavigation
              />
              <Button variantStyle="color" sizeStyle="sm" onClick={() => handleSubmit()}>수정하기</Button>
            </FormWarp>
          </div>
        )
      }
      {
        detailType === "giftMessageSendComplete" && (
          <div className='basicBox'>
            <h2>선물 메시지 발송 완료 상세</h2>
            <div className={styles.giftTemplate}>
              <GiftTemplate templateData={GiftTemplateForm} />
            </div>
            <FormWarp>
              <div>
                <h3>발송 대상</h3>
                <div><b>발송 대상</b> : 총 {`${giftMessageSendCompleteData.receiverIdList.length.toLocaleString('ko-KR')}명`}</div>
                <div className={styles.toggleTableBox} onClick={(e) => ToggleTableBox(e)}>
                  <h4>발송된 회원리스트<LineBasicArrow color="var(--play-color-1)" /></h4>
                  {
                    giftMessageSendCompleteData.receiverIdList.length > 0 && (
                      <div className={styles.viewTableStyle}>
                        <div className={styles.viewTableInner}>
                          <table>
                            <thead>
                              <tr>
                                <th>번호</th>
                                <th>회원ID</th>
                              </tr>
                            </thead>
                            <tbody>
                              {giftMessageSendCompleteData.receiverIdList.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td key={index}>{item}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
              <SentInput
                title="제목"
                inputInfo="*사용자에게 노출되는 항목입니다."
                type="text"
                value={giftMessageSendCompleteData.title}
                name='giftMessageSubject'
                readOnly
              />
              <SentContent
                title="내용"
                inputInfo="*사용자에게 노출되는 항목입니다."
                maxLength="30"
                value={giftMessageSendCompleteData.message}
                name='giftMessageContent'
                readOnly
              />
              <SentDate
                title="예약시간"
                dateFormat='yyyy.MM.dd HH:mm'
                selected={new Date(giftMessageSendCompleteData.reservedDate)}
                minDate={giftMessageSendCompleteData.reservedDate} // !오늘 이전 날짜 선택 불가
                maxDate={giftMessageSendCompleteData.reservedDate} // !오늘 이전 날짜 선택 불가
                disabledKeyboardNavigation
                readOnly
                showTimeInput
              />

            </FormWarp>
          </div>
        )
      }
    </div>
  )
}

GiftListDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);

  let { templateId, detailType, detailId } = context.query
  if (templateId && detailType) {
    // 선물 템플릿 데이터
    const queryUrl1 = queryString(FilterDataSet("giftTemplate", context.query));
    const giftTemplate = await serverSideGetApi(`/api/gifts/templates?${queryUrl1}`, accessToken, refreshToken, context)
    let giftTemplateData = await giftTemplate.data || []

    // 선물 템플릿 상세 데이터
    const giftTemplateDetail = await serverSideGetApi(`/api/gifts/templates/${templateId}/detail`, accessToken, refreshToken, context)
    const giftTemplateDetailData = await giftTemplateDetail.data || []

    return {
      props: {
        templateId,
        giftTemplateData,
        giftTemplateDetailData,
        detailType
      }
    }
  }

  // 선물 메시지 발송 완료 데이터
  const giftMessageSendCompleteRes = await serverSideGetApi(`/api/gifts/reserved/${detailId}`, accessToken, refreshToken, context)
  const giftMessageSendCompleteData = await giftMessageSendCompleteRes.data || []

  return {
    props: {
      detailType,
      giftMessageSendCompleteData
    }
  }



}