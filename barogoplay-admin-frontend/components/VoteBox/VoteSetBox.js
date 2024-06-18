import Button from '@/components/Button/Button';
import DatePickerBox from '@/components/DatePickerBox/DatePickerBox';
import styles from './VoteSetBox.module.scss';
import { useState } from 'react';


export default function VoteSetBox(props) {

  const {
    delVoteData, setDelVoteData,
    voteItemContent, setVoteItemContent,
    voteTitle, setVoteTitle
  } = props;


  // !투표 박스 on/off
  const [voteBoxOnoff, setVoteBoxOnoff] = useState(false);

  // !투표 박스 클릭시 투표 박스 on/off
  const VoteBoxClick = (setVoteBoxOnoff, voteBoxOnoff) => {
    setVoteBoxOnoff(!voteBoxOnoff);
  };

  // !투표 항목 추가 및 삭제
  const VoteAction = (type, voteItemContent, setVoteItemContent) => {
    if (type === "add") {
      if (voteItemContent.length < 10) {
        setVoteItemContent([...voteItemContent, ""])
      } else {
        alert("투표 항목은 최대 10개까지만 추가할 수 있습니다.");
      }
    } else if (type === "remove") {
      const voteContentDummy = [...voteItemContent];
      voteContentDummy.pop();
      setVoteItemContent(voteContentDummy);
    }
  }


  // 투표 시작일, 종료일 (등록일로부터 최대 30일)
  const voteStartDate = new Date().toISOString().slice(0, 10);
  const voteEndDate = new Date(new Date().setDate(new Date().getDate() + 30))
    .toISOString()
    .slice(0, 10);

  // 투표 질문 및 항목 입력시
  const VoteInputChange = (e, index, type, voteItemContent, setVoteItemContent, setVoteTitle) => {
    if (type === "item") {
      const dummy = [...voteItemContent];
      dummy[index] = e.target.value;
      setVoteItemContent(dummy);
    } else if (type === "title") {
      setVoteTitle(e.target.value);
    }
  };

  console.log(delVoteData, "삭제여부")

  return (
    <>
      <label htmlFor={styles.vote} className={styles.voteCheckbox}>
        <span>
          <input
            id="voteCheckBox"
            className={styles.voteCheckBox}
            type="checkbox"
            onClick={() => VoteBoxClick(setVoteBoxOnoff, voteBoxOnoff)}
          />{" "}
          투표 활성화
        </span>
        {
          delVoteData && (
            <Button
              variantStyle="darkgray"
              sizeStyle="xs"
              onClick={() => setDelVoteData(false)}
            >
              투표 삭제 취소
            </Button>
          )
        }
      </label>
      {
        voteBoxOnoff && (
          <div className={styles.voteBox}>
            <input
              id="voteTitle"
              className={styles.voteTitle}
              type="text"
              placeholder="질문을 입력해주세요"
              defaultValue={voteTitle}
              onChange={(e) => VoteInputChange(e, 0, "title", voteItemContent, setVoteItemContent, setVoteTitle)}
              autoFocus
            />
            <div className={styles.voteItem}>
              {voteItemContent.map((item, index) => {
                return (
                  <label htmlFor={`voteItem_${index}`} key={index}>
                    <input
                      id={`voteItem_${index}`}
                      type="text"
                      placeholder={`투표항목 ${index + 1}`}
                      defaultValue={voteItemContent[index]}
                      onChange={(e) => VoteInputChange(e, index, "item", voteItemContent, setVoteItemContent, setVoteTitle)}
                    />
                  </label>
                );
              })}
            </div>

            <div className={styles.voteBtn}>
              {voteItemContent.length > 2 && (
                <Button
                  className={styles.voteMinusBtn}
                  variantStyle="darkgray"
                  sizeStyle="xs"
                  onClick={() => VoteAction("remove", voteItemContent, setVoteItemContent)}
                >
                  - 항목제거
                </Button>
              )}
              <Button
                className={styles.votePlusBtn}
                variantStyle="darkgray"
                sizeStyle="xs"
                onClick={() => VoteAction("add", voteItemContent, setVoteItemContent)}
              >
                + 항목추가
              </Button>
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
              <label
                htmlFor={styles.voteDuplicate}
                className={styles.voteDuplicate}
              >
                <input id={styles.voteDuplicate} type="checkbox" name='voteDuplicate' />
                중복 투표 가능
              </label>
            </div>
          </div>
        )
      }
    </>

  )

}