import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import Layout from '@/components/Layout/Layout'
import BoardPostDetail from '@/components/BoardPostDetail';

// import LevelIcon from "@/components/LevelIcon/LevelIcon";
// import PaginationBox from "@/components/Pagination/PaginationBox";
// import Button from "@/components/Button/Button";
// import ElapsedTime from "@/components/ElapsedTime/ElapsedTime";
// import VoteBox from "@/components/VoteBox/VoteBox";
// // import Modal from "@/components/Modal/Modal";
// // import InfoModal from "@/components/InfoModal/InfoModal";
// import Link from "next/link";
// import {
//   LockIcon,
//   ReportSirenIcon,
//   ArrowBottomRightIcon,
//   AddFriendIcon,
// } from "@/components/Icon/Icon";
// import {
//   LikeBtn,
//   CommentBtn,
//   CommentLikeBtn,
//   CommentSubmitBtn,
//   CommentEditBtn,
//   CommentDelBtn,
//   DeclarationModal,
//   MyPostEditBtn,
//   MyPostDeleteBtn,
//   SettingBtn,
// } from "@/components/BoardSetting/BoardSetting";

// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";

// // import Apis from "@/components/utils/Apis";
// import styles from "./detail.module.scss";
// import ReactQuillContainer from "@/components/ReactQuill/ReactQuillContainer";

