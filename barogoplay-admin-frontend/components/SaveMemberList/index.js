import Modal from "@/components/Modal/Modal";
import styles from "./SaveMemberList.module.scss";
import Button from "@/components/Button/Button";
import BasicTable from "@/components/TableBox/BasicTable";
import Apis from "@/components/utils/Apis";
import { useEffect, useState } from "react";
import { FilterDataSet } from "@/components/utils/FilterDataSet";
import { queryString } from "@/components/utils/queryString";
import SaveMemberListPop from "@/components/SaveMemberListPop";
import { useRouter } from "next/router";


//! 회원관리의 회원리스트 페이지에서만 노출할 저장된 회원리스트 팝업
export default function SaveMemberList(props) {
  const router = useRouter();
  const { checkList, setMemberListSaveModal } = props;

  const [SaveMemberListData, setSaveMemberListData] = useState(null)

  // //! 저장된 회원리스트 데이터 가져오기
  const setSaveMemberList = async (pageQuery, sizeQuery) => {
    let queryDefaultArr = FilterDataSet("choiceMemberList")
    queryDefaultArr = { ...queryDefaultArr, page: pageQuery ? pageQuery : queryDefaultArr.page, size: sizeQuery ? sizeQuery : queryDefaultArr.size }
    const queryUrl = queryString(queryDefaultArr);
    const saveMemberListRes = await Apis.get(`/api/userlists?${queryUrl}`)
    console.log("저장된 회원리스트 데이터 api 호출", saveMemberListRes)

    if (saveMemberListRes.status === 200 && saveMemberListRes.data.status === "success") {
      const saveMemberListData = await saveMemberListRes.data;
      setSaveMemberListData(saveMemberListData.data)
    } else {
      console.log("저장된 회원리스트 데이터 가져오기 실패 사유 : ", saveMemberListRes.data.message)
    }
  }

  //! 신규 회원리스트 생성 팝업 노출용
  const [NewMemberListModal, setNewMemberListModal] = useState(false)

  useEffect(() => {
    // 신규 회원리스트 생성 팝업이 닫힐 때 저장된 회원리스트 데이터 다시 가져오기
    if (NewMemberListModal === false) setSaveMemberList()
  }, [NewMemberListModal])

  useEffect(() => {
    setSaveMemberList(router.query.choiceMemberListPage, router.query.choiceMemberListSize)
  }, [router.query.choiceMemberListPage, router.query.choiceMemberListSize])


  //! 선택한 리스트에 추가하기
  const SaveMemberListAdd = async () => {
    const selectedMemberList = document.querySelector(".listCheckBtn").dataset.checklist.split(",")
    if (selectedMemberList[0] !== "" && selectedMemberList.length > 0) {
      const addUserListRes = await Apis.post(`/api/userlists/users`, {
        extractedUserListIds: selectedMemberList,
        userIds: checkList.map((item) => Number(item))
      })
      console.log("회원리스트에 유저 추가 api", addUserListRes)
      if (addUserListRes.status === 200 && addUserListRes.data.status === "success") {
        setSaveMemberList()
        alert("회원리스트에 추가되었습니다.")
      } else {
        alert("회원리스트에 추가를 실패하였습니다. 사유 : " + addUserListRes.data.message)
      }
    } else {
      alert("선택한 회원리스트가 없습니다.")
    }
  }

  const modalClose = () => {
    const query = router.query
    // 저장된 회원리스트 모달 닫을 때 쿼리 초기화
    // 현재 모달은 회원관리에서만 사용되므로 choiceMemberList 쿼리만 초기화
    delete query.choiceMemberListPage
    delete query.choiceMemberListSize

    router.push({ query: query })
    setMemberListSaveModal(false)
  }

  return (
    <>
      <Modal
        closePortal={() => modalClose()}
        className={styles.viewTableStyle + " " + styles.memberListTable}
      >
        <div className={styles.memberListTableInner}>
          <h5>저장된 회원리스트</h5>
          <div className={styles.memberListTableBox}>
            <div className={styles.viewTableInner}>
              {SaveMemberListData && (
                <BasicTable
                  filterCategory="choiceMemberList"
                  data={SaveMemberListData}
                  filterSearchSet={false}
                  checkOnOff={true}
                  addButton={
                    <div className={styles.buttonBottom}>
                      <Button variantStyle="darkgray" sizeStyle="sm" onClick={() => modalClose()}>닫기</Button>
                      <Button className={styles.newMemberList} variantStyle="border" sizeStyle="sm" onClick={(e) => setNewMemberListModal(true)}>신규 회원리스트 생성</Button>
                      <Button className="listCheckBtn" variantStyle="color" sizeStyle="sm" onClick={() => SaveMemberListAdd()}>선택한 리스트에 추가</Button>
                    </div>
                  }
                />
              )}

            </div>
          </div>
        </div>
      </Modal>
      { // ! 신규 회원리스트 생성 팝업
        NewMemberListModal && <SaveMemberListPop setNewMemberListModal={setNewMemberListModal} />
      }
    </>
  )
}




