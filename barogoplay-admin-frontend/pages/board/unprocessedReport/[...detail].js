import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import Layout from '@/components/Layout/Layout'
import BoardPostDetail from '@/components/BoardPostDetail';

// import LevelIcon from "@/components/LevelIcon/LevelIcon";
// import PaginationBox from "@/components/Pagination/PaginationBox";
// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import Apis from "@/components/utils/Apis";
// import styles from "./UnprocessedReport.module.scss";
// import Button from "@/components/Button/Button";
// import { HeartIcon, CommentIcon } from "@/components/Icon/Icon";
// import ReactQuillContainer from "@/components/ReactQuill/ReactQuillContainer";
// import { HiddenPost, ReportStatusPopBox } from '@/components/utils/reportControl';
// import { ArrowBottomRightIcon, LockIcon, VoteIcon } from '@/components/Icon/Icon';
// import ElapsedTime from '@/components/ElapsedTime/ElapsedTime';
// import BlockPopup from '@/components/BlockPopup';
// import Link from 'next/link';
// import { daySet } from '@/components/utils/daySet';

export default function UnprocessedReportDetail(props) {

  // const router = useRouter();

  // const {
  //   isLogin, detailBoardName, detailData: detailDataProps, commentDataProps, voteData, hashTagData, commentPage,
  // } = props;

  // const [detailData, setDetailData] = useState(detailDataProps);
  // const [commentData, setCommentData] = useState(commentDataProps);
  // const [userStatus, setUserStatus] = useState(null)
  // const [boardStatus, setBoardStatus] = useState(detailData.hidden)
  // const [reportStatusPop, setReportStatusPop] = useState(false)



  // useEffect(() => {
  //   // 게시글 및 댓글 유저 상태값(활성,차단 여부) 가져오기
  //   const getUserStatus = async () => {
  //     const useridAll = commentData ? commentData.content.map(item => item.author) : [] // 댓글 작성자 아이디 배열 - 댓글 목록 없으면 빈배열
  //     useridAll.unshift(detailData.author) // 게시글 작성자 아이디 추가
  //     const idList = [...new Set(useridAll)]
  //     const statusList = idList.map(async (item) => {
  //       const userStatusRes = await Apis.get(`/api/users/${item}`);
  //       return { [item]: userStatusRes.data.data.status }
  //     })
  //     const userStatus = await Promise.all(statusList)
  //     const userStatusObj = userStatus.reduce((acc, cur) => {
  //       return { ...acc, ...cur }
  //     })
  //     setUserStatus(userStatusObj)
  //   }
  //   getUserStatus()
  // }, [detailData, commentData])


  // useEffect(() => {

  //   // ! 내 댓글 확인하기 링크 타고 온 경우 해당 스크롤 이동 처리
  //   if (router.query.targetId) {
  //     const location = document.querySelector(".comment" + router.query.targetId);
  //     // 해당 댓글아이디가 현재 댓글 페이지(마지막페이지)에 있는지 확인
  //     if (location) {
  //       setTimeout(() => {
  //         document.querySelector("body").scrollTo({
  //           top: location.offsetTop - window.innerHeight / 2,
  //           behavior: "smooth",
  //         });
  //         location.classList.add(styles.active);
  //       }, 200);
  //     }
  //   }

  //   setCommentData(commentDataProps);
  // }, [detailData, commentDataProps, router.query.targetId]);


  // const [blockPopup, setBlockPopup] = useState({ onoff: false, userId: null, targetId: null, targetType: null })

  // // 차단 버튼 클릭시 차단 사유 저장 팝업 노출 및 차단 대상 데이터 저장
  // const UserBlockBtn = async (targetType, targetId, userId, userStatus, detailBoardName) => {
  //   if (userStatus === "차단") {
  //     // 유저 상태가 이미 차단이면 차단 해제하기
  //     const unblockRes = await Apis.post(`/api/users/unblock?userIds=${userId}&blockedType=COMMUNITY`);
  //     console.log(unblockRes)

  //     if (unblockRes.status === 200 && unblockRes.data.status === "success") {
  //       alert("차단 해제가 완료되었습니다.")
  //       // router.reload()
  //       if (targetType === "POST") {
  //         // 게시글 상세 리프레시
  //         const detailDataRes = await Apis.get(`/api/boards/${detailBoardName}/posts/${targetId}`);
  //         setDetailData(detailDataRes.data.data)
  //       } else {
  //         // 댓글 목록 리프레시
  //         const commentDataRes = await Apis.get(`/api/boards/${detailBoardName}/posts/${detailData.id}/comments?page=${commentPage}&size=${router.query.size}`);
  //         setCommentData(commentDataRes.data.data)
  //       }
  //     } else {
  //       // 실패시 메시지 출력
  //       alert(unblockRes.data.message)
  //     }

  //   } else {
  //     // 유저 상태가 차단 상태가 아니면 차단하기
  //     setBlockPopup({ onoff: true, userId: userId, targetId: targetId, targetType: targetType })
  //   }
  // }

  // // 숨기기 버튼 클릭시 
  // const HideHandler = async (type, commentId) => {
  //   if (type === "POST") {
  //     const hideRes = await Apis.put(`/api/boards/${detailBoardName}/posts/${detailData.id}/hide`);
  //     console.log(hideRes, `/api/boards/${detailBoardName}/posts/${detailData.id}/hide`)
  //     if (hideRes.status === 200 && hideRes.data.status === "success") {
  //       setBoardStatus(true)
  //       alert("게시글 숨김 처리가 완료되었습니다.")
  //     } else {
  //       alert(hideRes.data.message)
  //     }
  //   } else if (type === "COMMENT") {
  //     const hideRes = await Apis.put(`/api/boards/${detailBoardName}/posts/${detailData.id}/comment/${commentId}/hide`);
  //     console.log(hideRes)
  //     if (hideRes.status === 200 && hideRes.data.status === "success") {

  //       // 댓글 목록 리프레시
  //       const commentDataRes = await Apis.get(`/api/boards/${detailBoardName}/posts/${router.query.detailId}/comments?page=${commentPage}&size=${router.query.size}`);
  //       setCommentData(commentDataRes.data.data)
  //       alert("댓글 숨김 처리가 완료되었습니다.")
  //     } else {
  //       alert(hideRes.data.message)
  //     }
  //   }
  // }

  // // 숨기기 해제 버튼 클릭시
  // const ShowHandler = async (type, commentId) => {
  //   if (type === "POST") {
  //     const showRes = await Apis.put(`/api/boards/${detailBoardName}/posts/${detailData.id}/cancelhide`);
  //     console.log(showRes)
  //     if (showRes.status === 200 && showRes.data.status === "success") {
  //       setBoardStatus(false)
  //       alert("게시글 숨김 해제가 완료되었습니다.")
  //     } else {
  //       alert(showRes.data.message)
  //     }
  //   } else if (type === "COMMENT") {
  //     const showRes = await Apis.put(`/api/boards/${detailBoardName}/posts/${detailData.id}/comment/${commentId}/cancelhide`);
  //     console.log(showRes)
  //     if (showRes.status === 200 && showRes.data.status === "success") {

  //       // 댓글 목록 리프레시
  //       const commentDataRes = await Apis.get(`/api/boards/${detailBoardName}/posts/${router.query.detailId}/comments?page=${commentPage}&size=${router.query.size}`);
  //       setCommentData(commentDataRes.data.data)

  //       alert("댓글 숨김 해제가 완료되었습니다.")
  //     } else {
  //       alert(showRes.data.message)
  //     }
  //   }
  // }

  return (
    <BoardPostDetail {...props} />
  )

  // return (
  //   <div className='basicBox'>
  //     <h2>신고 {router.query.commentId ? "댓글" : "게시글"} 상세</h2>

  //     <div className={styles.detailWarp}>
  //       {blockPopup.onoff && (
  //         <BlockPopup blockPopup={blockPopup} setBlockPopup={setBlockPopup} />
  //       )}
  //       {reportStatusPop && (
  //         <ReportStatusPopBox setReportStatusPop={setReportStatusPop} />
  //       )}
  //       <div className={styles.boardDetailWrap}>
  //         <div className={styles.detailHeader}>
  //           <div className={styles.boardTop}>
  //             <h3 className={styles.boardTitle}>
  //               {detailData.title}
  //             </h3>
  //             <div className={styles.boardInfo}>
  //               <div className={styles.infoList}>
  //                 <div className={styles.boardWriter}>
  //                   {detailData.authorNickname}
  //                   <LevelIcon level={detailData.authorLevel}></LevelIcon>
  //                 </div>
  //                 <ul className={styles.infoData}>
  //                   <li>
  //                     <ElapsedTime createdDate={detailData.createdDate} />
  //                   </li>
  //                   <li>조회 {detailData.viewCount.toLocaleString("ko-KR")}</li>
  //                 </ul>
  //               </div>
  //             </div>
  //           </div>
  //           <Button
  //             className="listCheckBtn"
  //             variantStyle="border"
  //             sizeStyle="sm"
  //             onClick={(e) => HiddenPost(e, setReportStatusPop)}
  //             data-checklist={detailData.id}
  //           >신고 상태 변경</Button>
  //         </div>

  //         {/* <div className={styles.boardContent + " boardContent"}></div> */}
  //         <ReactQuillContainer content={detailData.content} readOnly={true} />

  //         {voteData && (
  //           <div className={styles.boardVote}>
  //             <h3>
  //               <VoteIcon />
  //               {voteData.voteName}
  //             </h3>
  //             <div className={styles.voteTotal}>
  //               투표마감일 : {voteData.endDate.split("T")[0].replace(/-/g, ".")} / 총 <b>{Number(voteData.totalCount).toLocaleString("ko-KR")}</b>명 투표 / {voteData.duplicatable ? "중복 투표 가능" : "중복 투표 불가능"}
  //             </div>
  //             <ul className={styles.boardVoteList}>
  //               {voteData.voteDetailList.map((item, index) => {
  //                 const voteCount = item.count;
  //                 const votePercent =
  //                   voteData.totalCount === 0
  //                     ? 0
  //                     : Math.round((voteCount / voteData.totalCount) * 100);
  //                 return (
  //                   <li key={index} className={item.isVoted ? styles.active : ""}>
  //                     <div className={styles.voteBox}>
  //                       <span className={styles.percentBox} style={{ width: `${votePercent}%` }}></span>
  //                       <span className={styles.voteTitle}>{item.content}</span>
  //                       <span className={styles.percent}>{votePercent}%</span>
  //                     </div>
  //                   </li>
  //                 );
  //               })}
  //             </ul>
  //           </div>
  //         )}

  //         {hashTagData && hashTagData.length > 0 && hashTagData[0] !== "" && (
  //           <ul className={styles.boardTag}>
  //             {hashTagData.map((item, index) => {
  //               const itemSet = item.replace("#", "").replace(/ /g, "");
  //               return (
  //                 <li key={index}>
  //                   <Link href={`/board/community/post?boardCode=${detailBoardName}&startDate=2024-04-11&endDate=${daySet(new Date(), 0)}&searchType=hashtag&searchKeyword=${itemSet}`}>
  //                     #{itemSet}
  //                   </Link>
  //                 </li>
  //               )
  //             })}
  //           </ul>
  //         )}

  //         {router.query.commentId && <p className={styles.reference}>해당하는 대상 댓글은 댓글리스트에 별도 색상 표시됩니다.</p>}

  //         <div className={styles.postBottom}>
  //           <div className={styles.countInfo}>
  //             <span>
  //               <HeartIcon color={"#FF0000"} />
  //               좋아요 {detailData.likeCount}
  //             </span>
  //             <span>
  //               <CommentIcon />
  //               댓글 {commentData ? commentData.totalElements : 0}
  //             </span>
  //           </div>
  //           <div className={styles.buttonBox}>
  //             {userStatus && (
  //               userStatus[detailData.author] !== "탈퇴" ? (
  //                 <Button
  //                   variantStyle={userStatus[detailData.author] === "차단" ? "color2" : "color"}
  //                   sizeStyle="sm"
  //                   onClick={() => UserBlockBtn("POST", detailData.id, detailData.author, userStatus[detailData.author], detailBoardName)}
  //                 >
  //                   게시글 작성자 {userStatus[detailData.author] === "차단" ? "차단 해제" : "차단"}
  //                 </Button>
  //               ) : <p className={styles.reference}>탈퇴한 회원 차단 불가</p>
  //             )}
  //             <Button
  //               variantStyle={boardStatus ? "white" : "darkgray"}
  //               sizeStyle="sm"
  //               onClick={() => boardStatus ? ShowHandler("POST") : HideHandler("POST")}
  //             >
  //               게시글 숨김 {boardStatus && "해제"}
  //             </Button>
  //           </div>
  //         </div>



  //         {/* 댓글 목록 */}
  //         <div className={styles.boardBottom}>
  //           <div className={styles.commentCount}>
  //             댓글 {commentData ? commentData.totalElements : 0}
  //             <span>최신순</span>
  //           </div>
  //           {commentData ? (
  //             <>
  //               {Number(commentData.totalElements) === 0 ? (
  //                 <>
  //                   {
  //                     detailData.commentEnabled === false
  //                       ? <p className={styles.emptyText}>댓글 작성이 불가능한 게시글 입니다.</p>
  //                       : <p className={styles.emptyText}>댓글이 없습니다.</p>
  //                   }
  //                 </>
  //               ) : (
  //                 <>
  //                   <ul className={styles.commentList}>
  //                     {commentData.content.map((item, index) => {
  //                       const commentLevel = item.commentLevel; // 대댓글 레벨 판단
  //                       return (
  //                         <li
  //                           key={index}
  //                           className={
  //                             `comment${item.id}` +
  //                             (commentLevel !== 0 ? ` ${styles.commentReply}` : "") +
  //                             (router.query.commentId && Number(router.query.commentId) === item.id ? ` ${styles.active}` : "")
  //                           }
  //                         >
  //                           {commentLevel === 1 && (
  //                             <div className={styles.replyIcon}>
  //                               <ArrowBottomRightIcon />
  //                             </div>
  //                           )}

  //                           <div className={styles.commentTop}>
  //                             <div className={styles.commentWriter}>
  //                               {/* !닉네임 없으면 아이디 노출 되도록 처리 필요 */}
  //                               {item.authorNickname}
  //                               <LevelIcon level={item.userLevelGrade}></LevelIcon>
  //                             </div>
  //                             <div className={styles.commentSet}>

  //                               <div className={styles.countInfo}>
  //                                 <span>
  //                                   <HeartIcon color={"#FF0000"} />
  //                                   좋아요 {item.likeCount}
  //                                 </span>
  //                               </div>



  //                               {userStatus && (
  //                                 userStatus[item.author] !== "탈퇴" ? (
  //                                   <Button
  //                                     variantStyle={userStatus[item.author] === "차단" ? "gray" : "color"}
  //                                     sizeStyle="sm"
  //                                     onClick={() => UserBlockBtn("COMMENT", item.id, item.author, userStatus[item.author], detailBoardName)}>
  //                                     댓글 작성자 {userStatus[item.author] === "차단" ? "차단 해제" : "차단"}
  //                                   </Button>) : <p className={styles.reference}>탈퇴한 회원 차단 불가</p>
  //                               )}

  //                               <Button
  //                                 variantStyle={item.hidden ? "white" : "darkgray"}
  //                                 sizeStyle="sm"
  //                                 onClick={() => item.hidden ? ShowHandler("COMMENT", item.id) : HideHandler("COMMENT", item.id)}
  //                               >
  //                                 댓글 숨김 {item.hidden && "해제"}
  //                               </Button>

  //                             </div>
  //                           </div>
  //                           <div className={styles.commentContent}>
  //                             {detailBoardName === "junggo" ? (
  //                               item.isMine === true ? (
  //                                 item.content
  //                               ) : (
  //                                 <p className={styles.lockComment}>
  //                                   <LockIcon width="13" height="14" />
  //                                   비밀 댓글입니다.
  //                                 </p>
  //                               )
  //                             ) : (
  //                               <span dangerouslySetInnerHTML={{ __html: item.content }}></span>
  //                             )}
  //                           </div>
  //                           <div className={styles.commentDate}>
  //                             <ElapsedTime createdDate={item.createdDate} />
  //                           </div>
  //                         </li>
  //                       );
  //                     })}
  //                   </ul>
  //                   {Number(commentData.totalElements) > 0 ? ( //댓글이 있을때만 노출
  //                     <PaginationBox
  //                       activePage={Number(commentData.number) + 1} //현재 페이지
  //                       itemsCountPerPage={commentData.size} // 페이지당 게시글 수
  //                       totalItemsCount={commentData.totalElements} // 전체 게시글 수
  //                       pageRangeDisplayed={5} // 페이지네이션 범위
  //                     ></PaginationBox>
  //                   ) : null}
  //                 </>
  //               )}
  //             </>
  //           ) : (<div className={styles.dataNullStyle}>댓글 목록이 없습니다.</div>)
  //           }

  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}

UnprocessedReportDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}


export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  const { boardName, detailId, page, size } = context.query;

  const detailBoardName = boardName; //게시판 이름
  const sizeNum = size ? size : 20; //댓글 페이지당 갯수
  const commentPage = page ? page : 0; //댓글 페이지

  const detailConRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}`, accessToken, refreshToken, context);
  const commentRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}/comments?page=${commentPage}&size=${sizeNum}`, accessToken, refreshToken, context);
  console.log("commentRes", commentRes)
  const voteRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}/votes`, accessToken, refreshToken, context);
  const hashTagRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}/hashtags`, accessToken, refreshToken, context);

  const detailData = (await detailConRes.data) || null;
  const commentDataProps = (await commentRes.data) || null;
  const voteData = (await voteRes.data) || null;
  const hashTagData = (await hashTagRes.data) || null;

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

