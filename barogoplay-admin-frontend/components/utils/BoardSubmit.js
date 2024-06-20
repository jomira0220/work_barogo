import Apis from "@/components/utils/Apis";
import { badWordCheck } from "@/components/utils/badWordCheck";


// !게시글 수정 및 등록 api 호출
export const BoardSubmit = async (editVoteData, DelVoteData, router) => {

  const { boardName: detailBoardName, detailId: postId } = router.query;
  const newVoteCheck = document.querySelector("[name='newVoteCheckBox']") && document.querySelector("[name='newVoteCheckBox']").checked === true;
  // 기존 투표 데이터가 있고, 신규 투표 생성 체크박스가 체크되어 있지 않은 경우 기존 투표 데이터 사용
  let voteData = editVoteData !== null && DelVoteData === false ? editVoteData : null;
  if (newVoteCheck) {
    // 신규 투표 생성 체크박스가 체크되어 있는 경우 신규 투표 데이터 생성
    voteData = {
      voteName: document.querySelector("[name='voteTitle']").value, // 투표 질문
      endDate: document.querySelector("[name='voteEndDate']").value, // 투표 종료 날짜 체크박스가 있는지 확인
      duplicatable: document.querySelector("[name='voteDuplicate']").checked ? true : false, // 중복 투표 가능 여부
      voteDetailList: [...document.querySelectorAll("[name='voteItem']")].map((item, index) => {
        return { content: item.value, viewOrder: Number(index) + 1 };
      }), // 투표 항목 리스트
    };
  }
  // console.log("투표데이터", voteData);

  // ~게시글 전체 데이터
  const writeData = {
    title: document.getElementById("title").value, // 게시글 제목
    content: document.querySelector(".ql-editor").innerHTML, // 게시글 내용
    hashtags: { tagNameList: document.getElementById("tags").value.split(",").map((item) => item.trim()) }, // 태그 데이터
    thumbnailImageUrl: "", // 썸네일 이미지 URL
    commentEnabled: document.querySelector(`[name='enabledComment']`).checked, // 댓글 활성화 여부
    vote: voteData, // 투표 데이터
  };

  console.log("게시글 전체 데이터", writeData);

  // ! 데이터 비속어 포함 여부 체크

  if (writeData.vote !== null) { // 투표 데이터 비속어 체크
    const voteDataBadWordCheck = badWordCheck(writeData.vote.voteName);
    const voteDataDetailBadWordCheck = writeData.vote.voteDetailList.map((item) => badWordCheck(item.content));
    if (voteDataBadWordCheck === false || voteDataDetailBadWordCheck.indexOf(false) !== -1) {
      return alert("투표 질문 혹은 항목에 비속어가 포함되어 등록이 불가능합니다.");
    }
  }
  if (writeData.hashtags.tagNameList.length > 0) { // 태그 데이터 비속어 체크
    const tagBadWordCheck = writeData.hashtags.tagNameList.map((item) => badWordCheck(item));
    if (tagBadWordCheck.indexOf(false) !== -1) {
      return alert("태그에 비속어가 포함되어 등록이 불가능합니다.");
    }
  }

  if (writeData.title !== "") { // 게시글 제목 비속어 체크
    const badWordCheckResult = badWordCheck(writeData.title)
    console.log(badWordCheckResult, writeData.title)
    if (badWordCheckResult === false) {
      return alert(`게시글 제목에 비속어가 포함되어 등록이 불가능합니다.`);
    }
  }
  if (writeData.content !== "") { // 게시글 내용 비속어 체크
    const badWordCheckResult = badWordCheck(document.querySelector(".ql-editor").innerText)
    if (badWordCheckResult === false) {
      return alert(`게시글 내용에 비속어가 포함되어 등록이 불가능합니다.`);
    }
  }


  // ~투표 항목 입력 확인용 변수
  if (writeData.title && writeData.content) { // 게시글 제목과 내용이 입력되어 있는 경우

    if (newVoteCheck && voteData.voteName === "") {
      // 신규 투표 생성 체크박스가 체크되어 있고, 투표 질문이 입력되지 않은 경우
      return alert("투표 질문을 입력해주세요.");
    }
    const checkVoteItem = voteData !== null && voteData.voteDetailList.map((item) => (item.content === "" ? false : true)).filter((item) => item === false).length > 0 ? false : true;
    if (newVoteCheck && checkVoteItem === false) {
      // 신규 투표 생성 체크박스가 체크되어 있고, 투표 항목이 입력되지 않은 경우
      return alert("투표 항목을 입력해주세요.");
    }

  } else {
    if (writeData.title === "") {
      return alert("제목을 입력해주세요.");
    }
    if (writeData.content === "") {
      return alert("내용을 입력해주세요.");
    }
  }

  // ~게시글 내용 수정 api 호출
  const DetailEditRes = await Apis.put(`/api/boards/${detailBoardName}/posts/${postId}`, writeData);
  console.log("게시글 내용 수정 api", DetailEditRes);

  if (DetailEditRes.status === 200 && DetailEditRes.data.status !== "error") {
    alert("게시글이 수정되었습니다.");
    router.back()
  } else {
    alert("게시글 수정에 실패했습니다. 사유 : ", DetailEditRes.data.message);
  }
};