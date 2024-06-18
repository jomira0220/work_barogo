import Apis from "@/utils/Apis";
import { SettingIcon, HeartIcon, PencilIcon, CommentIcon, RemoveArrowIcon, ReportSirenIcon } from "@/components/Icon/Icon";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";
import { useState } from "react";
import { badWordCheck } from '@/utils/badWordCheck';


// !게시글 및 댓글 설정 버튼 클릭시 조건에 따른 버튼 노출
export function SettingBtn(props) {

  const {
    className, isLogin, type, SetSettingModalOpen, SettingModalOpen,
    itemData, SetModalConChange, SetCommentSettingOpen
  } = props;

  //isLogin: 로그인 여부
  //SetModalConChange: 모달창 내용 변경 함수
  //clinkEl: 클릭한 버튼의 종류(boardSet: 게시글 설정, commentSet: 댓글 설정)

  const { id, isMine } = itemData;
  //id: 클릭한 버튼의 아이디
  //commentLevel: 댓글의 레벨(1: 대댓글, 0: 댓글)
  //upperCommentId: 대댓글인 경우 기준 댓글의 아이디
  //isMine: 내가 쓴것인지 여부

  let targetId = id; //타겟 아이디

  const SettingBtn = () => {
    // 로그인을 한 상태
    if (isLogin === "true") {
      if (type === "board") {
        if (isMine) {
          // 내가 쓴 글인 경우
          SetModalConChange({ type: "Type_2", targetId: targetId });
        } else {
          // 내가 쓴 글이 아닌 경우
          SetModalConChange({ type: "Type_3", targetId: targetId });
        }
      } else if (type === "comment") {

        const { commentLevel, upperCommentId } = itemData;

        if (commentLevel === 1) {
          // 대댓글인 경우 기준 댓글의 아이디를 타겟으로 변경
          targetId = upperCommentId;
        }

        if (isMine) {
          // 내가 쓴 댓글인 경우
          SetModalConChange({ type: "Type_4", targetId: id });
        } else {
          console.log(targetId);
          // 내가 쓴 댓글이 아닌 경우
          SetModalConChange({ type: "Type_5", targetId: id });
        }
      }
    } else {
      // 로그인을 하지 않은 상태
      SetModalConChange({ type: "Type_1", targetId: 0 });
    }
    // 게시글 설정 클릭시 댓글 입력 창은 닫힘
    SetCommentSettingOpen({ onoff: false, content: "" });
    // 설정 창 노출 토글
    SetSettingModalOpen(!SettingModalOpen);
    // setTargetCommentId(targetId); // 댓글 작성 타켓 값 변경 처리용
  }

  return (
    <button
      className={className}
      data-id={targetId}
      onClick={() => SettingBtn()}
    >
      <span className="blind">{type === "comment" ? "댓글 설정 버튼" : "게시글 설정 버튼"}</span>
      <SettingIcon />
    </button>
  )
};

//! 댓글 좋아요 버튼
export function CommentLikeBtn(props) {
  const { className, isLogin, item, SetSettingModalOpen, SettingModalOpen, boardName, boardId, commentPage, setCommentData } = props;

  const { id: commentId, isLiked, likeCount } = item;

  const CommentLikeControl = async () => {
    if (isLogin === "false") {
      return SetSettingModalOpen(!SettingModalOpen); // 로그인 후 이용 가능 안내 창 노출;
    }

    // !!!좋아요 클릭시 애니메이션 추가 필요
    if (isLiked === false) {
      const likePlusPost = await Apis.post(
        `/api/boards/${boardName}/posts/${boardId}/comments/${commentId}/like`
      );
      console.log("댓글 좋아요", likePlusPost);
    } else {
      const likeMinusPost = await Apis.delete(
        `/api/boards/${boardName}/posts/${boardId}/comments/${commentId}/like`
      );
      console.log("댓글 좋아요 취소", likeMinusPost);
    }

    // 좋아요 클릭시 데이터 업데이트
    const res = await Apis.get(
      `/api/boards/${boardName}/posts/${boardId}/comments?page=${commentPage}&size=20`
    );
    setCommentData(res.data.data);
  };

  return (
    <button className={className} onClick={() => CommentLikeControl()}>
      <span className="blind">댓글 좋아요 버튼</span>
      <HeartIcon
        color={isLiked ? "#FF0000" : "#D0D4DC"}
      />
      <span>{likeCount}</span>
    </button>
  )
}

