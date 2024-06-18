import Apis from "@/components/utils/Apis";
import { queryString } from "@/components/utils/queryString";


//! 테이블 아이템 클릭시 상세 페이지 이동 처리용
export const DetailTableItem = (e, router, cell, stringKrChange, filterCategory) => {
  const theadSelect = e.target.parentNode.parentNode.parentNode.children[0].childNodes[0].childNodes[1];

  if (theadSelect !== undefined) {
    // td안에 링크나 체크박스가 없으면 아래 코드 실행
    // 클릭한 요소의 부모의 첫번째 자식의 첫번째 자식의 텍스트 (코드값)
    const tableItem = cell.row.original;
    const boardEnName = tableItem.boardCode || stringKrChange[tableItem.boardName];
    // console.log("tableItem", tableItem)
    // console.log("boardEnName", boardEnName)

    // 광고 관리 상세보기의 경우 활성 상태에 따라서 상세페이지 데이터 설정 변경 노출
    let advertisingStatus = null;
    if (filterCategory === "advertising") {
      advertisingStatus = tableItem.enabled
    }

    const detailIdValue = e.currentTarget.parentNode.children[0].children[0] === undefined
      ? e.currentTarget.parentNode.children[0].innerText // 체크박스가 없으면 첫번째 td의 텍스트
      : e.currentTarget.parentNode.children[1].innerText; // 체크박스가 았으면 두번째 td의 텍스트

    // 클릭한 요소가 input이나 a(링크)가 아니면 상세페이지로 이동
    if (e.target.localName !== "input" || e.target.localName !== "a") {

      let path = router.asPath;
      if (path.includes("templateId") && (path.includes("detailId") || path.includes("boardCode") || path.includes("detailType"))) {
        // 템플릿 아이디만 바뀌는 경우임
        // 경로에 detailId가 있으면 경로의 detailId값만 변경
        if (path.includes("detailId")) path = path.replace(/detailId=\d+/, `detailId=${detailIdValue}`)
        if (path.includes("boardName")) path = path.replace(/boardName=\d+/, `boardName=${boardEnName}`)
        if (path.includes("templateId")) path = path.replace(/templateId=\d+/, `templateId=${tableItem.templateTraceId}`)
        if (path.includes("detailType")) path = path.replace(/detailType=\d+/, `detailType=${filterCategory}`)

        router.push(path)
      } else {
        if (filterCategory === "giftTemplate") {
          // 템플릿 상세 페이지로 이동시 템플릿 아이디를 넘겨줘야함
          router.push(router.pathname + `/detail/?templateId=${tableItem.templateTraceId}&detailType=${filterCategory}`)
        } else if (filterCategory === "communityComment" || filterCategory === "hidingComment") {
          // 댓글 상세 페이지로 이동시 댓글 아이디를 넘겨줘야함
          router.push(
            router.pathname
            + `/detail/?detailId=${tableItem.postId || detailIdValue}`
            + `&commentId=${tableItem.id}`
            + (boardEnName ? `&boardName=${boardEnName}` : "")
            + `&detailType=${filterCategory}`
          )
        } else if (filterCategory === "blockMemberList") {
          // 차단회원리스트 상세 페이지로 이동시 차단된 유저코드를 넘겨줘야함
          router.push(
            router.pathname
            + `/detail/?detailId=${tableItem.userId}`
            + `&detailType=${filterCategory}`
          )
        } else if (filterCategory === "unprocessedReport" || filterCategory === "eventComment") {
          const targetId = tableItem.targetId || tableItem.id;
          // 미처리 신고 페이지 상세 페이지로 이동시 댓글 신고의 경우 댓글 아이디 넘겨줌
          // 신고 상태 변경을 위해서 신고ID도 넘겨줌
          router.push(
            router.pathname
            + `/detail/?detailId=${tableItem.postId || detailIdValue}`
            + (targetId !== tableItem.postId ? `&commentId=${targetId}` : "")
            + (boardEnName ? `&boardName=${boardEnName}` : "")
            + `&detailType=${filterCategory}`
            + (filterCategory === "unprocessedReport" ? `&reportId=${tableItem.id}` : "")
          )
        } else {
          router.push(
            router.pathname
            + `/detail/?detailId=${tableItem.postId || detailIdValue}`
            + (boardEnName ? `&boardName=${boardEnName}` : "")
            + `&detailType=${filterCategory}`
          )
        }
      }
    }
  }
}


//! 저장된 회원리스트 테이블에서 아이템 삭제하기 버튼 클릭 이벤트
export const SaveMemberListDelete = async (id, router) => {
  const alert = window.confirm("해당 회원리스트를 삭제하시겠습니까?")
  if (!alert) return
  const saveMemberListDelRes = await Apis.delete(`/api/userlists/${id}`)
  console.log("회원리스트 삭제 api", saveMemberListDelRes)
  if (saveMemberListDelRes.status === 200 && saveMemberListDelRes.data.status === "success") {
    router.asPath.includes("detail") ? router.push("/savememberlist") : router.reload()
  } else {
    alert(saveMemberListDelRes.data.message)
  }
}