export default function EventCommentDetail(props) {

  return (
    <BoardPostDetail {...props} />
  )

  // const router = useRouter();

  // const {
  //   isLogin,
  //   boardName: detailBoardName,
  //   detailData,
  //   commentDataProps,
  //   voteData,
  //   hashTagData,
  //   commentPage,
  // } = props;

  // console.log(detailBoardName)


  // const [commentData, setCommentData] = useState(commentDataProps);

  // // !게시글 및 댓글 설정 모달 노출 관련
  // const [SettingModalOpen, SetSettingModalOpen] = useState(false);

  // // !유저 상태에 따른 설정 창 노출 내용 변경 관련
  // const [ModalConChange, SetModalConChange] = useState({
  //   type: "Type_1",
  //   targetId: null,
  // });


  // // !댓글 쓰기 input 창 노출 관련
  // const [CommentSettingOpen, SetCommentSettingOpen] = useState({
  //   onoff: false,
  //   content: "",
  // });

  // useEffect(() => {
  //   setCommentData(commentDataProps);
  // }, [router, detailData, commentDataProps]);


  // const OutAreaClick = (e) => {
  //   // !설정창 바깥영역 클릭시 팝업 닫기
  //   if (SettingModalOpen) {
  //     SetSettingModalOpen(false);
  //   }
  //   // !댓글창 바깥영역 클릭시 팝업 닫기
  //   if (e.target.id !== "commentContent" && CommentSettingOpen.onoff) {
  //     SetCommentSettingOpen({
  //       onoff: false,
  //       content: CommentSettingOpen.content,
  //     });
  //   }
  // };



  // return (
  //   <div className='basicBox'>
  //     <h2>댓글 상세</h2>
  //     <div
  //       className={
  //         styles.detailWarp + (CommentSettingOpen.onoff ? ` ${styles.on}` : "")
  //       }
  //       onClick={(e) => OutAreaClick(e)}
  //     >
  //       {DeclarationPopup.onoff && (
  //         <DeclarationModal
  //           className={styles.declarationModal}
  //           type={DeclarationPopup.type}
  //           closeHandler={() => CloseHandler()}
  //           boardName={detailBoardName}
  //           boardId={detailData.id}
  //           commentId={ModalConChange.targetId}
  //         ></DeclarationModal>
  //       )}


  //       <div className={styles.boardDetailWrap}>
  //         <div className={styles.boardTop}>
  //           <h3 className={styles.boardTitle}>{detailData.title}</h3>
  //           <div className={styles.boardInfo}>
  //             <div className={styles.infoList}>
  //               <div className={styles.boardWriter}>
  //                 {detailData.authorNickname}
  //                 <LevelIcon level={detailData.authorLevel}></LevelIcon>
  //               </div>
  //               <ul className={styles.infoData}>
  //                 <li>
  //                   <ElapsedTime createdDate={detailData.createdDate} />
  //                 </li>
  //                 <li>조회 {detailData.viewCount.toLocaleString("ko-KR")}</li>
  //               </ul>
  //             </div>

  //             {/* 설정 버튼 - 게시글 수정, 삭제, 신고, 친구추가*/}
  //             {/* <SettingBtn
  //               isLogin={isLogin}
  //               type="board"
  //               SetSettingModalOpen={SetSettingModalOpen}
  //               SettingModalOpen={SettingModalOpen}
  //               itemData={detailData}
  //               SetModalConChange={SetModalConChange}
  //               CommentSettingOpen={CommentSettingOpen}
  //               SetCommentSettingOpen={SetCommentSettingOpen}
  //             /> */}
  //           </div>
  //         </div>

  //         {/* <div className={styles.boardContent + " boardContent"}></div> */}
  //         <ReactQuillContainer content={detailData.content} readOnly={true} />

  //         <VoteBox
  //           voteData={voteData}
  //           detailData={detailData}
  //           detailBoardName={detailBoardName}
  //           isLogin={isLogin}
  //           SettingModalOpen={SettingModalOpen}
  //           SetSettingModalOpen={SetSettingModalOpen}
  //         />

  //         {hashTagData.length > 0 && hashTagData[0] !== "" && (
  //           <ul className={styles.boardTag}>
  //             {hashTagData.map((item, index) => {
  //               const itemSet = item.replace("#", "").replace(/ /g, "");
  //               return <li key={index}><Link href={`/board/${detailBoardName}?searchType=hashtag&searchKeyword=${itemSet}`}>#{itemSet}</Link></li>;
  //             })}
  //           </ul>
  //         )}

  //         <div className={styles.buttonBox}>
  //           {/* 좋아요 버튼 */}
  //           {/* <LikeBtn
  //           className={styles.likeCount}
  //           isLogin={isLogin}
  //           boardName={detailBoardName}
  //           boardId={detailData.id}
  //           likeData={likeData}
  //           setLikeData={setLikeData}
  //           SetSettingModalOpen={SetSettingModalOpen}
  //           SettingModalOpen={SettingModalOpen}
  //           style={{ width: !detailData.commentEnabled ? "100%" : "50%" }}
  //         ></LikeBtn> */}

  //           {/* 댓글 작성 */}
  //           {/* {
  //             detailData.commentEnabled !== false && (
  //               <CommentBtn
  //                 className={styles.commentCount}
  //                 isLogin={isLogin}
  //                 targetId={null}
  //                 commentData={commentData}
  //                 SettingModalOpen={SettingModalOpen}
  //                 SetSettingModalOpen={SetSettingModalOpen}
  //                 CommentSettingOpen={CommentSettingOpen}
  //                 SetCommentSettingOpen={SetCommentSettingOpen}
  //                 ModalConChange={ModalConChange}
  //                 SetModalConChange={SetModalConChange}
  //               ></CommentBtn>
  //             )
  //           } */}

  //         </div>



  //         {/* 댓글 목록 */}
  //         <div className={styles.boardBottom}>
  //           <div className={styles.commentCount}>
  //             댓글 {commentData ? commentData.totalElements : 0}
  //           </div>
  //           {commentData && Number(commentData.totalElements) === 0 ? (
  //             <>
  //               {
  //                 detailData.commentEnabled === false
  //                   ? <p className={styles.emptyText}>댓글 작성이 불가능한 게시글 입니다.</p>
  //                   : <p className={styles.emptyText}>댓글이 없습니다.</p>
  //               }
  //             </>
  //           ) : (
  //             <>
  //               <ul className={styles.commentList}>
  //                 {commentData.content.map((item, index) => {
  //                   // console.log(item);
  //                   const commentLevel = item.commentLevel; // 대댓글 레벨 판단
  //                   return (
  //                     <li
  //                       key={index}
  //                       className={
  //                         `comment${item.id}` +
  //                         (commentLevel !== 0 ? ` ${styles.commentReply}` : "")
  //                       }
  //                     >
  //                       {commentLevel === 1 && (
  //                         <div className={styles.replyIcon}>
  //                           <ArrowBottomRightIcon />
  //                         </div>
  //                       )}

  //                       <div className={styles.commentTop}>
  //                         <div className={styles.commentWriter}>
  //                           {/* !닉네임 없으면 아이디 노출 되도록 처리 필요 */}
  //                           {item.authorNickname}
  //                           <LevelIcon level={item.userLevelGrade}></LevelIcon>
  //                         </div>
  //                         <div className={styles.commentSet}>
  //                           {item.isVisible && (
  //                             <>
  //                               {/* 대댓글 버튼 */}
  //                               <CommentBtn
  //                                 className={styles.commentItemBox}
  //                                 isLogin={isLogin}
  //                                 targetId={
  //                                   item.commentLevel === 0
  //                                     ? item.id
  //                                     : item.upperCommentId
  //                                 }
  //                                 commentData={commentData}
  //                                 SetSettingModalOpen={SetSettingModalOpen}
  //                                 SettingModalOpen={SettingModalOpen}
  //                                 CommentSettingOpen={CommentSettingOpen}
  //                                 SetCommentSettingOpen={SetCommentSettingOpen}
  //                                 ModalConChange={ModalConChange}
  //                                 SetModalConChange={SetModalConChange}
  //                               />

  //                               {/* 댓글 좋아요 버튼 */}
  //                               <CommentLikeBtn
  //                                 className={styles.heartBox}
  //                                 isLogin={isLogin}
  //                                 item={item}
  //                                 SetSettingModalOpen={SetSettingModalOpen}
  //                                 SettingModalOpen={SettingModalOpen}
  //                                 boardName={detailBoardName}
  //                                 boardId={detailData.id}
  //                                 commentPage={commentPage}
  //                                 setCommentData={setCommentData}
  //                               />

  //                               {/* 댓글 설정 버튼 */}
  //                               <SettingBtn
  //                                 isLogin={isLogin}
  //                                 type="comment"
  //                                 SetSettingModalOpen={SetSettingModalOpen}
  //                                 SettingModalOpen={SettingModalOpen}
  //                                 itemData={item}
  //                                 SetModalConChange={SetModalConChange}
  //                                 CommentSettingOpen={CommentSettingOpen}
  //                                 SetCommentSettingOpen={SetCommentSettingOpen}
  //                               />
  //                             </>
  //                           )}
  //                         </div>
  //                       </div>
  //                       <div className={styles.commentContent}>
  //                         <span dangerouslySetInnerHTML={{ __html: item.content }}></span>
  //                       </div>
  //                       <div className={styles.commentDate}>
  //                         <ElapsedTime createdDate={item.createdDate} />
  //                       </div>
  //                     </li>
  //                   );
  //                 })}
  //               </ul>
  //               {Number(commentData.totalElements) > 0 ? ( //댓글이 있을때만 노출
  //                 <PaginationBox
  //                   activePage={commentData.totalPages} //현재 페이지
  //                   itemsCountPerPage={commentData.size} // 페이지당 게시글 수
  //                   totalItemsCount={commentData.totalElements} // 전체 게시글 수
  //                   pageRangeDisplayed={5} // 페이지네이션 범위
  //                 ></PaginationBox>
  //               ) : null}
  //             </>
  //           )}
  //         </div>
  //       </div>
  //       {/* 댓글 입력창 */}
  //       {CommentSettingOpen.onoff && (
  //         <div className={styles.commentSettingBox}>
  //           <textarea
  //             id="commentContent"
  //             type="text"
  //             placeholder="댓글을 입력해주세요. (300자 이내)"
  //             defaultValue={CommentSettingOpen.content} // 댓글 내용
  //             maxLength={300}
  //             // onKeyDown={(e) => {
  //             //   e.key === "Enter" &&
  //             //     document.querySelector(`.commentSubmitBtn`).click();
  //             // }}
  //             autoFocus
  //           />
  //           <CommentSubmitBtn
  //             className="commentSubmitBtn"
  //             commentPage={commentPage}
  //             TargetCommentId={ModalConChange.targetId}
  //             detailBoardName={detailBoardName}
  //             detailDataId={detailData.id}
  //             CommentSettingOpen={CommentSettingOpen}
  //             setCommentData={setCommentData}
  //             SetCommentSettingOpen={SetCommentSettingOpen}
  //           />
  //         </div>
  //       )}
  //       {/**  ~~~게시글 및 댓글 관련 설정창 */}
  //       {SettingModalOpen && (
  //         <div className={styles.settingModal}>
  //           {ModalConChange.type === "Type_5" ? ( // 로그인 한 상태로 해당 댓글 작성자가 본인이 아닌 경우
  //             <>
  //               <button onClick={() => OpenHandler("comment")}>
  //                 <ReportSirenIcon />
  //                 댓글 신고하기
  //               </button>
  //               <button
  //                 onClick={() =>
  //                   AddFriendBtn(
  //                     detailData.authorUsername,
  //                     detailData.authorNickname
  //                   )
  //                 }
  //               >
  //                 <AddFriendIcon
  //                   color="var(--black-color-1)"
  //                   width="16"
  //                   height="16"
  //                 />
  //                 친구 추가하기
  //               </button>
  //             </>
  //           ) : // 로그인 한 상태로 해당 게시글 작성자가 본인이 아닌 경우
  //             ModalConChange.type === "Type_2" ? (
  //               <>
  //                 <MyPostEditBtn
  //                   detailBoardName={detailBoardName}
  //                   targetId={ModalConChange.targetId}
  //                   likeCount={detailData.likeCount}
  //                   router={router}
  //                   isHot={detailData.isHot}
  //                 />
  //                 <MyPostDeleteBtn
  //                   detailBoardName={detailBoardName}
  //                   targetId={ModalConChange.targetId}
  //                   likeCount={detailData.likeCount}
  //                   router={router}
  //                   isHot={detailData.isHot}
  //                 />
  //               </>
  //             ) : // 로그인 한 상태로 해당 게시글 작성자가 본인이 아닌 경우
  //               ModalConChange.type === "Type_3" ? (
  //                 <>
  //                   <button onClick={() => OpenHandler("post")}>
  //                     <ReportSirenIcon />
  //                     게시글 신고하기
  //                   </button>
  //                   <button
  //                     onClick={() =>
  //                       AddFriendBtn(
  //                         detailData.authorUsername,
  //                         detailData.authorNickname
  //                       )
  //                     }
  //                   >
  //                     <AddFriendIcon
  //                       color="var(--black-color-1)"
  //                       width="16"
  //                       height="16"
  //                     />
  //                     친구 추가하기
  //                   </button>
  //                 </>
  //               ) : // 로그인 한 상태로 해당 댓글 작성자가 본인인 경우
  //                 ModalConChange.type === "Type_4" ? (
  //                   <>
  //                     <CommentEditBtn
  //                       targetId={ModalConChange.targetId}
  //                       commentData={commentData}
  //                       SetCommentSettingOpen={SetCommentSettingOpen}
  //                     />
  //                     <CommentDelBtn
  //                       targetId={ModalConChange.targetId}
  //                       detailBoardName={detailBoardName}
  //                       detailDataId={detailData.id}
  //                       commentPage={commentPage}
  //                       setCommentData={setCommentData}
  //                     />
  //                   </>
  //                 ) : (
  //                   ModalConChange.type === "Type_1" && ( // 로그인 하지 않은 경우
  //                     <div className={styles.loginPop}>
  //                       로그인 후 이용 가능합니다.{" "}
  //                       <Button
  //                         sizeStyle="xs"
  //                         variantStyle="color"
  //                         onClick={() =>
  //                           router.push(
  //                             `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`
  //                           )
  //                         }
  //                       >
  //                         로그인 하기
  //                       </Button>
  //                     </div>
  //                   )
  //                 )}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}

EventCommentDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}


