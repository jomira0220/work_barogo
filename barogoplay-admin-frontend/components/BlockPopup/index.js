import Button from "@/components/Button/Button";
import Modal from "@/components/Modal/Modal";
import styles from "./BlockPopup.module.scss";
import Apis from "@/components/utils/Apis";
import { useRouter } from "next/router";

export default function BlockPopup(props) {
  const { blockPopup, setBlockPopup } = props;
  const router = useRouter()

  // ! 차단 팝업에서 차단 사유 작성후 저장 버튼 클릭시
  const BlockComplete = async () => {
    const reason = document.querySelector("[name='blockReason']").value
    const memo = document.querySelector("[name='blockMemo']").value

    if (reason === "") {
      return alert("차단 사유를 입력해주세요.")
    } else if (memo === "") {
      return alert("차단 메모를 입력해주세요.")
    }

    const blockData = { userIds: [blockPopup.userId], reason: reason, memo: memo }

    blockPopup.targetId === null && blockPopup.targetType === null
      ? (blockData.blockedType = "NICKNAME")
      : (blockData.blockedType = "COMMUNITY")

    // 아래 두개 항목은 게시글에 대한 차단(blockedType = "COMMUNITY")인 경우만 필요
    blockPopup.targetId && (blockData.targetId = blockPopup.targetId)
    blockPopup.targetType && (blockData.targetType = blockPopup.targetType)

    const blockRes = await Apis.post(`/api/users/block`, blockData);
    console.log("작성자 차단 요청 api", blockRes, blockData)
    if (blockRes.status === 200 && blockRes.data.status === "success") {
      alert("차단이 완료되었습니다.")
      setBlockPopup(false)
      router.reload()
    } else {
      alert(blockRes.data.message)
    }
  }

  return (
    <Modal closePortal={() => setBlockPopup(false)}>
      <div id={styles.blockPopup}>
        <h3>차단 사유 저장</h3>
        <div className={styles.textBox}>
          <input type="text" name='blockReason' placeholder="차단 사유를 입력해주세요." />
          <textarea name='blockMemo' placeholder="차단 메모를 입력해주세요." />
        </div>
      </div>
      <div className='buttonWrap'>
        <Button variantStyle="color" sizeStyle="lg" onClick={() => BlockComplete()}>저장</Button>
        <Button variantStyle="darkgray" sizeStyle="lg" onClick={() => setBlockPopup(false)}>닫기</Button>
      </div>
    </Modal>
  )
}