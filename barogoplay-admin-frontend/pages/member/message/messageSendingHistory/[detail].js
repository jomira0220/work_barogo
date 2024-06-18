

import { FormWarp, StyleBox, SentDate, SentTarget, SentInput, SentContent, SentType } from '@/components/FormSet/FormSet';
import { useEffect } from 'react';
import Layout from '@/components/Layout/Layout';

export default function MessageSendingHistoryDetail(props) {

  const { DataTargetId, DetailType, DetailData } = props;
  useEffect(() => {
    // MessageTypeSelectEvent(DetailData.type)
    document.querySelector(`[name="messageType"][value="${DetailData.type}"]`).checked = true
    document.querySelectorAll(`[name="messageType"]:not([value="${DetailData.type}"])`).forEach((item) => item.disabled = true)
  }, [DetailData.type])

  // console.log(DataTargetId, DetailType)
  return (
    <div className='basicBox'>
      <h2>알림 메시지 발송내역 상세</h2>
      <FormWarp>

        <SentInput title="발송 제목" type="text" name='newMessageSubject'
          placeholder='사용자에게 노출되지 않는 기록성 메모입니다.'
          defaultValue={DetailData.subject}
          readOnly
        />
        <SentInput title="발송 메모" type="text" name='newMessageMemo'
          placeholder='사용자에게 노출되지 않는 기록성 메모입니다.'
          defaultValue={DetailData.memo}
          readOnly
        />

        <SentTarget FileView={null} setFileView={null} readOnly />

        <SentType
          title="발송 유형 선택"
          name="messageType"
          // onClick={(e) => MessageTypeSelectEvent(e.target.value)}
          typeList={[
            { type: "일반 메시지형", value: "message" },
            { type: "포인트 지급형", value: "point" },
            { type: "페이지 렌딩형", value: "link" }
          ]}
          readOnly
        />

        <StyleBox>
          {/*  //!발송유형 - 메세지(기본)  */}
          <SentContent
            title="내용"
            placeholder='사용자에게 노출할 내용을 입력해주세요'
            maxLength="300"
            name='newMessageContent'
            defaultValue={DetailData.messageContent}
            readOnly
          />

          {DetailData.type === "link" &&
            //!발송유형 - 링크
            <SentInput
              title="링크"
              type="text"
              placeholder='연결할 링크를 입력해주세요'
              name='newMessageLink'
              defaultValue={DetailData.link}
              readOnly
            />
          }

          {DetailData.type === "point" &&
            //!발송유형 - 포인트 
            <SentInput
              title="포인트"
              className="numberSet"
              placeholder='지급할 포인트 입력'
              name='newMessagePoint'
              defaultValue={DetailData.point}
              readOnly
            />
          }
        </StyleBox>
        <SentDate
          title="예약 발송"
          dateFormat='yyyy.MM.dd HH:mm'
          selected={new Date(DetailData.date)}
          // showTimeSelect
          // minDate={new Date()} // !오늘 이전 날짜 선택 불가
          // // onChange={(date) => setStartDate(date)}
          name='newMessageDate'
          disabledKeyboardNavigation
          readOnly
        />
      </FormWarp>

    </div>
  )
}

MessageSendingHistoryDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}

export const getServerSideProps = async (context) => {
  const { detailId: DataTargetId, detail: DetailType } = context.query;
  const DetailData = {
    subject: '알림메세지의 관리자용 발송제목입니다~~~~~~',
    memo: '알림메세지의 관리자용 발송메모입니다~~~~~~',
    target: '전체회원', // !전체회원 or 선택회원
    messageContent: '알림메세지의 고객노출 내용입니다~~~~~~',
    type: 'point', // !message: 일반 메시지형, point: 포인트 지급형, link: 페이지 렌딩형
    point: 10,
    link: '',
    date: "2023-12-10T04:36:21.434Z", // 예약 발송일
  }
  return {
    props: {
      DataTargetId,
      DetailType,
      DetailData
    }
  }
}