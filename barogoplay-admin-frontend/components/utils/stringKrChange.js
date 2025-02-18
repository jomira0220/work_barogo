// !테이블에 노출되는 데이터 헤더를 한글로 변경하기 위한 객체

export const stringKrChange = {

  systemNotice: {
    id: "게시글ID",
    boardName: "게시판종류",
    title: "제목",
    image: "이미지",
    userCode: "유저코드",
    authorNickname: "유저닉네임",
    createdDate: "생성일",
    updatedDate: "수정일",
    viewCount: "조회수",
    likeCount: "좋아요수",
    commentCount: "댓글수",
    hashtags: "해시태그",
    hashtag: "해시태그",
    postMeta: "게시글메타",
    qnaStatus: "QnA상태",
    qnaCategory: "QnA유형",
    eventTargetCompany: "이벤트대상브랜드",
    eventStartDate: "이벤트시작일",
    eventEndDate: "이벤트종료일",
    faqCategory: "FAQ유형",
  },

  saveMemberListDetail: {
    id: "유저아이디",
    brandCode: "브랜드",
    nickname: "닉네임",
    hubCode: "허브코드",
    username: "유저아이디",
    riderCode: "라이더코드",
    createdDate: "가입일",
  },

  advertising: {
    id: "광고ID",
    type: "광고타입",
    image: "광고이미지",
    name: "광고명",
    link: "광고링크",
    clickCount: "클릭수",
    startDate: "시작일",
    endDate: "종료일",
    enabled: "활성여부",
    createdDate: "생성일",
    createdBy: "생성자"
  },

  // 테이블 헤더
  blockMemberList: {
    id: "차단ID",
    userId: "유저코드",
    blockedType: "차단유형",
    brandCode: "브랜드",
    nickname: "차단닉네임",
    reason: "차단사유",
    count: "차단횟수",
    createdDate: "신고일",
    targetType: "신고유형",
    boardCode: "게시판종류",
    postId: "게시글ID",
    commentId: "댓글ID",
  },


  hidingPost: {
    id: "게시글ID",
    boardName: "게시판이름",
    boardCode: "게시판코드",
    title: "제목",
    image: "이미지",
    authorNickname: "작성자닉네임",
    userCode: "유저코드",
    createdDate: "작성일",
    updatedDate: "수정일",
    viewCount: "조회수",
    likeCount: "좋아요수",
    commentCount: "댓글수",
    hashtag: "해시태그",
    hashtags: "해시태그",
    postMeta: "게시글메타",
    userLevelGrade: "유저등급",
    userLevelName: "유저등급명",
    isHot: "핫게시글여부",
    hotTime: "핫게시글시간",
    postMeta: "게시글메타",
    qnaStatus: "문의상태",
    qnaCategory: "문의유형",
    eventTargetCompany: "이벤트대상브랜드",
    eventStartDate: "이벤트시작일",
    eventEndDate: "이벤트종료일",
  },


  hidingComment: {
    id: "댓글ID",
    postId: "게시글ID",
    boardCode: "게시판코드",
    boardName: "게시판이름",
    content: "댓글내용",
    likeCount: "좋아요수",
    childCommentCount: "대댓글수",
    userId: "유저코드",
    authorNickname: "작성자닉네임",
    createdDate: "작성일",
    updatedDate: "수정일",
  },

  memberListDetail: {
    phoneNumber: "휴대폰번호",
    id: "유저코드",
    email: "이메일",
    nickname: "닉네임",
    createdDate: "가입일",
    deletedDate: "탈퇴일",
    status: "회원상태",
    brandCode: "브랜드",
    riderCode: "라이더코드",
    hubCode: "허브코드",
    userLevelGrade: "회원등급",
    userLevelName: "회원등급명",
    totalPoint: "누적경험치",
    seasonPoint: "시즌경험치",
    badgeAchievementCount: "달성배지수",
    challengeAchievementCount: "달성챌린지수",
    friendCount: "친구수",
    postCount: "작성게시글수",
    commentCount: "작성댓글수",
    loginCount: "누적방문수",
    lastLoginDate: "마지막로그인",
  },
  badgeStatistics: {
    userId: "유저코드",
    brandCode: "브랜드코드",
    location: "지역",
    badgeId: "배지ID",
    badgeName: "배지명",
    progressCountSum: "진행건수합계",
    achieve: "달성여부",
  },
  memberList: {
    phoneNumber: "휴대폰번호",
    userId: "유저코드", //검색타입노출용
    id: "유저코드",
    brandCode: "브랜드",
    nickname: "닉네임",
    hubCode: "허브코드",
    username: "유저아이디",
    riderCode: "라이더코드",
    createdDate: "가입일",
    status: "라이더상태",
    lastLoginDate: "마지막로그인",
    userLevelGrade: "회원등급",
    totalPoint: "누적경험치",
    seasonPoint: "시즌경험치",
    badgeCount: "달성배지수",
    challengeCount: "달성챌린지수",
    friendCount: "친구수",
    postCount: "작성게시글수",
    commentCount: "작성댓글수",
    loginCount: "누적방문수",

    inDate: "가입일",
    lastLoginDate: "마지막로그인",
    searchType: "검색타입",
    searchKeyword: "검색어",
  },

  badgeManagement: {
    badgeGrant: "배지 부여",
    id: "배지ID",
    name: "배지명",
    image: "배지이미지",
    point: "배지경험치",
    description: "배지설명1",
    conditionDescription: "배지설명2",
    countingStartDate: "배지시작일",
    countingEndDate: "배지 종료일",
    conditionType: "카운팅조건",
    targetCompany: "적용브랜드",
    targetArea: "타겟지역",
    createdDate: "생성날짜",
    updatedDate: "수정날짜",
    updatedBy: "생성자",
    enabled: "활성여부"
  },
  challengeActive: {
    id: "챌린지ID",
    name: "챌린지명",
    image: "챌린지이미지",
    description: "챌린지설명",
    challengeType: "챌린지유형",
    conditionType: "챌린지조건",
    targetCompany: "적용브랜드",
    targetArea: "타겟지역",
    updatedDate: "챌린지 수정일",
    createdDate: "챌린지 생성일",
    updatedBy: "수정자"
  },
  challengeInActive: {
    id: "챌린지ID",
    name: "챌린지명",
    imageUrl: "챌린지이미지",
    description: "챌린지설명",
    challengeType: "챌린지유형",
    conditionType: "챌린지조건",
    targetCompany: "적용브랜드",
    targetArea: "타겟지역",
    updatedDate: "챌린지 수정일",
    createdDate: "챌린지 생성일",
    updatedBy: "수정자"
  },
  challengeStatistics: {
    userId: "유저코드",
    brandCode: "브랜드코드",
    location: "지역",
    challengeId: "챌린지ID",
    challengeName: "챌린지명",
    imageUrl: "챌린지이미지",
    startDate: "시작일",
    endDate: "종료일",
    progressCountSum: "진행건수합계",
    achieve: "달성여부",

    challengePeriod: "챌린지 기간", // 챌린지 기간 구분
  },

  // 고객센터
  customerService: {
    id: "게시글ID",
    boardName: "게시판종류",
    title: "제목",
    image: "이미지",
    userCode: "유저코드",
    authorNickname: "유저닉네임",
    createdDate: "생성일",
    updatedDate: "수정일",
    viewCount: "조회수",
    likeCount: "좋아요수",
    commentCount: "댓글수",
    hashtags: "해시태그",
    hashtag: "해시태그",
    postMeta: "게시글메타",
    qnaStatus: "문의상태",
    qnaCategory: "문의유형",
    eventTargetCompany: "이벤트대상브랜드",
    eventStartDate: "이벤트시작일",
    eventEndDate: "이벤트종료일",
    faqCategory: "FAQ유형",
  },

  communityPost: {
    id: "게시글ID",
    boardName: "게시판종류",
    title: "제목",
    image: "이미지",
    userCode: "유저코드",
    authorNickname: "유저닉네임",
    createdDate: "생성일",
    updatedDate: "수정일",
    viewCount: "조회수",
    likeCount: "좋아요수",
    commentCount: "댓글수",
    hashtags: "해시태그",
    hashtag: "해시태그",
    postMeta: "게시글메타",
    eventTargetCompany: "이벤트대상브랜드",
    eventStartDate: "이벤트시작일",
    eventEndDate: "이벤트종료일",
    qnaCategory: "QnA유형",
    qnaStatus: "QnA상태",
    faqCategory: "FAQ유형",
  },

  communityComment: {
    id: "댓글ID",
    postId: "게시글ID",
    boardName: "게시판종류",
    content: "댓글내용",
    likeCount: "좋아요수",
    childCommentCount: "대댓글수",
    userId: "유저코드",
    authorNickname: "작성자닉네임",
    authorLevel: "작성자레벨",
    createdDate: "작성일",
    updatedDate: "수정일"
  },

  communityNotice: {
    id: "게시글ID",
    boardName: "게시판종류",
    title: "제목",
    image: "이미지",
    userCode: "유저코드",
    authorNickname: "유저닉네임",
    createdDate: "생성일",
    updatedDate: "수정일",
    hashtags: "해시태그",
    hashtag: "해시태그",
    postMeta: "게시글메타",
    qnaStatus: "QnA상태",
    qnaCategory: "QnA유형",
    eventTargetCompany: "이벤트대상브랜드",
    eventStartDate: "이벤트시작일",
    eventEndDate: "이벤트종료일",
    faqCategory: "FAQ유형",
  },

  eventPost: {
    id: "게시글ID",
    boardName: "게시판종류",
    title: "제목",
    image: "이미지",
    userCode: "유저코드",
    authorNickname: "유저닉네임",
    createdDate: "생성일",
    updatedDate: "수정일",
    viewCount: "조회수",
    likeCount: "좋아요수",
    commentCount: "댓글수",
    hashtags: "해시태그",
    hashtag: "해시태그",
    postMeta: "게시글메타",
  },

  eventComment: {
    id: "ID",
    boardName: "게시판종류",
    content: "내용",
    userId: "유저코드",
    authorNickname: "유저닉네임",
    createdDate: "생성일",
    updatedDate: "수정일",
    viewCount: "조회수",
    likeCount: "좋아요수",
    childCommentCount: "대댓글수",
    postId: "게시글ID",
    authorLevel: "작성자레벨",
  },

  pointManagement: {
    id: "경험치ID",
    userId: "유저코드",
    createdDate: "획득일",
    point: "획득경험치",
    type: "획득경로",
  },

  messageSendWait: {
    id: "메시지ID",
    type: "메시지유형",
    subType: "메시지서브유형",
    message: "메시지내용",
    receivedUserCount: "수신대상수",
    successCount: "발송성공수",
    confirmUserCount: "확인완료수",
    createdDate: "생성일",
    author: "작성자",
    sent: "발송여부",
    title: "제목",
    memo: "메모",
  },

  messageSendComplete: {
    id: "메시지ID",
    type: "메시지유형",
    subType: "메시지서브유형",
    message: "메시지내용",
    receivedUserCount: "수신대상수",
    successCount: "발송성공수",
    confirmUserCount: "확인완료수",
    createdDate: "생성일",
    author: "작성자",
    sent: "발송여부",
    title: "제목",
    memo: "메모",
  },

  messageSendingHistory: {
    notificationReservedId: "예약알림ID",
    notificationId: "알림ID", //디테일값 확인할때 사용될 값
    userId: "유저코드",
    brandCode: "브랜드",
    nickname: "닉네임",
    received: "수신여부",
  },

  unprocessedReport: {
    postId: "게시글ID",
    boardCode: "게시판종류",
    createdDate: "생성일",
    commentId: "댓글ID",
    id: "신고ID",
    reportType: "신고유형",
    reportedBy: "신고자ID",
    targetType: "대상유형",
    targetId: "대상번호",
    targetContent: "내용",
    detail: "신고상세내용",
    completed: "처리여부",
    nickname: "신고자닉네임",
  },

  giftTemplate: {
    templateName: "선포비 템플릿명",
    templateTraceId: "선포비 템플릿ID",
    startAt: "발송가능시작",
    endAt: "발송가능종료",
    orderTemplateStatus: "템플릿상태",
    budgetType: "한도타입",
    giftBudgetCount: "선물예산수",
    giftSentCount: "선물발송수",
    giftStockCount: "선물재고수",
    bmSenderName: "발신자명",
    mcImageUrl: "카톡메시지이미지",
    mcText: "카톡메시지내용",
    product: "상품정보",
    itemType: "상품타입",
    productName: "상품명",
    brandName: "상품브랜드명",
    productImageUrl: "상품이미지URL",
    productThumbImageUrl: "상품썸네일이미지URL",
    brandImageUrl: "브랜드이미지URL",
    productPrice: "상품가격",

  },

  // 선물메시지 발송대기
  giftMessageReserved: {
    id: '템플리ID',
    templateName: '템플릿명',
    brand: '브랜드',
    name: '선물명',
    endDate: "발송가능종료일",
    count: "발송가능수",
    startDate: "생성일",
    reservedDate: "예약일",
    createdDate: "생성일",
    targetCount: "발송대상수",
    brandName: "브랜드명",
    stockCount: "재고수",
    receiverCount: "수신자수",
  },

  // 선물메시지 발송완료
  giftMessageSendComplete: {
    id: '템플리ID',
    templateName: '템플릿명',
    brand: '브랜드',
    name: '선물명',
    endDate: "발송가능종료일",
    count: "발송가능수",
    startDate: "생성일",
    targetCount: "발송대상수",
    brandName: "브랜드명",
    stockCount: "재고수",
    reservedDate: "예약일",
    createdDate: "생성일",
    receiverCount: "수신자수",
  },

  // 선물 메시지 발송내역 
  giftMessageOrders: {
    id: '발송내역ID',
    templateId: '템플리ID',
    endAt: "발송가능종료일",
    createdDate: "생성일",
    phoneNumber: "휴대폰번호",
    received: "수신여부",
    receiveUserId: "수신유저ID",
  },

  // 저장된 회원리스트
  saveMemberList: {
    id: "리스트ID",
    name: "제목",
    createdDate: "생성 날짜",
    count: "회원수",
    remove: "삭제하기",
  },

  choiceMemberList: {
    id: "리스트ID",
    name: "제목",
    createdDate: "생성 날짜",
    count: "회원수",
    remove: "삭제하기",
  },


  DELIVERY_TOTAL_COUNT: "수행건수",
  WORKDAY: "근무일",
  CONSECUTIVE_WORKDAY: "연속 근무일",
  DELIVERY_ONEDAY_COUNT: "일최대배달건수",


  free: "자유",
  activity: "활동인증",
  junggo: "중고거래",
  event: "이벤트",
  benefit: "제휴혜택",
  news: "뉴스/공지",

  all: "전체",
  riderCode: "라이더코드",
  brand: "브랜드",
  // nickname: "닉네임",
  hubId: "허브ID",
  riderId: "라이더ID",
  hubAddress1: "허브주소1",
  hubAddress2: "허브주소2",
  riderStatus: "라이더상태",
  joinDate: "가입일",
  lastLogin: "마지막로그인",
  level: "회원레벨",
  pushCode: "푸시코드",
  sentTime: "발송시각",
  fractionation: "분류",
  sentSubject: "발송제목",
  sentContent: "발송내용",
  sentTargetCount: "발송대상수",
  writer: "작성자",
  sentResult: "발송결과",
  confirmedCount: "확인완료수",
  number: "번호",
  messageCode: "메세지코드",
  confirmationStatus: "확인여부",
  templateId: "템플릿ID",
  templateName: "템플릿명",
  templateBrand: "선물브랜드",
  sentCloseTime: "발송가능종료시각",
  sentAvailableCount: "발송가능수",
  productName: "상품명",
  giftGenerationTime: "선물생성시각",
  giftReservationTime: "선물예약시각",
  giftId: "선물ID",
  userHP: "유저HP",
  blockingCode: "차단코드",
  blockingCount: "차단횟수",
  blockingTime: "차단시각",
  handlers: "처리자",
  blockingContentLink: "차단게시글",
  badgeCode: "배지코드",
  badgeName: "배지명",
  badgeImage: "배지이미지",
  badgeDescription: "배지설명",
  badgePeriod: "카운팅 기간",
  badgeConditionType: "카운팅 조건", // 배지 카운팅 항목
  badgeConditionValue: "카운팅 상세조건",
  badgePoint: "배지경험치",
  badgeBrand: "배지적용브랜드",
  appliedBrand: "적용브랜드",
  selectedAreas: "적용지역",
  modifiedTime: "수정시각",
  createTime: "생성시각",
  modifiedUser: "수정자",
  riderAffiliation: "라이더 소속",
  badgeCounting: "배지카운팅",
  badgeAchievementStatus: "배지달성여부",
  challengeCode: "챌린지코드",
  challengeName: "챌린지명",
  challengeDescription: "챌린지설명",
  challengeCountingItems: "카운팅 항목", // 챌린지 카운팅 항목
  seasonPoint: "시즌경험치",
  totalPoint: "누적경험치",
  getPoint: "획득 경험치",
  getPointDate: "경험치 획득일",
  getPointRoute: "경험치 획득 경로",
  boardCode: "게시글코드",
  boardKind: "게시판 종류",
  boardTitle: "제목",
  boardContent: "내용",
  likeCount: "좋아요수",
  commentCount: "댓글수",
  viewCount: "조회수",
  authorCode: "작성자 계정코드",
  authornickname: "작성자 닉네임",
  writeDate: "작성시각",
  modifyDate: "수정시각",
  hiddenState: "숨김여부",
  showReservationTime: "노출예약",
  hashTag: "해시태그",
  adminBoardKind: "게시판 종류", // 관리자 게시판 종류
  eventThumbnail: "이벤트 썸네일",
  boardState: "게시글 상태",
  commentContent: "댓글 내용",
  commentReplyCount: "대댓글 수",
  reportCode: "신고코드",
  reportType: "신고유형",
  reporterAccountCode: "신고자 계정코드",
  reporternickname: "신고자 닉네임",
  reportDate: "신고시각",
  hiddenDate: "숨김시각",
  hidingHandler: "숨김처리자",
  advertisingPostCode: "광고코드", // 마케팅 게시글 코드
  advertisingPosition: "광고위치", // 마케팅 광고 위치
  advertisingImage: "광고이미지",
  advertisingTitle: "광고제목",
  advertisingClickCount: "광고클릭수",
  advertisingStartDate: "광고시작",
  advertisingEndDate: "광고종료",
  accountCode: "계정코드",
  achievedBadgeCount: "달성배지수",
  achievedChallengeCount: "달성챌린지수",
  friendCount: "친구수",
  writeBoardCount: "작성게시글수",
  writeCommentCount: "작성댓글수",
  cumulativeVisits: "누적방문수",
  challengeAchievementStatus: "챌린지달성여부",


  containVote: "투표여부",
  containFile: "첨부파일여부",
  targetCompany: "적용브랜드",
  // id: "아이디",
  startDate: "시작일",
  endDate: "종료일",

  EXPIRED: "만료",
  UNLIMITED: "무제한",
  LIMITED: "제한",
  ALIVE: "활성",

  "자유게시판": "free",
  "활동인증": "activity",
  "활동인증게시판": "activity",
  "활동게시판": "activity",
  "중고거래": "junggo",
  "중고거래게시판": "junggo",
  "이벤트": "event",
  "이벤트게시판": "event",
  "제휴혜택게시판": "benefit",
  "뉴스/공지게시판": "news",
  "FAQ": "faq",
  "Q&A": "qna",
  "고객센터": "qna",



}