import GiftTemplate from '@/components/GiftTemplate/GiftTemplate'
import {
  Line, FormWarp, SentTarget, SentContent,
  SentInput, SentDate, StyleBox
} from '@/components/FormSet/FormSet'
import { useState } from 'react'
import Button from '@/components/Button/Button'
import Layout from '@/components/Layout/Layout'
import styles from './gift.module.scss'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
// import { stringKrChange } from '@/components/utils/stringKrChange';
import FileInput from "@/components/FileInput/FileInput";
import Apis from '@/components/utils/Apis'
import { useRouter } from 'next/router'

export default function NewGift(props) {

  const router = useRouter();
  const { giftTemplateDetailData } = props;
  const [startDate, setStartDate] = useState(new Date());
  const [FileView, setFileView] = useState(null);
  const [UploadImgUrl, setUploadImgUrl] = useState(giftTemplateDetailData.product.productImageUrl);

  console.log(giftTemplateDetailData)
  const giftProduct = giftTemplateDetailData.product


  const GiftTemplateForm = {
    "템플릿명": giftTemplateDetailData.templateName,
    "템플릿 ID": giftTemplateDetailData.templateTraceId,
    "브랜드명": giftProduct.brandName,
    "상품명": giftProduct.productName,
    "상품 가격": giftProduct.productPrice.toLocaleString("ko-KR") + "원",
    "발송가능 시작 일시": giftTemplateDetailData.startAt.slice(2, 8).replace(/\B(?<!\.\d*)(?=(\d{2})+(?!\d))/g, "."),
    "발송가능 종료 일시": giftTemplateDetailData.endAt.slice(2, 8).replace(/\B(?<!\.\d*)(?=(\d{2})+(?!\d))/g, "."),
    "템플릿 상태": giftTemplateDetailData.orderTemplateStatus,
    "발송 한도 수량": giftTemplateDetailData.giftBudgetCount,
    "발송 가능 수량": giftTemplateDetailData.giftStockCount,
    "기발송 수량": giftTemplateDetailData.giftSentCount,
  }


  // !발송 가능 수량 - api로 받아올 값
  const giftLimitCount = Number(GiftTemplateForm["발송 가능 수량"]);

  // !선물 메시지 등록하기
  const handleSubmit = async (e) => {
    const targetValue = document.querySelector('[name="messageTarget"]:checked').value;
    const targetType = targetValue === "allMember" ? "all" : "savedUsers" // 전체회원 or 저장된 회원리스트 선택
    const targetList = targetValue === "allMember"
      ? "allMember"
      : FileView
        ? FileView.data.processedUserList.map((item) => item.id) // !선택한 멤버 아이디 리스트
        : alert("선택된 회원이 없습니다.");

    const offset = startDate.getTimezoneOffset() * 60000
    const data = {
      // 선포비 템플릿 아이디 추가 필요
      templateId: giftTemplateDetailData.templateTraceId,
      title: document.querySelector('[name="giftMessageSubject"]').value,
      message: document.querySelector('[name="giftMessageContent"]').value,
      targetType: targetType,
      userIdList: targetList,
      image: UploadImgUrl,
      reservedDate: new Date(startDate - offset).toISOString().slice(0, 19)
    }


    if (data.giftMessageSubject === "") {
      alert("사용자에게 노출할 제목을 입력해주세요");
    } else if (data.giftMessageContent === "") {
      alert("사용자에게 노출할 내용을 입력해주세요");
    } else if (targetValue === "selectMember" && data.giftMessageTarget.length > giftLimitCount) {
      alert("발송 가능 수량을 초과하였습니다.");
    }

    console.log('data', data)

    const giftPostRes = await Apis.post("/api/gifts/reserved", data)
    console.log('giftPostRes', giftPostRes)

    if (giftPostRes.data.status === "success") {
      alert("등록이 완료되었습니다.")
      router.push('/member/gift/giftList')
    } else {
      alert(giftPostRes.data.message)
    }

  }




  return (
    <div className={styles.newGiftWrap}>
      <div className='basicBox'>
        <h2>신규 선물 메시지</h2>
        <h3>연결 선포비 템플릿</h3>
        <FormWarp>
          <GiftTemplate templateData={GiftTemplateForm} />
        </FormWarp>
      </div>
      <div className='basicBox'>
        <FormWarp>
          <StyleBox>
            <h3>발송 내용</h3>
            <SentInput
              title="제목"
              inputInfo="*사용자에게 노출되는 항목입니다."
              type="text"
              placeholder='제목을 입력해주세요'
              name='giftMessageSubject' />
            <SentContent
              title="내용"
              inputInfo="*사용자에게 노출되는 항목입니다."
              placeholder='내용을 입력해주세요'
              maxLength="300"
              name='giftMessageContent' />
          </StyleBox>

          {/* <FileInput
            name="badgeImage"
            title="선물 이미지"
            inputInfo="*사용자에게 노출되는 항목입니다."
            accept="image/png, image/jpeg"
            setUploadImgUrl={setUploadImgUrl}
          /> */}
        </FormWarp>
      </div>
      <div className='basicBox'>
        <FormWarp>
          <SentTarget name="giftSentTarget" FileView={FileView} setFileView={setFileView} limitCount={giftLimitCount} />
        </FormWarp>
      </div>
      <div className='basicBox'>
        <FormWarp>
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
          <Button variantStyle="color" sizeStyle="sm" onClick={() => handleSubmit()}>등록하기</Button>
        </FormWarp>
      </div>
    </div>
  )
}

NewGift.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context)
  const { templateId } = context.query;

  const giftTemplateDetail = await serverSideGetApi(`/api/gifts/templates/${templateId}/detail`, accessToken, refreshToken, context)
  const giftTemplateDetailData = await giftTemplateDetail.data || []

  console.log("giftTemplateDetailData", giftTemplateDetailData)
  return {
    props: {
      giftTemplateDetailData
    }
  }
}