import styles from "./BadgeModal.module.scss";
import { RepresentativeIcon } from "@/components/Icon/Icon";
import Button from "@/components/Button/Button";
import { BadgeImg } from "@/pages/activity/badge/index";
import TooltipMessage from "@/components/TooltipMessage";

export default function BadgeModal(props) {
  let { boxTitle, badgeContent, handleClose, } = props;
  console.log("배지 모달 팝업 배지 정보", badgeContent);

  if (badgeContent !== undefined && Object.keys(badgeContent).length > 0) {
    const badgePoint = badgeContent.point.toLocaleString("ko-kr");
    const badgeProgressCount =
      badgeContent.progressCount.toLocaleString("ko-kr");
    const badgeConditionValue =
      badgeContent.conditionValue.toLocaleString("ko-kr");

    return (
      <>
        <div className={styles.modalContent}>
          {boxTitle === "represented" && (
            <div className={`${styles.badgeInfo} ${styles.left}`}>
              <RepresentativeIcon />
            </div>
          )}

          <BadgeImg className="popStyle" $badgeImgUrl={badgeContent.image}>
            <span className="blind">{badgeContent.name}</span>
          </BadgeImg>

          <h4>{badgeContent.name}</h4>
          <p className={styles.gray}>{badgeContent.description}</p>

          <h6 className={styles.badgeConditionValue}>
            <span className={styles.line}></span>
            달성 조건
            <span className={styles.line}></span>
          </h6>
          <p><TooltipMessage message={badgeContent.conditionDescription} /></p>
          {!badgeContent.startDate && !badgeContent.endDate ? "" : (
            <p className={styles.countDate}>
              {badgeContent.startDate &&
                badgeContent.startDate.replace(/-/g, ".").substr(2)}
              {badgeContent.startDate || badgeContent.endDate ? " ~ " : ""}
              {badgeContent.endDate &&
                badgeContent.endDate.replace(/-/g, ".").substr(2)}
            </p>
          )}
          <ul className={`${styles.badgeDetailList}`}>
            {(boxTitle === "Achievement" || boxTitle === "represented") && (
              <li className={styles.count}>{"달성 완료 " + badgeContent.acquireDate.replace(/-/g, ".").substring(2)}</li>
            )}
            {!(boxTitle === "Achievement" || boxTitle === "represented") && (
              <li className={styles.count}>
                {badgeContent.conditionType === "CONSECUTIVE_WORKDAY"
                  ? `${badgeProgressCount} / ${badgeConditionValue} 달성`
                  : badgeContent.conditionType === "DELIVERY_ONEDAY_COUNT" ? `배달 ${badgeConditionValue}건 이상`
                    : Number(badgeProgressCount) >= Number(badgeConditionValue) ? `${badgeConditionValue} 달성` : `${badgeProgressCount} / ${badgeConditionValue} 달성`
                }
              </li>
            )}
            <li className={styles.count2}>{"보상 " + badgePoint + "Exp"}</li>
          </ul>
        </div>
        <div className={styles.buttonArea}>
          <Button sizeStyle="lg" variantStyle="color" onClick={() => handleClose()}>닫기</Button>
        </div>
      </>
    )
  }

}
