import Modal from "@/components/Modal/Modal";
import styles from "./SaveMemberListPop.module.scss";
import Button from "@/components/Button/Button";
import Apis from "@/components/utils/Apis";
import { useRouter } from "next/router";


//! 저장된 회원리스트 페이지에서 사용할 신규 회원리스트 생성 팝업
export default function SaveMemberListPop(props) {
  const { setNewMemberListModal } = props;
  const router = useRouter();
  //! 신규 회원리스트 생성
  const FinalSave = async () => {
    const subject = document.querySelector("[name='saveMemberListAdminSubject']").value;
    const content = document.querySelector("[name='saveMemberListAdminContent']").value;

    if (!subject) return alert("제목을 입력해주세요")
    if (!content) return alert("메모를 입력해주세요")

    const userListsRes = await Apis.post(`/api/userlists`, { name: subject, memo: content })
    console.log("신규 회원리스트 생성 api", userListsRes)

    if (userListsRes.status === 200 && userListsRes.data.status === "success") {
      alert("신규 회원리스트가 생성되었습니다.")
      setNewMemberListModal(false)
      router.pathname.includes("savememberlist") && router.reload() // 저장된 회원리스트 페이지에서만 리로드 처리
    } else {
      alert("신규 회원리스트 생성에 실패하였습니다. 사유 : ", userListsRes.data.message)
    }
  }

  return (
    <Modal closePortal={() => setNewMemberListModal(false)}>
      {/* <FilterDataList filterTotalData={filterTotalData} filterCategory={filterCategory} /> 검색 필터 셋팅 확인 테이블 */}
      <div className={styles.searchSavePop}>
        <h3>신규 회원리스트 생성</h3>
        <input type="text" name="saveMemberListAdminSubject" placeholder='제목' />
        <textarea name="saveMemberListAdminContent" placeholder='메모' />
        <div className={styles.buttonWrap}>
          <Button variantStyle="darkgray" sizeStyle="sm" onClick={() => setNewMemberListModal(false)}>닫기</Button>
          <Button variantStyle="color" sizeStyle="sm" onClick={() => FinalSave()}>저장</Button>
        </div>
      </div>
    </Modal>
  )
}