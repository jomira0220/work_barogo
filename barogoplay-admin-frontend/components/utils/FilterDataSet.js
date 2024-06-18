import { separatePage } from "@/components/utils/separatePage";

export const FilterDataSameCheck = (filterTableData, query) => {
  // filterTableData: filterTableData
  // query: router.query

  // 필터 조건 변경 여부 확인 함수
  let check = false
  // 저장된 필터값이 있는데 쿼리가 변경이 되었을 경우
  Object.keys(filterTableData).map((item) => {
    if (query && query[item]) {
      if (String(filterTableData[item]) !== String(query[item])) {
        check = true
      }
    }
  })
  return check
}

export const FilterDataSet = (filterCategory, query) => {
  // filterCategory: memberList, communityPost, communityNotice, communityComment
  // query: router.query

  // !필터링 기본 조건값 셋팅 - 필터카테고리별로 되어있음

  // 기본 날짜 값 
  // - 오늘
  const defaultDate = new Date().toISOString().slice(0, 10)
  // - 하루 전
  const defaultDateBefore = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10)
  // - 한달 전
  const defaultDateBeforeMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10)
  // - 세달 전
  const defaultDateBeforeThreeMonth = new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().slice(0, 10)

  let set = {

    saveMemberListDetail: {
      // page: 0,
      // size: 10,
      // sort: "createdDate,desc"
    },

    systemNotice: {
      boardCode: "system",
      searchType: "",
      searchKeyword: "",
      page: 0,
      size: 10,
      sort: "createdDate,desc"
    },

    advertising: {
      startDate: defaultDateBeforeMonth,
      endDate: defaultDate,
      searchType: "",
      searchKeyword: "",
      isEnabled: true,
      page: 0,
      size: 10,
      sort: "createdDate,desc",
      type: "image", // image, text
    },

    // 숨김처리 게시글 
    hidingPost: {
      boardCode: "free",
      hiddenStartDate: defaultDateBeforeMonth,
      hiddenEndDate: defaultDate,
      startDate: defaultDateBeforeMonth,
      endDate: defaultDate,
      page: 0,
      size: 10,
      sort: "createdDate,desc",
    },

    // 숨김처리 댓글
    hidingComment: {
      boardCode: "free",
      hiddenStartDate: defaultDateBeforeMonth,
      hiddenEndDate: defaultDateBefore,
      startDate: defaultDateBeforeMonth,
      endDate: defaultDateBefore,
      page: 0,
      size: 10,
      sort: "createdDate,desc",
    },

    blockMemberList: {
      searchKeyword: "",
      searchType: "all",
      // status: "blocked",
      page: 0,
      size: 20,
      sort: "createdDate,desc",
    },


    memberList: {
      brandCode: "",
      inStartDate: defaultDateBeforeThreeMonth,
      inEndDate: defaultDate,
      // lastLoginStartDate: defaultDateBeforeThreeMonth,
      // lastLoginEndDate: defaultDate,
      status: "active", // active, deleted, blocked 활성, 탈퇴, 차단
      totalPointStart: 0,
      totalPointEnd: 0,
      seasonPointStart: 0,
      seasonPointEnd: 0,
      badgeCountStart: 0,
      badgeCountEnd: 0,
      challengeCountStart: 0,
      challengeCountEnd: 0,
      friendCountStart: 0,
      friendCountEnd: 0,
      postCountStart: 0,
      postCountEnd: 0,
      commentCountStart: 0,
      commentCountEnd: 0,
      loginCountStart: 0,
      loginCountEnd: 0,
      searchType: "",
      searchKeyword: "",
      page: 0,
      size: 20,
      sort: "createdDate,desc"
    },

    // 고객센터
    customerService: {
      boardCode: "qna",
      containDeleted: false,
      startDate: defaultDateBeforeMonth,
      endDate: defaultDate,
      hidden: false,
      containFile: "",
      containImage: "",
      searchType: "",
      searchKeyword: "",
      page: 0,
      size: 10,
      sort: "createdDate,desc"
    },

    // 커뮤니티 - 게시글
    communityPost: {
      boardCode: "free",
      containDeleted: false,
      startDate: defaultDateBeforeMonth,
      endDate: defaultDate,
      likeCountUpper: 0,
      hidden: false,
      containFile: "",
      containVote: "",
      containImage: "",
      searchType: "",
      searchKeyword: "",
      page: 0,
      size: 10,
      sort: "createdDate,desc"
    },

    // 커뮤니티 - 공지사항
    communityNotice: {
      boardCode: "free",
      containDeleted: false,
      startDate: defaultDateBeforeMonth,
      endDate: defaultDate,
      likeCountUpper: 0,
      hidden: false,
      containFile: "",
      containVote: "",
      containImage: "",
      searchType: "",
      searchKeyword: "",
      page: 0,
      size: 10,
      sort: "createdDate,desc"
    },

    // 커뮤니티 - 댓글
    communityComment: {
      // boardCode: "free",
      containDeletedComment: false,
      searchType: "",
      searchKeyword: "",
      startDate: defaultDateBeforeMonth,
      endDate: defaultDate,
      page: 0,
      size: 10,
      sort: "createdDate,desc"
    },


    // 배지관리
    badgeManagement: {
      searchKeyword: "",
      searchType: "",
      page: 0,
      size: 10,
      sort: "createdDate,desc"
    },

    // 챌린지관리 - 활성화된 챌린지
    challengeActive: {
      // "searchKeyword": "",
      // "searchType": "",
      page: 0,
      size: 10,
      sort: "createdDate,desc",
    },

    // 챌린지관리 - 비활성화된 챌린지
    challengeInActive: {
      searchKeyword: "",
      searchType: "",
      page: 0,
      size: 10,
      sort: "createdDate,desc",
    },

    // 경험치 관리
    pointManagement: {
      startDate: defaultDateBeforeMonth,
      endDate: defaultDate,
      page: 0,
      size: 10,
      sort: "createdDate,desc",
      userId: "",
    },

    // 알림메세지 - 발송대기
    messageSendWait: {
      page: 0,
      size: 5,
      sort: "createdDate,desc",
    },

    // 알림메세지 - 발송완료
    messageSendComplete: {
      // searchKeyword: "",
      // searchType: "",
      page: 0,
      size: 10,
      sort: "createdDate,desc",
    },

    // 알림메세지 발송내역
    messageSendingHistory: {
      notificationId: "",
      isConfirmed: true,
      page: 0,
      size: 10,
      // sort: "createdDate,desc",
    },

    //배지 달성 현황
    badgeStatistics: {
      searchType: "",
      searchKeyword: "",
      page: 0,
      size: 10,
      sort: "desc",
    },

    //챌린지 달성현황
    challengeStatistics: {
      startDate: defaultDateBefore,
      endDate: defaultDate,
      searchKeyword: "",
      searchType: "",
      page: 0,
      size: 10,
      // sort: "createdDate,desc",
    },

    // 이벤트 댓글
    eventComment: {
      // "boardCode": "event",
      containDeleted: false,
      startDate: defaultDateBeforeMonth,
      endDate: defaultDate,
      likeCountUpper: 0,
      hidden: "",
      containFile: "",
      containVote: "",
      containImage: "",
      searchType: "",
      searchKeyword: "",
      page: 0,
      size: 20,
      sort: "createdDate,desc",
    },

    // 이벤트 게시글
    eventPost: {
      boardCode: "event",
      containDeleted: false,
      startDate: defaultDateBeforeMonth,
      endDate: defaultDate,
      likeCountUpper: 0,
      hidden: false,
      containFile: "",
      containVote: "",
      containImage: "",
      searchType: "",
      searchKeyword: "",
      page: 0,
      size: 20,
      sort: "createdDate,desc",
      ongoing: "",
    },

    // 미처리 신고 게시글
    unprocessedReport: {
      page: 0,
      size: 20,
      sort: "createdDate,desc"
    },

    // 선물 템플릿
    giftTemplate: {
      page: 0,
      size: 10,
      sort: "createdDate,desc"
    },

    // 선물 메세지 발송대기
    giftMessageReserved: {
      sent: false,
      page: 0,
      size: 10,
      sort: "createdDate,desc"
    },

    // 선물 메세지 발송완료
    giftMessageSendComplete: {
      sent: true,
      page: 0,
      size: 10,
      sort: "createdDate,desc"
    },

    // 선물 메세지 발송내역
    giftMessageOrders: {
      received: true,
      templateId: "",
      page: 0,
      size: 20,
      sort: "createdDate,desc"
    },

    // 저장된 회원리스트
    saveMemberList: {
      page: 0,
      size: 10,
      sort: "createdDate,desc"
    },

    // 저장된 회원리스트
    choiceMemberList: {
      page: 0,
      size: 10,
      sort: "desc"
    },

  }


  // 저장된 필터값이 있는데 쿼리가 변경이 되었을 경우
  // 쿼리값으로 필터값을 변경
  Object.keys(set[filterCategory]).map((item) => {
    // item : 필터카테고리 별 api 호출 쿼리 키값
    if (query && query[item]) {
      set[filterCategory][item] = item !== "brandCode"
        ? query[item]
        : typeof query[item] === "string"
          ? [query[item]]
          : query[item]
    }
  })


  separatePage.map((item) => {
    // separatePage 의 item으로 페이징이나 사이즈가 들어온 경우 page 혹은 size 값으로 넣어주기
    if ((filterCategory === item) && query) {
      if (query[`${item}Page`]) set[filterCategory].page = Number(query[`${item}Page`])
      if (query[`${item}Size`]) set[filterCategory].size = Number(query[`${item}Size`])
    }
  })


  return set[filterCategory]

}