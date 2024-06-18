import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import Layout from '@/components/Layout/Layout'
import Button from "@/components/Button/Button";
import Apis from "@/components/utils/Apis";
import styles from "./detail.module.scss";
import EditVoteBox from '@/components/EditVoteBox';
import { VoteIcon, ImportantNoticeIcon } from "@/components/Icon/Icon";
import TagInputBox from "@/components/TagInputBox/TagInputBox";
import ToggleBtn from "@/components/ToggleBtn/ToggleBtn";
import { BoardSubmit } from '@/components/utils/BoardSubmit';

import { useRouter } from "next/router";
import { useState } from "react";

import ReactQuillContainer from "@/components/ReactQuill/ReactQuillContainer";

export default function CommunityNoticeDetail(props) {

  const router = useRouter();

  const {
    boardName: detailBoardName,
    detailData,
    editVoteData,
    hashTagData,
    detailId: postId
  } = props;


  console.log("게시글 상세 데이터", props);


  //! 게시글 삭제 api 호출
  const DeleteSubmit = async () => {
    const DeleteRes = await Apis.delete(`/api/boards/${detailBoardName}/posts/${postId}`);
    console.log("게시글 삭제 api 상태", DeleteRes);
    if (DeleteRes.status === 200 && DeleteRes.data.status !== "error") {
      alert("게시글이 삭제되었습니다.");
      router.back()
    } else {
      alert("게시글 삭제에 실패했습니다.");
    }
  }


  // !기존 투표 삭제 여부
  const [DelVoteData, setDelVoteData] = useState(false);


  return (
    <div className='basicBox'>
      <h2>공지글 상세</h2>
      <div className={styles.boardWriteWrap}>
        <input id="title" className={styles.writeTitle} type="text" placeholder="제목을 입력하세요." defaultValue={detailData.title} />
        <ReactQuillContainer content={detailData.content} />
        {editVoteData !== null ? (
          !DelVoteData ? ( // 투표 데이터가 있는 상태에서 투표 삭제 버튼을 누르기 전
            <>
              <div className={styles.boardVote}>
                <h3><VoteIcon /> {editVoteData.voteName}</h3>
                <div className={styles.voteTotal}>
                  투표 마감일 : {editVoteData.endDate.split("T")[0].replace(/-/g, ".")} / 총 <b>{Number(editVoteData.totalCount).toLocaleString("ko-KR")}명</b> 투표 / 중복 투표 {editVoteData.duplicatable ? "가능" : "불가능"}
                </div>
                <ul className={styles.boardVoteList}>
                  {editVoteData.voteDetailList.map((item, index) => {
                    const voteCount = item.count;
                    const votePercent = editVoteData.totalCount === 0 ? 0 : Math.round((voteCount / editVoteData.totalCount) * 100);
                    return (
                      <li key={index} className={item.isVoted ? styles.active : ""}>
                        <div className={styles.voteBox}>
                          <span className={styles.percentBox} style={{ width: `${votePercent}%` }}></span>
                          <span className={styles.voteTitle}>{item.content}</span>
                          <span className={styles.percent}>{votePercent}%</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className={styles.notEdit}>
                <p>
                  <b><ImportantNoticeIcon /> 투표 수정 불가능</b>
                  <span>기존 투표를 삭제한 후<br /> 신규 투표 생성</span>이 가능합니다.
                </p>
                <Button sizeStyle="xs" variantStyle="darkgray" onClick={() => setDelVoteData(true)}>투표 삭제</Button>
              </div>
            </>
          ) : ( // 투표 데이터가 있는 상태에서 삭제 버튼을 누른 후
            <EditVoteBox loadEl={true} setDelVoteData={setDelVoteData} />
          )
        ) : ( // 투표 데이터가 없는 상태 (처음 투표 생성인 경우)
          <EditVoteBox loadEl={false} setDelVoteData={setDelVoteData} />
        )}

        <div className={styles.line}>
          <h3>해시 태그</h3>
          <TagInputBox tagData={hashTagData} />
        </div>

        <div className={styles.line}>
          <h3>댓글 활성화 여부</h3>
          <ToggleBtn name="enabledComment" defaultChecked={detailData.commentEnabled} />
        </div>

        <div className={styles.buttonWrap}>
          <Button variantStyle="color" sizeStyle="sm" onClick={() => BoardSubmit(editVoteData, DelVoteData, router)}>수정하기</Button>
          <Button variantStyle="darkgray" sizeStyle="sm" onClick={() => DeleteSubmit()}>삭제하기</Button>
        </div>
      </div>
    </div>
  );
}

CommunityNoticeDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}


export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  const { boardName, detailId, page, size } = context.query;

  const sizeNum = size ? size : 20; //댓글 페이지당 갯수 - 기본 20개

  const detailConRes = await serverSideGetApi(`/api/boards/${boardName}/posts/${detailId}`, accessToken, refreshToken, context);
  const voteRes = await serverSideGetApi(`/api/boards/${boardName}/posts/${detailId}/votes`, accessToken, refreshToken, context);
  const hashTagRes = await serverSideGetApi(`/api/boards/${boardName}/posts/${detailId}/hashtags`, accessToken, refreshToken, context);

  const detailData = (await detailConRes.data) || null;
  const editVoteData = (await voteRes.data) || null;
  const hashTagData = (await hashTagRes.data) || null;

  return {
    props: {
      boardName,
      detailData,
      editVoteData,
      hashTagData,
      detailId
    },
  };
};
