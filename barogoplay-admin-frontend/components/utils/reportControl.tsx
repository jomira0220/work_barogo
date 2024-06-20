import Apis from "@/components/utils/Apis";
import Modal from "@/components/Modal/Modal";
import ToggleBtn from "@/components/ToggleBtn/ToggleBtn";
import Button from "@/components/Button/Button";
import styles from "@/components/BoardPostDetail/detail.module.scss";

export const HiddenPost = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  setReportStatusPop: React.Dispatch<React.SetStateAction<boolean>>
) => {
  //! 신고 상태 변경 전에 신고건이 선택되었는지 확인하는 함수
  const reportId = e.currentTarget.dataset.checklist;
  console.log("신고 상태를 변경할 아이디 리스트", reportId);

  if (reportId === undefined || reportId === null || reportId === "") {
    return alert("선택된 신고건이 없습니다.");
  } else {
    if (reportId.includes(",")) {
      return alert("하나의 신고건만 선택해주세요.");
    } else {
      setReportStatusPop(true);
    }
  }
};

// 신고 처리 완료
export const reportComplete = async () => {
  const reportId = (
    document.querySelector(".listCheckBtn") as HTMLButtonElement
  ).dataset.checklist;
  const containRelated = (
    document.querySelector('input[name="containRelated"]') as HTMLInputElement
  ).checked;
  console.log("신고 처리할 아이디", reportId);

  const reportCompleteRes = await Apis.put(
    `/api/reports/${reportId}/complete?containRelated=${containRelated}`
  );
  console.log("신고 처리 api", reportCompleteRes);

  if (
    reportCompleteRes.status === 200 &&
    reportCompleteRes.data.status === "success"
  ) {
    alert("신고 처리 상태가 완료로 변경되었습니다.");
    location.href.includes("detail") ? history.back() : location.reload(); // 상세페이지에서 처리할 경우 뒤로가기, 그 외에는 새로고침
  } else {
    alert(
      `신고 처리에 실패하였습니다. 사유 : ${reportCompleteRes.data.message}`
    );
  }
};

// export type ReportStatusPopBox = ({
//   setReportStatusPop,
// }: {
//   setReportStatusPop: React.Dispatch<React.SetStateAction<boolean>>;
// }) => JSX.Element;

export const ReportStatusPopBox = ({
  setReportStatusPop,
}: {
  setReportStatusPop: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Modal
      className={styles.reportModal}
      type="alert"
      closePortal={() => setReportStatusPop(false)}
    >
      <h3>
        해당 신고건에 대해서 정말로 <br />
        완료 처리를 진행하시겠습니까?
      </h3>
      <ToggleBtn
        name="containRelated"
        label="관련된 모든 신고건 처리 여부"
        defaultChecked={false}
      />
      <div className="buttonWrap">
        <Button
          variantStyle="color"
          sizeStyle="lg"
          onClick={() => reportComplete()}
        >
          처리 완료
        </Button>
        <Button
          variantStyle="darkgray"
          sizeStyle="lg"
          onClick={() => setReportStatusPop(false)}
        >
          취소
        </Button>
      </div>
    </Modal>
  );
};
