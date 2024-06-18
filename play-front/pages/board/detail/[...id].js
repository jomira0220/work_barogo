import styles from "./detail.module.scss";
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import PageTop from "@/components/PageTop/PageTop";
import MarkertingBanner from "@/components/MarketingBanner/MarketingBanner";
import LevelIcon from "@/components/LevelIcon/LevelIcon";
import PaginationBox from "@/components/Pagination/PaginationBox";
import Button from "@/components/Button/Button";
import ElapsedTime from "@/components/ElapsedTime/ElapsedTime";
import VoteBox from "@/components/VoteBox/VoteBox";
import Modal from "@/components/Modal/Modal";
import InfoModal from "@/components/InfoModal/InfoModal";
import Link from "next/link";
import {
  LockIcon,
  ReportSirenIcon,
  ArrowBottomRightIcon,
  AddFriendIcon,
  CommentCheckIcon,
  InfoCircleIcon
} from "@/components/Icon/Icon";
import {
  LikeBtn,
  CommentBtn,
  CommentLikeBtn,
  CommentSubmitBtn,
  CommentEditBtn,
  CommentDelBtn,
  DeclarationModal,
  MyPostEditBtn,
  MyPostDeleteBtn,
  SettingBtn,
} from "@/components/BoardSetting/BoardSetting";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Apis from "@/utils/Apis";
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";
import { Login } from "@/utils/login";
import ReactQuillContainer from '@/components/ReactQuill/ReactQuillContainer';
import { setCookie } from 'cookies-next';

