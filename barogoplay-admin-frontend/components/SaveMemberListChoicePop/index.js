import Modal from '@/components/Modal/Modal';
import styles from './SaveMemberListChoicePop.module.scss';
import BasicTable from '@/components/TableBox/BasicTable';
import Button from '@/components/Button/Button';
import { useEffect, useState } from 'react';
import Apis from '@/components/utils/Apis';
import { FilterDataSet } from '@/components/utils/FilterDataSet';
import { queryString } from '@/components/utils/queryString';
import { useRouter } from 'next/router';


// !FormSet컴포넌트에서 sentTarget 설정 시 노출되는 회원리스트 선택 팝업 
export default function SaveMemberListChoicePop(props) {
  const router = useRouter();
  const { setFileView, popClose, type } = props

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

  useEffect(() => {
    setSaveMemberList(router.query.choiceMemberListPage, router.query.choiceMemberListSize)
  }, [router.query.choiceMemberListPage, router.query.choiceMemberListSize])


  const [listOnOff, setListOnOff] = useState(true) // 리스트 업로드 클릭시 리스트 노출 여부

  // !저장된 회원리스트 팝업에서 리스트 업로드 버튼 클릭시
  const ListUploader = async (e) => {
    const margeIdList = e.target.getAttribute('data-checklist') // 저장된 회원리스트 중에서 어떤 리스트를 선택했는지
    console.log("리스트 업로드할 ID", margeIdList)

    const userListMergeRes = await Apis.get(`/api/userlists/merge?idList=${margeIdList}`)
    console.log("선택한 회원리스트에 업로드 api", userListMergeRes)

    if (userListMergeRes.status === 200 && userListMergeRes.data.status === "success") {
      const userListMergeData = await userListMergeRes.data.data;
      setFileView({ fileName: "저장된 회원리스트", data: userListMergeData })
      props.type !== "popup" ? setListOnOff(false) : popClose()
    } else {
      console.log("선택한 회원리스트에 업로드 실패 사유 : ", userListMergeRes.data.message)
    }
  }

  // !회원리스트 다시 선택 클릭시
  const resetList = () => {
    setListOnOff(true)
    setFileView(null)
  }

  console.log("SaveMemberListData", SaveMemberListData)


  if (type === "popup") {
    return (
      <Modal
        closePortal={() => popClose()}
        className={styles.viewTableStyle + " " + styles.memberListTable}>
        <div className={styles.memberListTableInner}>
          <h5>발송할 회원리스트 선택</h5>
          <div className={styles.memberListTableBox}>
            <div className={styles.viewTableInner}>
              {SaveMemberListData && <BasicTable
                filterCategory="choiceMemberList"
                data={SaveMemberListData}
                filterSearchSet={false}
                checkOnOff={true}
                addButton={
                  <div className={styles.buttonBottom}>
                    <Button variantStyle="darkgray" sizeStyle="sm" onClick={() => popClose()}>취소</Button>
                    <Button className="listCheckBtn" variantStyle="color" sizeStyle="sm" onClick={(e) => ListUploader(e)}>리스트 업로드</Button>
                  </div>
                }
              />}
            </div>
          </div>
        </div>
      </Modal>
    )
  } else {
    if (listOnOff) {
      return (
        <div className={styles.memberListTypeBox}>
          <div className={styles.memberListTableInner}>
            <h5>부여할 회원리스트 선택</h5>
            <div className={styles.memberListTableBox}>
              <div className={styles.viewTableInner}>
                {SaveMemberListData && <BasicTable
                  filterCategory="choiceMemberList"
                  data={SaveMemberListData}
                  filterSearchSet={false}
                  checkOnOff={true}
                  addButton={
                    <div className={styles.buttonBottom}>
                      <Button className="listCheckBtn" variantStyle="color" sizeStyle="sm" onClick={(e) => ListUploader(e)}>리스트 업로드</Button>
                    </div>
                  }
                />
                }
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <Button variantStyle="darkgray" sizeStyle="sm" onClick={(e) => resetList()}>회원 리스트 다시 선택</Button>
    }
  }
}