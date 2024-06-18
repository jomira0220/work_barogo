
import { useRouter } from 'next/router';
import { useState } from 'react'
import Layout from '@/components/Layout/Layout';

import styles from './../challenge.module.scss'
import Button from '@/components/Button/Button'
import SubNav from '@/components/SubNav/SubNav'
import BasicTable from '@/components/TableBox/BasicTable'
import Modal from '@/components/Modal/Modal'

import Apis from '@/components/utils/Apis';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'

import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'


export default function ChallengeManagement(props) {
  const router = useRouter();
  const { activeChallengeData, inactiveChallengeData } = props;
  console.log("챌린지 관리 페이지", props)

  const [buttonModal, setButtonModal] = useState({ onoff: false, data: "" })


  //! 챌린지 활성화, 비활성화, 삭제
  const ChallengeHandler = (e, type) => {
    const typeName = { inactivate: "비활성화", delete: "삭제", activate: "활성화" }
    if (e.target.getAttribute("data-checklist")) {
      const checkListData = e.target.getAttribute("data-checklist");
      const challengeRes = async () => {
        const res = type === "delete" ? await Apis.delete(`/api/challenges?idList=${checkListData}`,) : await Apis.put(`/api/challenges/${type}?idList=${checkListData}`)
        console.log(`챌린지 ${typeName[type]} api`, res)
        if (res.status === 200 && res.data.status === "success") {
          router.reload()
        } else {
          alert(res.data.message)
        }
      }
      setButtonModal({
        onoff: true, data: <>
          <h3>챌린지 {typeName[type]} 하시겠습니까?</h3>
          <p>선택한 아이디 : {checkListData}</p>
          <div className='buttonWrap'>
            <Button variantStyle="color" sizeStyle="lg" onClick={() => challengeRes(checkListData)}>확인</Button>
            <Button variantStyle="darkgray" sizeStyle="lg" onClick={() => setButtonModal({ onoff: false, data: "" })}>취소</Button>
          </div>
        </>
      })
    } else {
      alert("체크된 리스트가 없습니다.")
      return;
    }
  }

  return (
    <div className={styles.challengeListWarp}>
      {buttonModal.onoff && (
        <Modal type="alert" closePortal={() => setButtonModal({ onoff: false, data: "" })}>
          {buttonModal.data}
        </Modal>
      )}
      <div className='basicBox maxWidth100'>
        <SubNav />
        <h3>활성화된 챌린지</h3>
        <BasicTable
          filterCategory="challengeActive"
          data={activeChallengeData}
          checkOnOff={true}
          itemDetail={true}
          addButton={
            <Button
              variantStyle="color"
              sizeStyle="sm"
              onClick={(e) => ChallengeHandler(e, "inactivate")}
              className="listCheckBtn"
            >
              비활성화
            </Button>
          }
        />
      </div>

      <div className='basicBox maxWidth100'>
        <h3>비활성화 챌린지</h3>
        <BasicTable
          filterCategory="challengeInActive"
          data={inactiveChallengeData}
          checkOnOff={true}
          itemDetail={true}
          addButton={
            <>
              <Button
                variantStyle="gray"
                sizeStyle="sm"
                className="listCheckBtn"
                onClick={(e) => ChallengeHandler(e, "delete")}
              >
                챌린지 삭제
              </Button>
              <Button
                variantStyle="darkgray"
                sizeStyle="sm"
                className="listCheckBtn"
                onClick={(e) => ChallengeHandler(e, "activate")}
              >
                챌린지 활성화
              </Button>
              <Button
                variantStyle="color"
                sizeStyle="sm"
                onClick={() => router.push("/activity/challenge/newChallenge")}
              >
                챌린지 신규 등록
              </Button>
            </>
          }

        />
      </div>
    </div>
  )
}

ChallengeManagement.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { refreshToken, accessToken } = getToken(context);

  const activeQueryUrl = queryString(FilterDataSet("challengeActive", context.query));
  const inactiveQueryUrl = queryString(FilterDataSet("challengeInActive", context.query));

  const activeChallengeRes = await serverSideGetApi(`/api/challenges/active?${activeQueryUrl}`, accessToken, refreshToken, context);
  const inactiveChallengeRes = await serverSideGetApi(`/api/challenges/inactive?${inactiveQueryUrl}`, accessToken, refreshToken, context);

  const activeChallengeData = await activeChallengeRes.data || [];
  const inactiveChallengeData = await inactiveChallengeRes.data || [];

  return {
    props: {
      activeChallengeData,
      inactiveChallengeData
    }, // will be passed to the page component as props
  }
}