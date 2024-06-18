import styles from "./VoteBox.module.scss";
import { useState } from "react";
import { VoteIcon, CheckBoxIcon } from "@/components/Icon/Icon";
import Apis from "@/components/utils/Apis";

export default function VoteBox(props) {
  const {
    voteData,
    detailData,
    detailBoardName,
    isLogin,
    SettingModalOpen,
    SetSettingModalOpen,
  } = props;

  // ! 투표 데이터
  const [Vote, setVote] = useState(voteData);

  const votePost = (e, index, voteItemId, duplicatable) => {
    if (isLogin === "false") {
      e.target.checked = false; // 체크 선택 되지 않도록 처리
      return SetSettingModalOpen(!SettingModalOpen); // 로그인 후 이용 가능 안내 창 노출;
    } else {
      const voteCheck = async () => {
        if (Vote.voteDetailList[index].isVoted) {
          const voteDel = await Apis.delete(
            `/api/boards/${detailBoardName}/posts/${detailData.id}/vote?voteDetailId=${voteItemId}`
          );
          console.log("투표 삭제", voteDel, voteItemId);
          if (voteDel.status === 200 && voteDel.data.status === "success") {
            e.target.parentNode.parentNode.removeAttribute(
              "class",
              styles.active
            );
          }
        } else {
          const voteRes = await Apis.post(
            `/api/boards/${detailBoardName}/posts/${detailData.id}/vote?voteDetailId=${voteItemId}`
          );
          console.log("투표 하기", voteRes, detailBoardName, detailData.id, voteItemId);
          if (voteRes.status === 200 && voteRes.data.status === "success") {
            e.target.parentNode.parentNode.setAttribute("class", styles.active);
          }
        }
        // 투표 데이터 리프레시
        const voteNewGet = await Apis.get(
          `/api/boards/${detailBoardName}/posts/${detailData.id}/votes`
        );
        const voteNewData = await voteNewGet.data.data || null;
        setVote(voteNewData);
      };

      // 중복 투표 가능 여부 체크
      if (
        !duplicatable &&
        Vote.voteDetailList.filter((item) => item.isVoted === true)
          .length > 0
      ) {
        if (Vote.voteDetailList[index].isVoted === true) {
          return voteCheck();
        } else {
          e.target.checked = false;
          return alert("중복 투표가 불가능합니다.");
        }
      } else {
        return voteCheck();
      }
    }
  };

  if (Vote !== null && Vote.voteDetailList !== null)
    return (
      <div className={styles.boardVote}>
        <h3>
          <VoteIcon />
          {Vote.voteName}
        </h3>
        <div className={styles.voteTotal}>
          {Number(Vote.totalCount).toLocaleString("ko-KR")}명 투표
        </div>
        <ul className={styles.boardVoteList}>
          {Vote.voteDetailList.map((item, index) => {
            const voteCount = item.count;
            const votePercent =
              Vote.totalCount === 0
                ? 0
                : Math.round((voteCount / Vote.totalCount) * 100);
            return (
              <li key={index} className={item.isVoted ? styles.active : ""}>
                <label className={styles.checkboxLabel}>
                  <CheckBoxIcon onoff={String(item.isVoted || false)} />
                  <input type="checkbox" defaultChecked={item.isVoted} className={styles.checkBox}
                    name={`voteCheck${index + 1}`}
                    onClick={(e) => {
                      votePost(e, index, item.id, Vote.duplicatable);
                    }} />
                  <div className={styles.voteBox}>
                    <span
                      className={styles.percentBox}
                      style={{ width: `${votePercent}%` }}
                    ></span>
                    <span className={styles.voteTitle}>{item.content}</span>
                    <span className={styles.percent}>{votePercent}%</span>
                  </div>
                </label>

              </li>
            );
          })}
        </ul>
      </div>
    );
}
