import Button from '@/components/Button/Button';
import { useState } from 'react';
import {
  FormWarp, SentDate,
  SentTarget, SentInput, SentContent, SentType
} from '@/components/FormSet/FormSet';
import Layout from '@/components/Layout/Layout';
import styles from './newMessage.module.scss';
import Apis from '@/components/utils/Apis';
import { useRouter } from 'next/router';


export default function NewMessage() {

  const router = useRouter();

  const [startDate, setStartDate] = useState(new Date());
  const [MessageTypeSelect, SetMessageTypeSelect] = useState({ point: false, link: true });
  const [FileView, setFileView] = useState(null);

  const MessageTypeSelectEvent = (type) => {
    // 메세지 타입에 따라서 입력형태 변경
    type === "MESSAGE" ? SetMessageTypeSelect({ point: false, link: true }) : SetMessageTypeSelect({ point: true, link: false })
  }

  // !메시지 등록하기
  const handleSubmit = async (e) => {

    //발송 대상 타입 확인 - 전체회원, 저장된 회원리스트
    const targetValue = document.querySelector('[name="messageTarget"]:checked').value;


    // !한국시간으로 변경
    const offset = 1000 * 60 * 60 * 9; // 9시간
    const koreaNow = new Date((startDate).getTime() + offset)
    const reservedDate = koreaNow.toISOString().split('.')[0]

    const data = {
      subType: document.querySelector('[name="messageType"]:checked').value, // MESSAGE, POINT
      title: document.querySelector('[name="newMessageSubject"]').value,
      message: document.querySelector('[name="newMessageContent"]').value,
      redirectUrl: document.querySelector('[name="newMessageLink"]') ? document.querySelector('[name="newMessageLink"]').value : "",
      point: document.querySelector('[name="newMessagePoint"]') ? document.querySelector('[name="newMessagePoint"]').value : "",
      reservedDate: reservedDate,
      targetType: targetValue === "allMember" ? "selected" : "extracted", // selected = 전체회원중, excepted = 저장된 회원중
      brand: null,
      receiveUserList: null,
    }

    // 전체 회원인 경우에는 브랜드 선택 값 추가
    const companyArr = [];
    if (targetValue === "allMember") {
      document.querySelectorAll('[name="messageTargetBrand"]').forEach(
        (item) => item.checked && companyArr.push(item.value)
      )
      if (companyArr.length === 0) return alert("브랜드를 선택해주세요")
      data.brand = companyArr.join(",")
    }


    // 저장된 회원리스트 보내기인 경우에만 리스트 데이터 추가
    if (targetValue === "saveListMember" && FileView) {
      data.receiveUserList = FileView.data.processedUserList.map(item => item.id) // 아이디만 보내기
    }

    if (data.title === "") {
      alert("제목을 입력해주세요");
    } else if (data.message === "") {
      alert("내용을 입력해주세요");
    }

    const pushMessageRes = await Apis.post('/api/notifications', data);
    console.log('pushMessageRes', pushMessageRes)
    if (pushMessageRes.status === 200) {
      alert('메시지가 성공적으로 등록되었습니다.');
      router.push('/member/message/messageList');
    } else {
      alert('메시지 등록에 실패하였습니다.');
    }

    console.log('data', data);
  }

  return (
    <div className={styles.newMessageWarp}>
      <div className='basicBox'>
        <h2>신규 알림 메시지</h2>
        <h3>발송 내용</h3>
        <FormWarp>
          <SentType
            title="발송 유형 선택"
            name="messageType"
            onClick={(e) => MessageTypeSelectEvent(e.target.value)}
            typeList={[
              { type: "일반 메시지형", value: "MESSAGE", defaultChecked: true },
              { type: "경험치 지급형", value: "POINT" },
            ]}
          />

          <SentInput title="제목" type="text" name='newMessageSubject' placeholder='사용자에게 노출되지 않는 기록성 메모입니다.' />
          {/* <SentInput title="발송 메모" type="text" name='newMessageMemo' placeholder='사용자에게 노출되지 않는 기록성 메모입니다.' /> */}


          {/* 
          //!발송유형 - 메세지(기본) 
          */}
          <SentContent
            title="내용"
            inputInfo="*사용자에게 노출되는 항목입니다."
            placeholder='내용을 입력해주세요'
            maxLength="300"
            name='newMessageContent' />

          {MessageTypeSelect.link &&
            //!발송유형 - 링크 (메세지형 선택시)
            <SentInput
              title="링크"
              type="text"
              placeholder='연결할 링크를 입력해주세요'
              name='newMessageLink' />
          }

          {MessageTypeSelect.point &&
            //!발송유형 - 경험치 (경험치 지급형 선택시)
            <SentInput
              title="경험치"
              className="numberSet"
              placeholder='지급할 경험치 입력'
              name='newMessagePoint'
            />
          }

        </FormWarp>
      </div>
      <div className='basicBox'>
        <FormWarp>
          {/* 발송대상 */}
          <SentTarget FileView={FileView} setFileView={setFileView} name="messageTarget" />
        </FormWarp>
      </div>
      <div className='basicBox'>
        <FormWarp>

          <SentDate
            title="예약발송"
            info="*5분 단위로 발송이 진행됩니다. ex) 10:3분 발송시 10:5분에 발송됩니다."
            dateFormat='yyyy.MM.dd HH:mm'
            selected={startDate}
            showTimeInput
            minDate={new Date()} // !오늘 이전 날짜 선택 불가
            onChange={(date) => setStartDate(date)}
            name='newMessageDate'
            disabledKeyboardNavigation
          />
          <Button
            className={styles.submitBtn} variantStyle="color" sizeStyle="sm"
            onClick={() => handleSubmit()}>등록하기</Button>
        </FormWarp>
      </div>
    </div>

  )
}

NewMessage.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}