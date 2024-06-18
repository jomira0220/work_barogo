import styles from "./BoardIconList.module.scss";
import ElapsedTime from "@/components/ElapsedTime/ElapsedTime";
import { PasswordShowHideIcon, HeartIcon, CommentIcon } from "@/components/Icon/Icon";

export default function BoardIconList(props) {
  const { createdDate, viewcount, likecount, commentcount } = props;
  return (
    <ul className={styles.boardCountList}>
      <li className={styles.boardCountItem}>
        <ElapsedTime createdDate={createdDate} />
        <span className="blind">게시글 올라온 시간</span>
      </li>
      <li className={styles.boardCountItem}>
        <PasswordShowHideIcon onoff="on" width="15" height="15" />
        <div>{(viewcount).toLocaleString('ko-kr')}</div>
        <span className="blind">게시글 읽은 수</span>
      </li>
      <li className={styles.boardCountItem}>
        <HeartIcon color="var(--red-color-1)" width="11" height="11" />
        <div>{(likecount).toLocaleString('ko-kr')}</div>
        <span className="blind">게시글 좋아요 수</span>
      </li>
      <li className={styles.boardCountItem}>
        <CommentIcon width="11" height="11" color="var(--gray-color-1)" />
        <div>{(commentcount).toLocaleString('ko-kr')}</div>
        <span className="blind">게시글 댓글 수</span>
      </li>
    </ul>
  );
}