export default function BoardDetail(props) {
  const router = useRouter();
  const {
    isLogin, detailBoardName, detailData, commentDataProps, voteData,
    hashTagData, commentPage, detailConRes, brandCheck
  } = props;

  const [commentData, setCommentData] = useState(commentDataProps);
  const [FriendModal, FriendModalSet] = useState({ onoff: false, modalText: [""], });

  // console.log("hashTagData", hashTagData)
  // console.log("detailData", detailData)
  // console.log("commentPage", commentPage)

  // !친구 요청 모달 닫기
  const ClosePortal = () => {
    FriendModalSet({ onoff: false, modalText: [""] });
  };
  // !친구 추가하기
  const AddFriendBtn = async (author) => {
    const addFriendRes = await Apis.post(`/api/friends`, { searchType: "USERID", name: author });
    // console.log("친구요청", addFriendRes);
    if (addFriendRes.status === 200 && addFriendRes.data.status === "success") {
      FriendModalSet({
        onoff: true,
        modalText: ["친구 요청을 완료하였습니다."],
      });
    } else {
      console.log("친구요청 실패", addFriendRes.data.message)
      FriendModalSet({
        onoff: true,
        modalText: [addFriendRes.data.message],
      });
    }
  };


  // !게시글 및 댓글 설정 모달 노출 관련
  const [SettingModalOpen, SetSettingModalOpen] = useState(false);

  // !유저 상태에 따른 설정 창 노출 내용 변경 관련
  const [ModalConChange, SetModalConChange] = useState({
    type: "Type_1",
    targetId: null,
  });


  // !좋아요 데이터
  const [likeData, setLikeData] = useState({
    isLiked: detailData ? detailData.isLiked : false,
    likeCount: detailData ? detailData.likeCount : 0,
  });

  // !댓글 쓰기 input 창 노출 관련
  const [CommentSettingOpen, SetCommentSettingOpen] = useState({
    onoff: false,
    content: "",
  });

  useEffect(() => {
    setCommentData(commentDataProps); // 댓글 데이터 세팅
  }, [commentDataProps]); //detailData,


  useEffect(() => {
    // ! 내 댓글 확인하기 링크 타고 온 경우 해당 스크롤 이동 처리
    if (router.query.targetId) { //imgLoad &&
      const location = document.querySelector(".comment" + router.query.targetId);
      // 해당 댓글아이디가 현재 댓글 페이지(마지막페이지)에 있는지 확인하여 있는 경우에만 스크롤 이동
      if (location) {
        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollTop + location.getBoundingClientRect().top - 50,
            behavior: "smooth",
          });
          location.classList.add(styles.active);
        }, 200);
      }
    }
  }, [router.query.targetId]); //imgLoad


  // !설정창 및 댓글창 바깥영역 클릭시 팝업 닫기
  const OutAreaClick = (e) => {

    if (e.target.getAttribute("class") === `${styles.plusTextArea}`) {
      // 댓글창 늘리기 버튼 클릭시에는 댓글창 늘리기만 실행
      return;
    }

    // !설정창 바깥영역 클릭시 팝업 닫기
    if (SettingModalOpen) {
      SetSettingModalOpen(false);
      setPlusTextArea(false); // 댓글창 늘리기 초기화
    }
    // !댓글창 바깥영역 클릭시 팝업 닫기
    if (e.target.id !== "commentContent" && CommentSettingOpen.onoff) {
      SetCommentSettingOpen({
        onoff: false,
        content: CommentSettingOpen.content,
      });
      setPlusTextArea(false); // 댓글창 늘리기 초기화
    }
  };

  //!신고 유형 선택 팝업 오픈 및 신고 대상 선택
  const [DeclarationPopup, setDeclarationPopup] = useState({
    onoff: false,
    type: "comment", // comment, post
  });
  const OpenHandler = (type) => {
    setDeclarationPopup({ onoff: true, type: type });
  };
  const CloseHandler = (type) => {
    setDeclarationPopup({ onoff: false, type: type });
  };

  //! 댓글창 늘리기 
  const [plusTextArea, setPlusTextArea] = useState(false);
  const plusTextAreaControl = (e) => {
    const textArea = document.querySelector("#commentContent");
    const textBox = document.querySelector(`.${styles.commentSettingBox}`)

    if (textBox) { // 댓글창이 열려있는 경우에만 실행
      setPlusTextArea(!plusTextArea); // 댓글창 늘리기 또는 줄이기 (스타일 변경 처리)
      setTimeout(() => {
        // document.querySelector('body').scrollIntoView({ behavior: "smooth", block: "end" }); // 스크롤 제일 밑으로 이동
        textArea.focus(); // 댓글창 포커스
      }, 100)
    }
  };


  //! 접근 권한이 없는 상태로 접근했을 경우 
  //! 로그인 페이지로 이동처리 및 로그인 후 해당 페이지로 올수 있도록 쿠키 저장 (login페이지에 관련 설정있음)
  const boardLogin = () => {
    setCookie("beforeLogin", location.href)
    location.href = `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`
  }


  if (detailData !== null) {
    return (
      <div
        className={
          styles.detailWarp
          + (CommentSettingOpen.onoff ? ` ${styles.on}` : "")
          + (plusTextArea ? ` ${styles.plusArea}` : "")
        }
        onClick={(e) => OutAreaClick(e)}
      >
        {DeclarationPopup.onoff && (
          <DeclarationModal
            className={styles.declarationModal}
            type={DeclarationPopup.type}
            closeHandler={() => CloseHandler()}
            boardName={detailBoardName}
            boardId={detailData.id}
            commentId={ModalConChange.targetId}
          ></DeclarationModal>
        )}
        {FriendModal.onoff && (
          <Modal closePortal={() => ClosePortal()}>
            <InfoModal title={FriendModal.modalText}>
              <Button variantStyle="color" sizeStyle="md" onClick={() => ClosePortal()}>닫기</Button>
            </InfoModal>
          </Modal>
        )}
        <PageTop>게시판 상세</PageTop>
        <div className={styles.boardDetailWrap}>
          <div className={styles.boardTop}>
            <h3 className={styles.boardTitle}>{detailData.title}</h3>
            <div className={styles.boardInfo}>
              <div className={styles.infoList}>
                <div className={styles.boardWriter}>
                  {detailData.authorNickname}
                  <LevelIcon level={detailData.authorLevelGrade}></LevelIcon>
                </div>
                <ul className={styles.infoData}>
                  <li>
                    <ElapsedTime createdDate={detailData.createdDate} />
                  </li>
                  <li>조회 {detailData.viewCount.toLocaleString("ko-KR")}</li>
                </ul>
              </div>

              {/* 설정 버튼 - 게시글 수정, 삭제, 신고, 친구추가 : **관리자용 게시판에서는 설정 버튼 미노출 */}
              {
                ["event", "benefit", "news"].includes(detailBoardName)
                  ? ""
                  : (
                    <SettingBtn
                      isLogin={isLogin}
                      type="board"
                      SetSettingModalOpen={SetSettingModalOpen}
                      SettingModalOpen={SettingModalOpen}
                      itemData={detailData}
                      SetModalConChange={SetModalConChange}
                      CommentSettingOpen={CommentSettingOpen}
                      SetCommentSettingOpen={SetCommentSettingOpen}
                    />
                  )
              }

            </div>
          </div>

          {/* <div style={{ display: "none" }} className={styles.boardContent + " boardContent"}></div> */}
          <ReactQuillContainer readOnly={true} content={detailData.content} />

          <VoteBox
            voteData={voteData}
            detailData={detailData}
            detailBoardName={detailBoardName}
            isLogin={isLogin}
            SettingModalOpen={SettingModalOpen}
            SetSettingModalOpen={SetSettingModalOpen}
          />

          {hashTagData.length > 0 && hashTagData[0] !== "" && (
            <ul className={styles.boardTag}>
              {hashTagData.map((item, index) => {
                const itemSet = item.replace("#", "").replace(/ /g, "");
                const adminBoard = ["event", "benefit", "news"];
                const linkSet = adminBoard.includes(detailBoardName) ? "event" : "board";
                return <li key={index}><Link href={`/${linkSet}/${detailBoardName}?searchType=hashtag&searchKeyword=${itemSet}`}>#{itemSet}</Link></li>;
              })}
            </ul>
          )}

          <div className={styles.buttonBox}>
            {/* 좋아요 버튼 */}
            <LikeBtn
              className={styles.likeCount}
              isLogin={isLogin}
              boardName={detailBoardName}
              boardId={detailData.id}
              likeData={likeData}
              setLikeData={setLikeData}
              SetSettingModalOpen={SetSettingModalOpen}
              SettingModalOpen={SettingModalOpen}
              style={{ width: !detailData.commentEnabled ? "100%" : "50%" }}
            ></LikeBtn>

            {/* 댓글 작성 */}
            {detailData.commentEnabled !== false && (
              <CommentBtn
                className={styles.commentCount}
                isLogin={isLogin}
                targetId={null}
                commentData={commentData}
                SettingModalOpen={SettingModalOpen}
                SetSettingModalOpen={SetSettingModalOpen}
                CommentSettingOpen={CommentSettingOpen}
                SetCommentSettingOpen={SetCommentSettingOpen}
                ModalConChange={ModalConChange}
                SetModalConChange={SetModalConChange}
              ></CommentBtn>
            )}

          </div>

          {/* 광고배너 */}
          <MarkertingBanner />

          {/* 댓글 목록 */}
          <div className={styles.boardBottom}>
            <div className={styles.commentCount}>
              댓글 {commentData ? commentData.totalElements : 0} <span>최신 순</span>
            </div>
            {commentData && Number(commentData.totalElements) === 0 ? (
              detailData.commentEnabled === false
                ? <p className={styles.emptyText}>댓글 작성이 불가능한 게시글 입니다.</p>
                : <p className={styles.emptyText}>댓글이 없습니다.</p>
            ) : (
              <>
                <ul className={styles.commentList}>
                  {commentData.content.map((item, index) => {
                    const commentLevel = item.commentLevel; // 대댓글 레벨 판단
                    return (
                      <li
                        key={index}
                        className={
                          `comment${item.id}` +
                          (commentLevel !== 0 ? ` ${styles.commentReply}` : "")
                        }
                      >
                        {commentLevel === 1 && (
                          <div className={
                            styles.replyIcon
                            + (item.isVisible ? "" : ` ${styles.deleteReply}`) // 삭제된 댓글인 경우 스타일 변경
                          }>
                            <ArrowBottomRightIcon />
                          </div>
                        )}

                        {item.isVisible && (
                          <div className={styles.commentTop}>
                            <div className={styles.commentWriter}>

                              {/* 작성자가 댓글을 남긴 경우 닉네임 앞에 표시 추가 */}
                              {detailData.authorNickname === item.authorNickname && (
                                <span className={styles.commentCheckIcon}>
                                  <CommentCheckIcon />
                                </span>
                              )}

                              {/* !닉네임 없으면 아이디 노출 되도록 처리 */}
                              {
                                item.authorNickname !== "" || item.authorNickname !== null
                                  ? item.authorNickname
                                  : item.authorUsername
                              }
                              <LevelIcon level={item.authorLevelGrade}></LevelIcon>
                            </div>

                            <div className={styles.commentSet}>
                              {/* 대댓글 버튼 */}
                              <CommentBtn
                                className={styles.commentItemBox}
                                isLogin={isLogin}
                                targetId={
                                  item.commentLevel === 0
                                    ? item.id
                                    : item.upperCommentId
                                }
                                commentData={commentData}
                                SetSettingModalOpen={SetSettingModalOpen}
                                SettingModalOpen={SettingModalOpen}
                                CommentSettingOpen={CommentSettingOpen}
                                SetCommentSettingOpen={SetCommentSettingOpen}
                                ModalConChange={ModalConChange}
                                SetModalConChange={SetModalConChange}
                              />

                              {/* 댓글 좋아요 버튼 */}
                              <CommentLikeBtn
                                className={styles.heartBox}
                                isLogin={isLogin}
                                item={item}
                                SetSettingModalOpen={SetSettingModalOpen}
                                SettingModalOpen={SettingModalOpen}
                                boardName={detailBoardName}
                                boardId={detailData.id}
                                commentPage={commentPage}
                                setCommentData={setCommentData}
                              />

                              {/* 댓글 설정 버튼 */}
                              <SettingBtn
                                isLogin={isLogin}
                                type="comment"
                                SetSettingModalOpen={SetSettingModalOpen}
                                SettingModalOpen={SettingModalOpen}
                                itemData={item}
                                SetModalConChange={SetModalConChange}
                                CommentSettingOpen={CommentSettingOpen}
                                SetCommentSettingOpen={SetCommentSettingOpen}
                              />
                            </div>
                          </div>
                        )}

                        <div className={styles.commentContent + (item.isVisible ? "" : ` ${styles.deleteComment}`)}>
                          {/* 중고거래 글의 경우 내가 작성한 글인 경우에만 댓글을 볼 수 있도록 */}
                          {detailBoardName === "junggo" ? (
                            item.isMine === true ? (
                              item.content
                            ) : (
                              <p className={styles.lockComment}>
                                <LockIcon width="13" height="14" />
                                비밀 댓글입니다.
                              </p>
                            )
                          ) : (
                            <span dangerouslySetInnerHTML={{ __html: item.content }}></span>
                          )}
                        </div>

                        {item.isVisible && (
                          <div className={styles.commentDate}>
                            <ElapsedTime createdDate={item.createdDate} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {commentData && Number(commentData.totalElements) > 0 && ( //댓글이 있을때만 노출
                  <PaginationBox
                    activePage={Number(commentPage) + 1} //현재 페이지
                    itemsCountPerPage={commentData.size} // 페이지당 게시글 수
                    totalItemsCount={commentData.totalElements} // 전체 게시글 수
                    pageRangeDisplayed={5} // 페이지네이션 범위
                  />
                )}
              </>
            )}
          </div>
        </div>
        {/* 댓글 입력창 */}
        {CommentSettingOpen.onoff && (
          <div className={styles.commentSettingBox + (plusTextArea ? ` ${styles.plusArea}` : "")}>
            <textarea
              id="commentContent"
              type="text"
              autoFocus
              placeholder="댓글을 입력해주세요. (300자 이내)"
              defaultValue={CommentSettingOpen.content} // 댓글 내용
              maxLength={300}
            />

            {/* !!! 글자 입력 박스 사이즈 조절용 */}
            <button
              className={styles.plusTextArea}
              onClick={(e) => plusTextAreaControl(e)}
            >
              {plusTextArea ? "-" : "+"}
            </button>

            {/* 댓글 등록 버튼 */}
            <CommentSubmitBtn
              className="commentSubmitBtn"
              commentPage={commentPage}
              TargetCommentId={ModalConChange.targetId}
              detailBoardName={detailBoardName}
              detailDataId={detailData.id}
              CommentSettingOpen={CommentSettingOpen}
              setCommentData={setCommentData}
              SetCommentSettingOpen={SetCommentSettingOpen}
            // imgLoad={imgLoad}
            />
          </div>
        )}
        {/* 게시글 및 댓글 관련 설정창 */}
        {SettingModalOpen && (
          <div className={styles.settingModal}>
            {ModalConChange.type === "Type_5" ? ( // 로그인 한 상태로 해당 댓글 작성자가 본인이 아닌 경우
              <>
                <button onClick={() => OpenHandler("comment")}>
                  <ReportSirenIcon />
                  댓글 신고하기
                </button>
                <button onClick={() => AddFriendBtn(detailData.author)}>
                  <AddFriendIcon
                    color="var(--black-color-1)"
                    width="16"
                    height="16"
                  />
                  친구 추가하기
                </button>
              </>
            ) :
              ModalConChange.type === "Type_2" ? ( // 로그인 한 상태로 해당 게시글 작성자가 본인이 아닌 경우
                <>
                  <MyPostEditBtn
                    detailBoardName={detailBoardName}
                    targetId={ModalConChange.targetId}
                    router={router}
                    isHot={detailData.isHot}
                  />
                  <MyPostDeleteBtn
                    detailBoardName={detailBoardName}
                    targetId={ModalConChange.targetId}
                    router={router}
                    isHot={detailData.isHot}
                  />
                </>
              ) :
                ModalConChange.type === "Type_3" ? ( // 로그인 한 상태로 해당 게시글 작성자가 본인이 아닌 경우
                  <>
                    <button onClick={() => OpenHandler("post")}>
                      <ReportSirenIcon />
                      게시글 신고하기
                    </button>
                    <button onClick={() => AddFriendBtn(detailData.author)}>
                      <AddFriendIcon color="var(--black-color-1)" width="16" height="16" />
                      친구 추가하기
                    </button>
                  </>
                ) :
                  ModalConChange.type === "Type_4" ? ( // 로그인 한 상태로 해당 댓글 작성자가 본인인 경우
                    <>
                      <CommentEditBtn
                        targetId={ModalConChange.targetId}
                        commentData={commentData}
                        SetCommentSettingOpen={SetCommentSettingOpen}
                      />
                      <CommentDelBtn
                        targetId={ModalConChange.targetId}
                        detailBoardName={detailBoardName}
                        detailDataId={detailData.id}
                        commentPage={commentPage}
                        setCommentData={setCommentData}
                      />
                    </>
                  ) : ModalConChange.type === "Type_1" && ( // 로그인 하지 않은 경우
                    <div className={styles.loginPop}>
                      로그인 후 이용 가능합니다.{" "}
                      <Button
                        sizeStyle="xs"
                        variantStyle="color"
                        onClick={() => Login()}
                      >로그인 하기
                      </Button>
                    </div>
                  )
            }
          </div>
        )}
      </div>
    );
  } else if (detailConRes.message !== '') { // 에러 메세지가 있는 경우
    return (
      <div className={styles.accessRights}>
        <PageTop>게시판 상세</PageTop>
        <div className={styles.accessRightsInner}>
          <InfoCircleIcon width="50" height="50" />
          <h2>
            {(isLogin === "true" && detailConRes.errors.errorCode === "7000") && (brandCheck === "DEALVER" ? "딜버는 " : brandCheck === "BAROGO" ? "바로고는 " : "모아라인은 ")}
            {detailConRes.message}
          </h2>
          {/* 
            에러코드 7000 : 이벤트 대상 브랜드가 아닙니다
            에러코드 8000 : 연동 사용자만 접근가능한 게시글입니다
          */}
          {detailConRes.errors.errorCode === "8000" && (
            isLogin === "true"
              ? <Button variantStyle="color" sizeStyle="lg" onClick={() => location.href = "/user/riderPhoneNumber"}>라이더 코드 연동하기</Button>
              : <Button variantStyle="color" sizeStyle="lg" onClick={() => boardLogin()}>로그인 하기</Button>
          )}
          {detailConRes.errors.errorCode === "7000" && (
            <div className={styles.buttonWarp}>
              <Button variantStyle="color" sizeStyle="lg" onClick={() => location.href = "/"}>홈으로 가기</Button>
              <Button variantStyle="border" sizeStyle="lg" onClick={() => location.href = "/event/event"}>이벤트 페이지로 가기</Button>
            </div>
          )}
        </div>
      </div>
    )
  } else {
    return (
      <div className={styles.accessRights}>
        <PageTop>게시판 상세</PageTop>
        <div className={styles.accessRightsInner}>
          <InfoCircleIcon width="50" height="50" />
          <h2>잘못된 접근입니다.</h2>
          <Button variantStyle="color" sizeStyle="lg" onClick={() => location.href = "/"}>홈으로 가기</Button>
        </div>
      </div>
    )
  }
}

BoardDetail.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  const { id, page, size } = context.query;

  const detailBoardName = id[0]; //게시판 이름
  const detailId = id[1]; //게시글 아이디
  const sizeNum = size ? size : 20; //댓글 페이지당 갯수
  const commentPage = page ? page : 0; //댓글 페이지

  const detailConRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}`, accessToken, refreshToken, context);

  const commentRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}/comments?page=${commentPage}&size=${sizeNum}`, accessToken, refreshToken, context);
  const voteRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}/votes`, accessToken, refreshToken, context);
  const hashTagRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}/hashtags`, accessToken, refreshToken, context);

  const detailData = await detailConRes.data ? detailConRes.data : null;
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
      detailConRes
    },
  };
};
