import Apis from "@/components/utils/Apis";
import { badWordCheck } from "@/components/utils/badWordCheck";
import { TimeKoChange } from "@/components/utils/TimeKoChange";

// !게시글 수정 및 등록 api 호출
export const BoardEdit = async (type, voteTitle, voteItemContent, uploadImgUrl, dataSet) => {

  const { editVoteData, delVoteData, boardName, postId, writePage, startDate, endDate } = dataSet;

  // ~투표 데이터
  const CheckVote = document.getElementById("voteCheckBox") && document.getElementById("voteCheckBox").checked === true
  let voteData = null
  if (CheckVote) {
    voteData = {
      voteName: voteTitle,
      endDate: document.querySelector("[name='voteEndDate']").value,
      duplicatable: document.querySelector("[name='voteDuplicate']").checked
        ? true
        : false,
      voteDetailList: voteItemContent.map((item, index) => {
        return {
          content: item,
          viewOrder: Number(index) + 1,
        }
      }),
    };

    //! 투표 데이터 비속어 체크
    const voteDataBadWordCheck = badWordCheck(voteData.voteName)
    const voteDataDetailBadWordCheck = voteData.voteDetailList.map((item) => { return badWordCheck(item.content) })
    if (voteDataBadWordCheck === false || voteDataDetailBadWordCheck.indexOf(false) !== -1) {
      return alert("투표 질문 혹은 항목에 비속어가 포함되어 등록이 불가능합니다.")
    }
  }
  // console.log("투표데이터", voteData);

  // !태그 데이터
  const tags = document
    .getElementById("tags")
    .value.split(",")
    .map((item) => item.trim());

  //! 태그 데이터 비속어 체크
  const tagBadWordCheck = tags.map((item) => { return badWordCheck(item) })
  if (tagBadWordCheck.indexOf(false) !== -1) {
    return alert("태그에 비속어가 포함되어 등록이 불가능합니다.")
  }

  // ~게시글 전체 데이터
  const writeData = {
    title: document.getElementById("title").value,
    content: document.querySelector(".ql-editor").innerHTML,
    hashtags: { tagNameList: tags }, // ["태그1" , "태그2"]
  };

  // !이미지 업로드가 있는 경우에만 이미지 업로드 데이터를 writeData에 추가
  if (uploadImgUrl) {
    writeData.thumbnailImageUrl = uploadImgUrl
  }

  // !댓글 활성화 체크박스가 있는 경우에만 댓글 활성화 데이터를 writeData에 추가
  if (document.querySelector(`[name='enabledComment']`)) {
    writeData.commentEnabled = document.querySelector(`[name='enabledComment']`).checked
  }

  // !투표 데이터가 있는 경우에만 투표 데이터를 writeData에 추가
  if (CheckVote) {
    writeData.vote = voteData;
  } else if (type === "edit" && delVoteData !== true && editVoteData !== undefined) {
    // 신규 생성을 하지 않고 그대로 유지하는 경우
    writeData.vote = editVoteData
  }


  // !이벤트, 제휴혜택 게시판의 경우에만 추가 데이터를 writeData에 추가
  if (boardName === "event" || boardName === "benefit") {
    const eventBrand = [];
    document.querySelectorAll(`input[name="conditionBrand"]:checked`).forEach((item) => {
      eventBrand.push(item.value)
    })

    writeData.postMeta = {
      eventStartDate: TimeKoChange(startDate),
      eventEndDate: TimeKoChange(endDate),
      eventTargetCompany: eventBrand,
    };
  }

  // !FAQ 게시판의 경우에만 faq카테고리 데이터를 writeData에 추가
  if (boardName === "faq") {
    writeData.postMeta = {
      faqCategory: document.querySelector(`[name="faqCategory"]`).value
    }
  }


  //! 뉴스공지 게시판의 경우에만 타켓 브랜드 데이터를 writeData에 추가
  if (boardName === "news") {
    const eventBrand = Array.from(document.querySelectorAll(`input[name="conditionBrand"]:checked`)).map(item => item.value);
    writeData.postMeta = {
      eventTargetCompany: eventBrand,
    };
  }

  console.log("writeData", writeData);

  const contentText = document.querySelector(".ql-editor").innerText;
  console.log("게시글 텍스트 데이터", contentText);

  //! 게시글 데이터 비속어 체크
  const writeDataBadWordTitleCheck = badWordCheck(writeData.title)
  const writeDataBadWordContentCheck = badWordCheck(contentText)
  if (writeDataBadWordTitleCheck === false || writeDataBadWordContentCheck === false) {
    return alert("제목 혹은 내용에 비속어가 포함되어 등록이 불가능합니다.")
  }


  // ~투표 항목 입력 확인용 변수
  const checkVoteItem = voteItemContent && voteItemContent.map((item) => item === "" ? false : true).includes(false)

  if (writeData.title && writeData.content) {
    if (CheckVote) {
      // 투표 생성 체크박스가 체크되어있는 경우에만 확인 (신규생성인 경우에만 확인)
      if (writeData.vote && writeData.vote.voteName === "") {
        return alert("투표 질문을 입력해주세요.");
      }
      if (writeData.vote && checkVoteItem) {
        return alert("투표 항목을 입력해주세요.");
      }
    }
  } else {
    if (writeData.title === "") {
      return alert("제목을 입력해주세요.");
    }
    if (writeData.content === "") {
      return alert("내용을 입력해주세요.");
    }
  }


  const boardRes = type === "edit"
    ? await Apis.put(`/api/boards/${boardName}/posts/${postId}`, writeData) // ~수정 api 호출
    : await Apis.post(`/api/boards/${writePage}/posts`, writeData)  // ~신규 등록 api 호출

  console.log(`${type === "edit" ? "수정" : "등록"} api 호출`, boardRes);

  if (boardRes.status === 200 && boardRes.data.status === "success") {
    alert(`게시글이 ${type === "edit" ? "수정" : "등록"}되었습니다.`);
    location.href = `/board/${boardName}/post`;
  } else {
    alert(`${type === "edit" ? "수정" : "등록"}에 실패하였습니다. 사유 : `, boardRes.data.message);
  }

};