export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  const { boardName, detailId, page, size } = context.query;

  const sizeNum = size ? size : 20; //댓글 페이지당 갯수

  const lastPage = await serverSideGetApi(
    `/api/boards/${boardName}/posts/${detailId}/comments?size=${sizeNum}`,
    accessToken,
    refreshToken,
    context
  );
  const lastPageData = (await lastPage.data) || 1;


  //댓글 페이지 넘버 - 기본은 마지막 페이지부터 보이도록
  const commentPage = page ? page : lastPageData.totalPages - 1;


  const detailConRes = await serverSideGetApi(
    `/api/boards/${boardName}/posts/${detailId}`,
    accessToken,
    refreshToken,
    context
  );

  const commentRes = await serverSideGetApi(
    `/api/boards/${boardName}/posts/${detailId}/comments?page=${commentPage}&size=${sizeNum}`,
    accessToken,
    refreshToken,
    context
  );

  const voteRes = await serverSideGetApi(
    `/api/boards/${boardName}/posts/${detailId}/votes`,
    accessToken,
    refreshToken,
    context
  );

  const hashTagRes = await serverSideGetApi(
    `/api/boards/${boardName}/posts/${detailId}/hashtags`,
    accessToken,
    refreshToken,
    context
  );

  const detailData = (await detailConRes.data) || null;
  const commentDataProps = (await commentRes.data) || null;
  const voteData = (await voteRes.data) || null;
  const hashTagData = (await hashTagRes.data) || null;

  let detailBoardName = boardName;

  return {
    props: {
      detailBoardName,
      detailData,
      commentDataProps,
      voteData,
      hashTagData,
      commentPage,
    },
  };
};
