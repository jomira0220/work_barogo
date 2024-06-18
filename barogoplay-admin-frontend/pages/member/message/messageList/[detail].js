import Button from '@/components/Button/Button';
import { useEffect, useState } from 'react';
import { FormWarp, StyleBox, SentDate, SentTarget, SentInput, SentContent, SentType } from '@/components/FormSet/FormSet';
import Layout from '@/components/Layout/Layout';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi';
import { queryString } from "@/components/utils/queryString";
import { FilterDataSet } from '@/components/utils/FilterDataSet';
import { de } from 'date-fns/locale';



export default function MessageDetail(props) {

  const { DataTargetId, DetailType, DetailData } = props;

  console.log(props)

  // 수정페이지용으로 필요함
  const [startDate, setStartDate] = useState(new Date(DetailData.date));
  const [MessageTypeSelect, SetMessageTypeSelect] = useState({ point: false, link: false });
  const [FileView, setFileView] = useState(null);

  // !메세지 타입에 따라서 입력형태 변경
  const MessageTypeSelectEvent = (type) => {
    console.log(type)
    type === "message" ? SetMessageTypeSelect({ point: false, link: false })
      : type === "point" ? SetMessageTypeSelect({ point: true, link: false })
        : SetMessageTypeSelect({ message: false, point: false, link: true })
  }
  // console.log(DataTargetId, DetailType)
  useEffect(() => {
    MessageTypeSelectEvent(DetailData.type)
    document.querySelectorAll(`[name="messageType"]:not([value="${DetailData.type}"])`).forEach((item) => item.disabled = true)
  }, [DetailData.type])

  // !메시지 등록하기
  const handleSubmit = (e) => {
    const data = {
      subject: document.querySelector('[name="newMessageSubject"]').value,
      memo: document.querySelector('[name="newMessageMemo"]').value,
      target: document.querySelector('[name="messageTarget"]:checked').value === "selectMember" ? FileView.data.body.map((item) => item[0]) : "allMember",
      messageContent: document.querySelector('[name="newMessageContent"]').value,
      type: document.querySelector('[name="messageType"]:checked').value,
      date: startDate.toISOString(),
    }
    // !메시지 타입에 따라서 값 추가
    if (data.type === "point") {
      data.point = Number(document.querySelector('[name="newMessagePoint"]').value)
    } else if (data.type === "link") {
      data.link = document.querySelector('[name="newMessageLink"]').value
    }

    if (data.subject === "") {
      alert("발송 제목을 입력해주세요");
    } else if (data.memo === "") {
      alert("발송 메모를 입력해주세요");
    } else if (data.messageContent === "") {
      alert("사용자에게 노출할 내용을 입력해주세요");
    }
    console.log('data', data);
  }

  console.log(DetailData)

  return (
    <>
      <div className='basicBox'>
        {DetailType === "messageSendWait" && (
          <>
            <h2>알림메시지 발송 대기 상세</h2>
            <FormWarp>
              <SentType
                title="발송 유형 선택"
                name="messageType"
                onClick={(e) => MessageTypeSelectEvent(e.target.value)}
                typeList={[
                  { type: "일반 메시지형", value: "MESSAGE", defaultChecked: DetailData.subType === "MESSAGE" ? true : false },
                  { type: "경험치 지급형", value: "POINT", defaultChecked: DetailData.subType === "POINT" ? true : false }
                ]}
              />
              <SentInput title="제목" type="text" name='MessageTitle'
                placeholder='사용자에게 노출되지 않는 기록성 메모입니다.'
                defaultValue={DetailData.title}
                readOnly
              />
              <SentContent
                title="내용"
                placeholder='사용자에게 노출할 내용을 입력해주세요'
                maxLength="300"
                name='MessageContent'
                defaultValue={DetailData.message}
                readOnly
              />

              <StyleBox>
                {DetailData.subType === "MESSAGE" &&
                  <SentInput
                    title="링크"
                    type="text"
                    placeholder='연결할 링크를 입력해주세요'
                    name='MessageLink'
                    defaultValue={DetailData.link === null || DetailData.link === "" || DetailData.link === undefined ? "링크없음" : DetailData.link}
                    readOnly
                  />
                }

                {DetailData.subType === "POINT" &&
                  <SentInput
                    title="경험치"
                    className="numberSet"
                    placeholder='지급할 경험치 입력'
                    name='MessagePoint'
                    defaultValue={DetailData.point}
                  />
                }
              </StyleBox>

              {/* <SentTarget FileView={FileView} setFileView={setFileView} /> */}

              {/* <SentDate
              title="예약 발송"
              dateFormat='yyyy.MM.dd HH:mm'
              selected={startDate}
              showTimeSelect
              minDate={new Date()} // !오늘 이전 날짜 선택 불가
              onChange={(date) => setStartDate(date)}
              name='newMessageDate'
              disabledKeyboardNavigation
            /> */}

              {/* <Button
                variantStyle="color"
                sizeStyle="sm"
                onClick={() => handleSubmit()}>수정하기</Button> */}

            </FormWarp>
          </>
        )}
        {DetailType === "messageSendComplete" && (
          <>
            <h2>알림메시지 발송 완료 상세</h2>
            <FormWarp>

              <SentType
                title="발송 유형 선택"
                name="messageType"
                typeList={[
                  { type: "일반 메시지형", value: "MESSAGE", defaultChecked: DetailData.subType === "MESSAGE" ? true : false },
                  { type: "경험치 지급형", value: "POINT", defaultChecked: DetailData.subType === "POINT" ? true : false }
                ]}
                readOnly
              />

              <SentInput title="제목" type="text" name='MessageSubject'
                placeholder='사용자에게 노출되지 않는 기록성 메모입니다.'
                defaultValue={DetailData.title}
                readOnly
              />
              <SentContent title="내용" type="text" name='MessageMessage'
                placeholder='사용자에게 노출되지 않는 기록성 메모입니다.'
                defaultValue={DetailData.message}
                maxLength="300"
                readOnly
              />

              <StyleBox>
                {DetailData.subType === "MESSAGE" &&
                  //!발송유형 - 링크
                  <SentInput
                    title="링크"
                    type="text"
                    placeholder='연결할 링크를 입력해주세요'
                    name='MessageLink'
                    defaultValue={DetailData.link === null || DetailData.link === "" || DetailData.link === undefined ? "링크없음" : DetailData.link}
                    readOnly
                  />
                }

                {DetailData.subType === "POINT" &&
                  //!발송유형 - 경험치 
                  <SentInput
                    title="경험치"
                    className="numberSet"
                    placeholder='지급할 경험치 입력'
                    name='MessagePoint'
                    defaultValue={DetailData.point}
                    readOnly
                  />
                }
              </StyleBox>


            </FormWarp>
          </>
        )}
      </div>
      {/* <div className='basicBox'>
        <FormWarp>
          <SentTarget FileView={FileView} setFileView={setFileView} name="messageTarget" />
        </FormWarp>
      </div> */}
    </>
  )
}

MessageDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}


export const getServerSideProps = async (context) => {
  const { detailId: DataTargetId, detailType: DetailType } = context.query;
  const { accessToken, refreshToken } = await getToken(context);
  let DetailData = null
  if (DetailType === "messageSendWait") {
    const waitingMessageQueryUrl = queryString(FilterDataSet("messageSendWait", context.query));
    const waitingMessageRes = await serverSideGetApi(
      `/api/notifications/waiting?${waitingMessageQueryUrl}`,
      accessToken,
      refreshToken,
      context,
    );
    let waitingMessageData = await waitingMessageRes.data || [];
    DetailData = waitingMessageData.content.filter((item) => item.id === Number(DataTargetId))[0]
  } else {
    const CompleteMessageQueryUrl = queryString(FilterDataSet("messageSendComplete", context.query));
    const completeMessageRes = await serverSideGetApi(
      `/api/notifications/completed?${CompleteMessageQueryUrl}`,
      accessToken,
      refreshToken,
      context,
    );
    let completeMessageData = await completeMessageRes.data || [];
    // console.log(completeMessageData)
    DetailData = completeMessageData.content.filter((item) => item.id === Number(DataTargetId))[0] || []
  }

  return {
    props: {
      DataTargetId,
      DetailType,
      DetailData
    }
  }
}