//! 페이지 기본 사이즈 선택에 따른 사이즈 옵션 선택 처리용
export const viewItemCount = [
  { value: 5, label: "5개씩 보기" },
  { value: 10, label: "10개씩 보기" },
  { value: 20, label: "20개씩 보기" },
  { value: 30, label: "30개씩 보기" },
  { value: 40, label: "40개씩 보기" },
  { value: 50, label: "50개씩 보기" },
]
//! 페이지 기본 사이즈 지정 옵션
export const countSelect = (size) => viewItemCount[viewItemCount.findIndex((item) => item.value === Number(size))];


//! 검색 셀렉트 박스 리스트 생성용
export const filterStringSelectOption = (filterSearchSet, filterCategory, stringKrChange) => {
  let filterStringSelectOption = []
  if (filterSearchSet.length === 1) filterStringSelectOption = [{ label: stringKrChange[filterCategory][filterSearchSet[0]], value: filterSearchSet[0] }]
  if (filterSearchSet.length > 1) filterStringSelectOption = filterSearchSet.map((item) => { return { label: stringKrChange[filterCategory][item], value: item } })
  filterStringSelectOption.unshift({ label: "전체", value: "all" })
  return filterStringSelectOption
}


// ! 검색 타입 설정 - 노출중인 쿼리에 검색 타입이 있으면 해당 타입을 기본값으로 설정
export const SearchTypeSet = (router, filterStringSelectOption) => {
  const searchTypeList = filterStringSelectOption // ! 검색 타입 셀렉트 박스 리스트
  return searchTypeList.filter((item) => item.value === router.query.searchType)[0] || searchTypeList[0]
}


//! 전체 체크박스 선택시
export const AllCheckHandler = (filterCategory, CheckBox, setCheckBox) => {
  const dummyCheck = { ...CheckBox }
  const checkAll = document.querySelector(`.${filterCategory} [name='page_check_all']`)
  const checkList = document.querySelectorAll(`.${filterCategory} [name^='check_']`)
  const checkListArr = Array.from(checkList).map((item) => item.getAttribute("name").split("_")[1])

  if (checkAll.checked) {
    // 전체 체크박스 선택시 체크한 아이템 리스트에 추가
    dummyCheck[filterCategory] = [...new Set([...dummyCheck[filterCategory], ...checkListArr])]
  } else {
    // 체크 해제된 것들은 체크리스트에서 제외
    dummyCheck[filterCategory] = dummyCheck[filterCategory].filter((item) => !checkListArr.includes(item))
  }
  setCheckBox(dummyCheck)
}

//! 개별 체크박스 선택시
export const ItemCheckHandler = (filterCategory, CheckBox, setCheckBox, id, TableData) => {

  const dummyCheck = { ...CheckBox }
  const checkAll = document.querySelector(`.${filterCategory} [name='page_check_all']`)
  const checkList = document.querySelectorAll(`.${filterCategory} [name^='check_']`)
  const checkListArr = Array.from(checkList).filter((item) => item.checked === true).map((item) => item.getAttribute("name").split("_")[1]) // 체크된 아이템 아이디 리스트
  const tableDataArr = TableData.map((item) => String(filterCategory === "giftTemplate" ? item.templateTraceId : item.id)) // 테이블 데이터의 아이디 리스트

  if (checkListArr.filter(item => tableDataArr.includes(item)).length === tableDataArr.length) {
    checkAll.checked = true
  } else {
    checkAll.checked = false
  }

  // 개별 체크박스 선택시 체크한 아이템 리스트에 추가 및 삭제 (중복 제거)
  dummyCheck[filterCategory].includes(String(id))
    ? dummyCheck[filterCategory] = dummyCheck[filterCategory].filter((item) => item !== String(id))
    : dummyCheck[filterCategory].push(String(id))

  setCheckBox(dummyCheck)
}


//! 테이블 아이템 텍스트 길이가 길면 스타일 추가
export const longTextCheck = (text) => {
  return text && String(text).substring(0, 4) !== "http"
    ? (text.length > 13 ? true : false)
    : false
}


//! 검색 키워드 기본값 설정 - 노출중인 쿼리에 검색 키워드가 있으면 해당 값을 검색키워드 기본 값으로 설정
export const SearchKeywordSet = (router, differentSearchType, filterCategory) => {
  // differentSearchType : 검색 항목명이 다르게 들어가는 카테고리 리스트
  if (Object.keys(differentSearchType).includes(filterCategory)) {
    return router.query[differentSearchType[filterCategory]] || ""
  } else {
    return router.query.searchKeyword || ""
  }
}


//! 페이지 번호 이동 처리 및 몇개씩 보기 변경시 페이지 이동 & 기본 노출 사이즈 처리
export const PageSizeControl = (value, type, filterCategory, router, separatePage) => {
  // separatePage 배열에 속해있는 filterCategory 페이지들의 경우
  // 페이지 기본사이즈 및 페이징 변경시 노출되는 쿼리url 페이지 항목명을 다르게 처리
  if (separatePage.includes(filterCategory)) {
    if (type === "page") router.query[`${filterCategory}Page`] = value
    if (type === "size") router.query[`${filterCategory}Size`] = value
  } else {
    if (type === "page") router.query.page = value
    if (type === "size") router.query.size = value
  }
  router.push(router.pathname + "?" + queryString(router.query))
}