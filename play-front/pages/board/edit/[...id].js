import LayoutBox from "@/components/LayoutBox/LayoutBox";
import PageTop from "@/components/PageTop/PageTop";
import ReactQuillContainer from "@/components/ReactQuill/ReactQuillContainer";
import Button from "@/components/Button/Button";
import TagInputBox from "@/components/TagInputBox/TagInputBox";
import { VoteIcon, ImportantNoticeIcon } from "@/components/Icon/Icon";
import styles from "./edit.module.scss";
import { useState } from "react";
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";
import { loginCheck } from "@/utils/loginCheck";
import VoteSetBox from '@/components/VoteBox/VoteSetBox';
import { BoardSubmit } from "@/utils/BoardSubmit";

export default function BoardEdit(props) {
  const {
    boardName,
    postId,
    editPostData, // 원본 게시글 데이터
    editVoteData, // 원본 투표 데이터
    editTagData, // 원본 태그 데이터
    isLogin,
  } = props;

  // console.log(editPostData, editVoteData, editTagData);

  loginCheck(isLogin);

  // 로그인은 되어있는데 수정 권한이 없는 경우 게시글 페이지로 이동
  if (isLogin === "true" && editPostData.isMine === false) {
    alert("수정 권한이 없습니다.");
    location.href = `/board/detail/${boardName}/${postId}`;
  }


  const [delVoteData, setDelVoteData] = useState(false); // !기존 투표 삭제 여부
  const [voteItemContent, setVoteItemContent] = useState(["", ""]); // !투표 항목 내용
  const [voteTitle, setVoteTitle] = useState("");// !투표 제목 

  // 로그인 상태로 내가 작성한 게시글인 경우에만 수정 가능
  if (isLogin === "true" && editPostData.isMine === true)
    return (
      <>
        <PageTop backPath={`/board/detail/${boardName}/${postId}`}>
          게시글 수정
        </PageTop>
        <div className={styles.boardWriteWrap}>
          <input
            id="title"
            className={styles.writeTitle}
            type="text"
            placeholder="제목을 입력하세요. 30자이내"
            defaultValue={editPostData.title}
            maxLength={30}
          />
          <ReactQuillContainer content={editPostData.content} />

          {editVoteData !== null ? (
            !delVoteData ? ( // 투표 데이터가 있는 상태에서 투표 삭제 버튼을 누르기 전
              <>
                <div className={styles.boardVote}>
                  <h3>
                    <VoteIcon />
                    {editVoteData.voteName}
                  </h3>
                  <div className={styles.voteTotal}>
                    {Number(editVoteData.totalCount).toLocaleString(
                      "ko-KR"
                    )}
                    명 투표
                  </div>
                  <ul className={styles.boardVoteList}>
                    {editVoteData.voteDetailList.map((item, index) => {
                      const voteCount = item.count;
                      const votePercent =
                        editVoteData.totalCount === 0
                          ? 0
                          : Math.round(
                            (voteCount / editVoteData.totalCount) * 100
                          );
                      return (
                        <li
                          key={index}
                          className={item.isVoted ? styles.active : ""}
                        >
                          <div className={styles.voteBox}>
                            <span
                              className={styles.percentBox}
                              style={{ width: `${votePercent}%` }}
                            ></span>
                            <span className={styles.voteTitle}>
                              {item.content}
                            </span>
                            <span className={styles.percent}>
                              {votePercent}%
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className={styles.notEdit}>
                  <p>
                    <b>
                      <ImportantNoticeIcon /> 투표 수정 불가능
                    </b>
                    <span>
                      기존 투표를 삭제한 후<br />
                      신규 투표 생성
                    </span>
                    이 가능합니다.
                  </p>
                  <Button
                    sizeStyle="xs"
                    variantStyle="darkgray"
                    onClick={() => setDelVoteData(true)}
                  >
                    투표 삭제
                  </Button>
                </div>
              </>
            ) : (
              // 투표 데이터가 있는 상태에서 삭제 버튼을 누른 후
              <VoteSetBox
                delVoteData={true}
                setDelVoteData={setDelVoteData}
                voteItemContent={voteItemContent}
                setVoteItemContent={setVoteItemContent}
                voteTitle={voteTitle}
                setVoteTitle={setVoteTitle}
              />
            )
          ) : (
            // 투표 데이터가 없는 상태 (처음 투표 생성인 경우)
            <VoteSetBox
              delVoteData={false}
              setDelVoteData={setDelVoteData}
              voteItemContent={voteItemContent}
              setVoteItemContent={setVoteItemContent}
              voteTitle={voteTitle}
              setVoteTitle={setVoteTitle}
            />
          )}

          <div className={styles.tagTitle}>해시태그</div>
          <TagInputBox tagData={editTagData} />
          <Button
            variantStyle="color"
            sizeStyle="lg"
            onClick={() => BoardSubmit("edit", voteTitle, voteItemContent, { editVoteData, delVoteData, boardName, postId })}
          >수정하기
          </Button>
        </div>
      </>
    );
}

BoardEdit.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
  const boardName = context.query.id[0] || "free";
  const postId = context.query.id[1] || -1;

  const { accessToken, refreshToken } = getToken(context);
  if (accessToken === "" || refreshToken === "") {
    return {
      redirect: {
        destination: "/board/hot",
        permanent: false
      }
    };
  }

  const editDataRes = await serverSideGetApi(`/api/boards/${boardName}/posts/${postId}`, accessToken, refreshToken, context);
  const editPostData = (await editDataRes.data) || null;

  const editVoteDataRes = await serverSideGetApi(`/api/boards/${boardName}/posts/${postId}/votes`, accessToken, refreshToken, context);
  const editVoteData = (await editVoteDataRes.data) || null;

  const editTagDataRes = await serverSideGetApi(`/api/boards/${boardName}/posts/${postId}/hashtags`, accessToken, refreshToken, context);
  const editTagData = (await editTagDataRes.data) || null;

  return {
    props: {
      editPostData,
      editVoteData,
      editTagData,
      boardName,
      postId,
    },
  };
};