// !댓글 쓰기 버튼 클릭시 - 등록 버튼 아님
export function CommentBtn(props) {
  const {
    className,
    isLogin,
    targetId,
    commentData,
    SetSettingModalOpen,
    SettingModalOpen,
    CommentSettingOpen,
    SetCommentSettingOpen,
    ModalConChange,
    SetModalConChange,
  } = props;


  // isLogin: 로그인 여부
  // targetId: 대상 아이디
  // commentData: 댓글 데이터
  // SettingModalOpen: 로그인 안내 설정 창 노출 여부
  // SetSettingModalOpen: 로그인 안내 설정 창 노출 함수
  // CommentSettingOpen: 댓글창 열기 닫기 및 댓글 내용 상태
  // SetCommentSettingOpen: 댓글창 열기 닫기 함수


  const CommentSettingHandler = (isLogin, targetId) => {
    if (isLogin === "true") {// 로그인 한 상태
      // 댓글창 열기 닫기
      SetCommentSettingOpen({
        onoff: !CommentSettingOpen.onoff,
        content: "",
      });

      // 댓글 대상 아이디 변경
      SetModalConChange({ type: ModalConChange.type, targetId: targetId })

    } else {// 로그인 하지 않은 상태
      SetSettingModalOpen(!SettingModalOpen); // 로그인 안내 설정 창 노출
    }
  }

  if (targetId === null) { // 게시글 댓글인 경우
    return (
      <button
        className={className}
        onClick={() => CommentSettingHandler(isLogin, targetId)}
      >
        <PencilIcon width="13" height="13" color="var(--black-color-1)" /> 댓글 작성
        {/* {commentData ? commentData.totalElements : 0} */}
      </button>
    )
  } else { // 댓글에 대한 대댓글인 경우
    return (
      <button
        className={className}
        onClick={() => CommentSettingHandler(isLogin, targetId)}
      >
        <span className="blind">대댓글달기 버튼</span>
        <CommentIcon
          color={"#000"}
          width={"11px"}
          height={"11px"}
        />
      </button>
    )

  }
};


// !게시글 좋아요
export const LikeBtn = (props) => {
  const {
    className,
    style,
    isLogin,
    boardName,
    likeData,
    setLikeData,
    boardId,
    SetSettingModalOpen,
    SettingModalOpen
  } = props;

  // !좋아요 데이터 업데이트
  const newLikeDate = async (boardName, boardId) => {
    const Res = await Apis.get(
      `/api/boards/${boardName}/posts/${boardId}`
    );
    const Date = await Res.data.data;
    setLikeData({ isLiked: Date.isLiked, likeCount: Date.likeCount })
  }
  // !좋아요 클릭시
  const LikeControl = async () => {
    if (isLogin === "false") { // 로그인 전이면 로그인 안내 팝업 노출
      return SetSettingModalOpen(!SettingModalOpen); // 로그인 후 이용 가능 안내 창 노출;
    } else {
      if (likeData.isLiked) {
        // 좋아요가 이미 되어있으면 좋아요 취소
        const LikeCountDel = async () => {
          const res = await Apis.delete(
            `/api/boards/${boardName}/posts/${boardId}/like`
          );
          if (res.status === 200 && res.data.status === "success") {
            newLikeDate(boardName, boardId);
          }
        };
        LikeCountDel();
      } else {
        // 좋아요가 안되어있으면 좋아요
        const LikeCountPost = async () => {
          const res = await Apis.post(
            `/api/boards/${boardName}/posts/${boardId}/like`
          );
          if (res.status === 200 && res.data.status === "success") {
            newLikeDate(boardName, boardId);
          }
        };
        LikeCountPost()
      }
    }
  }

  return (
    <button
      className={className}
      onClick={() => LikeControl()}
      style={style && style}
    >
      <HeartIcon width="12" height="12" color={likeData.isLiked ? "#FF0000" : "#D0D4DC"} />{" "}
      좋아요 {likeData.likeCount.toLocaleString("ko-kr")}
    </button>
  )
};


