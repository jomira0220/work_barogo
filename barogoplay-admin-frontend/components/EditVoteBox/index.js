import Button from "@/components/Button/Button";
import DatePickerBox from "@/components/DatePickerBox/DatePickerBox";
import { useState } from "react";
import styles from "./EditVoteBox.module.scss";

export default function EditVoteBox(props) {

  const { loadEl, setDelVoteData } = props;

  // loadEl: 투표 삭제 취소 버튼 노출 여부 - 기존에 등록된 투표 데이터가 있으면 true, 없으면 false
  // voteData: 투표 데이터
  // setDelVoteData: 기존 투표 삭제 여부 - 기존 투표 삭제 취소 버튼 클릭 시 false

  const [voteInputItem, SetVoteItem] = useState(["", ""]);
  const [voteBoxOnoff, setVoteBoxOnoff] = useState(false);

  // 신규 투표 생성 버튼 클릭
  const voteBoxClick = () => {
    const voteBox = document.querySelector(`.${styles.voteBox}`);
    const voteTitle = document.querySelector(`.${styles.voteTitle}`);
    if (voteBoxOnoff) {
      setVoteBoxOnoff(false);
      voteBox.classList.remove(styles.on);
    } else {
      setVoteBoxOnoff(true);
      voteBox.classList.add(styles.on);
      voteTitle.focus();
    }
  };

  // 투표 항목 추가 및 삭제
  const voteHandler = (type) => {
    if (type === "add") {
      // 투표 항목 추가
      voteInputItem.length < 10
        ? SetVoteItem([...voteInputItem, ""])
        : alert("투표항목은 최대 10개까지만 추가할 수 있습니다.");
    } else if (type === "remove") {
      // 투표 항목 삭제
      const dummy = [...voteInputItem];
      dummy.pop();
      SetVoteItem(dummy);
    }
  };


  // 투표 시작일, 종료일
  const voteStartDate = new Date().toISOString().slice(0, 10);
  const voteEndDate = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 10);


  return (
    <>
      <label htmlFor={styles.vote} className={styles.voteCheckbox}>
        <span>
          <input id={styles.vote} name="newVoteCheckBox" type="checkbox" onClick={() => voteBoxClick()} />{" "} 신규 투표 생성
        </span>
        {/* 투표 삭제 취소 버튼 */}
        {loadEl && (
          <Button variantStyle="darkgray" sizeStyle="xs" onClick={() => setDelVoteData(false)}>투표 삭제 취소</Button>
        )}
      </label>

      <div className={styles.voteBox}>
        <input id="vote" className={styles.voteTitle} name="voteTitle" type="text" placeholder="질문을 입력해주세요" />
        <div className={styles.voteItem}>
          {voteInputItem.map((item, index) => {
            return (
              <label htmlFor={`voteItem_${index}`} key={index} name="voteItem">
                <input id={`voteItem_${index}`} type="text" placeholder={`투표항목 ${index + 1}`} />
              </label>
            );
          })}
        </div>
        <div className={styles.voteBtn}>
          {voteInputItem.length > 2 && (
            <Button className={styles.voteMinusBtn} variantStyle="darkgray" sizeStyle="xs" onClick={() => voteHandler("remove")}>- 항목제거</Button>
          )}
          <Button className={styles.votePlusBtn} variantStyle="darkgray" sizeStyle="xs" onClick={() => voteHandler("add")}>+ 항목추가</Button>
        </div>
        <div className={styles.voteDate}>
          <span>투표 마감일</span>
          <div id={styles.voteEndDate}>
            <DatePickerBox
              dateFormat="yy년 M월 d일"
              selected={new Date(voteStartDate)}
              minDate={new Date(voteStartDate)}
              maxDate={new Date(voteEndDate)}
              name="voteEndDate"
            />
          </div>
          <label htmlFor={styles.voteDuplicate} className={styles.voteDuplicate} name="voteDuplicate">
            <input id={styles.voteDuplicate} type="checkbox" />
            중복 투표 가능
          </label>
        </div>
      </div>
    </>
  );
}