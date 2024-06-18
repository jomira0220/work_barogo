import Link from "next/link";
import styles from "./BoardList.module.scss";
import BoardIconList from "@/components/BoardIconList/BoardIconList";
import LevelIcon from "@/components/LevelIcon/LevelIcon";
import { TextOverflow } from "@/utils/TextOverflow";

export default function BoardList(props) {
  const { data: boardListData } = props;
  return (
    <ul className={styles.boardList}>
      {boardListData.map((item, index) => {
        return (
          <li key={index} className={styles.boardListItem}>
            <Link className={styles.listLink} href={`/board/detail/${item.boardCode}/${item.id}`}>
              <div className={styles.leftBox}>
                <div className={styles.subject}>
                  {TextOverflow(item.title, 45)}
                </div>
                <div className={styles.postInfo}>
                  <div className={styles.nickname}>
                    {item.authorNickname}
                    <LevelIcon level={item.authorLevelGrade} />
                  </div>
                  <BoardIconList
                    createdDate={item.createdDate}
                    viewcount={item.viewCount}
                    likecount={item.likeCount}
                    commentcount={item.commentCount}
                  />
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