// !댓글 등록 버튼 클릭시
export const CommentSubmitBtn = (props) => {
  // const router = useRouter();
  const {
    className,
    commentPage,
    TargetCommentId,
    detailBoardName,
    detailDataId,
    CommentSettingOpen,
    setCommentData,
    SetCommentSettingOpen,
  } = props;


  const CommentSubmit = async (TargetCommentId) => {

    let commentContent = document.getElementById("commentContent").value; // 댓글 내용
    commentContent = commentContent.replace(/(?:\r\n|\r|\n)/g, '<br />');
    var regURL = new RegExp("(http|https|ftp|telnet|news|irc)://([-/.a-zA-Z0-9_~#%$?&=:200-377()]+)", "gi");
    var regEmail = new RegExp("([xA1-xFEa-z0-9_-]+@[xA1-xFEa-z0-9-]+\.[a-z0-9-]+)", "gi");
    commentContent = commentContent.replace(regURL, "<a href='$1://$2' target='_blank'>$1://$2</a>").replace(regEmail, "<a href='mailto:$1'>$1</a>");

    //! 비속어 포함 여부 체크
    const badWordCheckResult = badWordCheck(commentContent);
    if (badWordCheckResult === false) {
      return alert("댓글 내용에 비속어가 포함되어 등록이 불가능합니다.");
    }

    if (CommentSettingOpen.content === "") {
      // 새로운 댓글 입력
      if (commentContent === "") {
        return alert("댓글 내용을 입력해주세요.");
      } else {
        const commentPost = await Apis.post(
          `/api/boards/${detailBoardName}/posts/${detailDataId}/comments`,
          {
            content: commentContent, // 댓글 내용
            upperCommentId: TargetCommentId,
            // 게시글에 대한 댓글은 null or 댓글의 대댓글은 대상 댓글의 id 숫자 값
          }
        );
        if (
          commentPost.status === 200 &&
          commentPost.data.status === "success"
        ) {
          SetCommentSettingOpen({ onoff: false, content: "" }); // 댓글창 닫기

          const commentDataReset = await Apis.get(
            `/api/boards/${detailBoardName}/posts/${detailDataId}/comments?page=${commentPage}&size=20`
          ); // 댓글 리스트 다시 받아오기

          // 새로 받아온 댓글 리스트로 갱신
          setCommentData(commentDataReset.data.data);
        }
      }
    } else {
      // 댓글 수정 api 호출
      const commentEditPut = await Apis.put(
        `/api/boards/${detailBoardName}/posts/${detailDataId}/comments/${TargetCommentId}`,
        { content: commentContent }
      );
      if (
        commentEditPut.status === 200 &&
        commentEditPut.data.status === "success"
      ) {
        SetCommentSettingOpen({ onoff: false, content: "" }); // 댓글창 닫기

        // 댓글 새로 리스트 다시 받아오기
        const commentDataReset = await Apis.get(
          `/api/boards/${detailBoardName}/posts/${detailDataId}/comments?page=${commentPage}&size=20`
        );

        setCommentData(commentDataReset.data.data); // 새로 받아온 댓글 리스트로 갱신
      }
    }
  };

  return (
    <button
      className={className && className}
      onClick={() => CommentSubmit(TargetCommentId)}>등록</button>
  )
}



// !댓글 수정
export const CommentEditBtn = (props) => {

  const {
    targetId,
    commentData,
    SetCommentSettingOpen
  } = props;

  const CommentEdit = (targetId) => {
    // 수정 전 원본 댓글
    let beforeComment = commentData.content.filter((item) => {
      return item.id === Number(targetId) ? item : "";
    })[0].content;

    beforeComment = beforeComment.replace(/[<]br [/][>]/gi, "\r\n")
    beforeComment = beforeComment.replace(/<a\s+.*?>/g, "").replace(/<\/a>/g, "");

    const location = document.querySelector(`.comment${targetId}`).getBoundingClientRect().top;
    window.scrollTo({ top: document.documentElement.scrollTop + location - 50, behavior: "smooth" });


    // 댓글창 열기 및 수정 전 댓글 내용 노출
    SetCommentSettingOpen({
      onoff: true,
      content: beforeComment,
    });

  }


  return (
    <button onClick={() => CommentEdit(targetId)}>
      <PencilIcon color="#000" />
      댓글 수정하기
    </button>
  )

};

// ! 댓글 삭제
export const CommentDelBtn = (props) => {

  const {
    targetId,
    detailBoardName,
    detailDataId,
    commentPage,
    setCommentData
  } = props;

  const CommentDel = async () => {
    const commentDelRes = await Apis.delete(
      `/api/boards/${detailBoardName}/posts/${detailDataId}/comments/${targetId}`
    );

    if (commentDelRes.status === 200 && commentDelRes.data.status === "success") {
      console.log("댓글 삭제 성공");
    }

    // 댓글 새로 리스트 다시 받아오기
    const commentDataReset = await Apis.get(
      `/api/boards/${detailBoardName}/posts/${detailDataId}/comments?page=${commentPage}&size=20`
    );

    setCommentData(commentDataReset.data.data);
  }

  return (
    <button
      onClick={() => CommentDel()}
    >
      <RemoveArrowIcon />
      댓글 삭제하기
    </button>
  )
};


