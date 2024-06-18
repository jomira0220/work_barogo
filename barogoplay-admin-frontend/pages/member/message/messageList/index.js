
import { useRouter } from 'next/router';

import Apis from '@/components/utils/Apis'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi';

import Layout from '@/components/Layout/Layout';
import Button from '@/components/Button/Button';
import SubNav from '@/components/SubNav/SubNav';
import BasicTable from '@/components/TableBox/BasicTable';

import styles from './messageList.module.scss';

import { queryString } from "@/components/utils/queryString";
import { FilterDataSet } from "@/components/utils/FilterDataSet";


export default function MessageList(props) {
  const router = useRouter();
  const { completeMessageData, waitingMessageData } = props;

  console.log("메시지 리스트", props)

  //! 알림 삭제
  const handleDelete = async (e) => {
    const checkedList = e.target.dataset.checklist.split(',');
    console.log("체크한 ID 리스트", checkedList);
    if (checkedList.length === 0) {
      return alert('삭제할 알림을 선택해주세요.');
    } else if (checkedList.length > 1) {
      return alert('한개의 알림만 선택해주세요.');
    } else {
      const delRes = await Apis.delete(`/api/notifications/${checkedList[0]}`);
      console.log("알림 삭제 api", delRes);
      if (delRes.status === 200 && delRes.data.status === 'success') {
        alert('알림이 삭제되었습니다.');
        router.reload();
      } else {
        alert('알림 삭제에 실패했습니다. 사유 : ', delRes.data.message);
      }
    }
  }

  return (
    <div className={styles.message}>
      <div className='basicBox maxWidth100'>
        <SubNav />
        <div className={styles.messageTop}>
          <h3>알림 메시지 발송 대기</h3>
        </div>

        <BasicTable
          data={waitingMessageData}
          filterCategory="messageSendWait"
          checkOnOff="true" // 체크박스 유무
          downOnOff="false" // 다운로드 버튼 유무
          itemDetail="true" // 아이템 상세보기 유무
          addButton={<>
            <Button
              className="listCheckBtn"
              variantStyle="gray"
              sizeStyle="sm"
              onClick={(e) => handleDelete(e)}
            >
              대기 알림 삭제
            </Button>
            <Button variantStyle="color"
              sizeStyle="sm"
              onClick={() => router.push("/member/message/newMessage")}
            >
              신규 알림 생성
            </Button>
          </>}
        />
      </div>

      <div className='basicBox maxWidth100'>
        <h3>알림 메시지 발송 완료</h3>
        <BasicTable
          filterCategory="messageSendComplete"
          data={completeMessageData}
          itemDetail={true} // 아이템 상세보기 유무
        />
      </div>
    </div>
  )
}

MessageList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);

  // 알림메세지 발송대기
  const waitingMessageQueryUrl = queryString(FilterDataSet("messageSendWait", context.query));
  const waitingMessageRes = await serverSideGetApi(`/api/notifications/waiting?${waitingMessageQueryUrl}`, accessToken, refreshToken, context,);
  let waitingMessageData = await waitingMessageRes.data || [];

  // 알림메세지 발송완료
  const CompleteMessageQueryUrl = queryString(FilterDataSet("messageSendComplete", context.query));
  const completeMessageRes = await serverSideGetApi(`/api/notifications/completed?${CompleteMessageQueryUrl}`, accessToken, refreshToken, context,);
  let completeMessageData = await completeMessageRes.data || [];


  return {
    props: {
      completeMessageData,
      waitingMessageData,
    },
  }
}