// !게시글 삭제
export const MyPostDeleteBtn = (props) => {
  const { detailBoardName, targetId, router, isHot } = props;

  const postDelete = async (detailBoardName, targetId, isHot) => {

    if (isHot) {
      alert(`해당 게시글은 HOT 게시글로 삭제가 불가능합니다.`);
    } else {
      const confirm = window.confirm("게시글을 정말로 삭제하시겠습니까?");
      if (!confirm) return;
      const postDel = await Apis.delete(
        `/api/boards/${detailBoardName}/posts/${targetId}`
      );
      if (postDel.status === 200 && postDel.data.status === "success") {
        alert("게시글이 삭제되었습니다.");
        router.pathname.includes("/detail/event/") ? router.push(`/event/${detailBoardName}`) : router.push(`/board/${detailBoardName}`);
      } else {
        alert("게시글 삭제에 실패하였습니다.");
      }
    }
  }
  return (
    <button
      onClick={() =>
        postDelete(detailBoardName, targetId, isHot)
      }
    >
      <RemoveArrowIcon />
      게시글 삭제하기
    </button>
  )

};

// !게시글 수정
export const MyPostEditBtn = (props) => {
  const { detailBoardName, targetId, router, isHot } = props;

  const postEdit = (detailBoardName, targetId, isHot) => {
    if (isHot) {
      alert(`해당 게시글은 HOT 게시글로 수정이 불가능합니다.`);
    } else {
      router.push(`/board/edit/${detailBoardName}/${targetId}`);
    }
  }
  return (
    <button
      onClick={() =>
        postEdit(detailBoardName, targetId, isHot)
      }
    >
      <PencilIcon color="#000" />
      게시글 수정하기
    </button>
  )
};


// ! 게시글 신고 유형 선택 팝업
export const DeclarationModal = (props) => {

  const { className, closeHandler, type, boardName, boardId, commentId } = props;

  //신고 타입 선택
  const SelectOption = [
    { value: "주제나 흐름에 맞지 않음", name: "주제나 흐름에 맞지 않음" },
    { value: "과도한 욕설을 담고 있음", name: "과도한 욕설을 담고 있음" },
    { value: "폭력적인 내용을 담고 있음", name: "폭력적인 내용을 담고 있음" },
    { value: "음란물을 포함하고 있음", name: "음란물을 포함하고 있음" },
    { value: "민감한 개인정보가 노출되어 있음", name: "민감한 개인정보가 노출되어 있음" },
    { value: "특정 대상에 대한 혐오 내용 있음", name: "특정 대상에 대한 혐오 내용 있음" },
    { value: "기타", name: "기타" },
  ];
  // 게시글 검색시 조건 : 제목+내용(기본 조건), 제목, 내용, 닉네임, 해시태그
  // titleOrContent, title, content, nickname, hashtag
  const SelectBox = (props) => {
    const { onChange, option, defaultValue } = props;
    return (
      <select onChange={onChange} value={onoff ? "기타" : option.value}>
        {option.map((option, index) => {
          return (
            <option
              key={index}
              value={option.value}
              defaultValue={defaultValue === option.value}
            >
              {option.name}
            </option>
          );
        })}
      </select>
    );
  };

  const [onoff, setOnoff] = useState(false);

  const reportType = () => {
    const reportValue = document.querySelector(`.${className} select`).value;
    if (reportValue === "기타") {
      setOnoff(true);
    } else {
      setOnoff(false);
    }
    return document.querySelector(`.${className} select`).value
  }

  const DeclarationSubmit = async (type, boardName) => {
    const reportText = onoff ? document.querySelector(`.${className} input[type="text"]`).value : "";
    const typeUrl = type === "comment" ?
      `/api/boards/${boardName}/posts/${boardId}/comments/${commentId}/report`
      : `/api/boards/${boardName}/posts/${boardId}/report`;
    const res = await Apis.post(typeUrl,
      {
        "reportType": reportType(),
        "targetType": type.toUpperCase(),
        "detail": reportText
      }
    );
    console.log('신고하기', res);
    if (res.status === 200 && res.data.status === "success") {
      alert("신고가 접수되었습니다.");
      closeHandler();
    } else {
      alert(res.data.message);
    }
  }

  return (
    <Modal closePortal={() => closeHandler()} className={className}>
      <div className="declarationTop">
        <h5>불량 게시글 및 댓글 신고</h5>
        <p>
          해당 게시글 및 댓글을 신고하신 이유를<br />
          함께 제시해주시면, 관리자가 검토 후<br />
          조치하겠습니다.
        </p>
        <SelectBox
          option={SelectOption}
          onChange={() => reportType()}
          defaultValue={SelectOption[0].value}
        ></SelectBox>
        {onoff && <input type="text" placeholder="신고 내용을 입력해주세요" maxLength={20} autoFocus />}
      </div>
      <div className="declarationBottom">
        <Button
          variantStyle="gray"
          sizeStyle="lg"
          onClick={() => closeHandler()}
        >
          닫기
        </Button>
        <Button
          variantStyle="color"
          sizeStyle="lg"
          onClick={() => DeclarationSubmit(type, boardName)}
        >
          신고하기
        </Button>
      </div>
    </Modal>
  )
}

