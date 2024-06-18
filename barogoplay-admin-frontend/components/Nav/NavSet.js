export const NavTitle = {
  member: '회원 관리',
  activity: '활동 관리',
  board: '게시판 관리',
  advertising: '배너 관리',
  recommendCode: '추천 코드 관리',
  systemNotice: '플레이 운영 공지',
  savememberlist: '저장된 회원리스트',
  customerService: '고객센터'
}

export const NavList = {
  member: [
    { path: 'dashboard', title: '대시보드' },
    { path: 'memberList', title: '회원리스트' },
    {
      path: 'message', title: '메시지 관리',
      subNav: [
        { path: 'messageList', title: "알림 메시지" },
        { path: 'messageSendingHistory', title: "알림 메시지 발송내역" }
      ]
    },
    {
      path: 'gift', title: '선물 관리',
      subNav: [
        { path: "giftList", title: "템플릿 & 선물 메시지 생성" },
        { path: "giftMessageSendingHistory", title: "선물 메시지 발송내역" }
      ]
    },
    { path: 'blockManagement', title: '차단 관리' },
  ],
  activity: [
    {
      path: 'badge', title: '배지 관리',
      subNav: [
        { path: "badgeManagement", title: "배지 관리" },
        { path: "badgeStatistics", title: "배지 달성 현황" }
      ]
    },
    {
      path: 'challenge', title: '챌린지 관리',
      subNav: [
        { path: "challengeManagement", title: "챌린지 관리" },
        { path: "challengeStatistics", title: "챌린지 달성 현황" }
      ]
    },
    {
      path: 'point', title: '경험치 관리',
    },
    // {
    //   path: 'rank', title: '랭킹 관리',
    //   subNav: [
    //     { path: "seasonRanking", title: "시즌 랭킹" },
    //     { path: "totalRanking", title: "명예의 전당" }
    //   ]
    // },
  ],
  board: [
    {
      path: 'community', title: '커뮤니티',
      subNav: [
        { path: "post", title: "게시글" },
        { path: "comment", title: "댓글" },
        { path: "notice", title: "공지" }
      ]
    },
    {
      path: 'event', title: '관리자 게시판',
      subNav: [
        { path: "post", title: "게시글" },
        { path: "comment", title: "댓글" }
      ]
    },
    { path: 'unprocessedReport', title: '미처리 신고' },
    {
      path: 'hiding', title: '숨김처리 게시글 & 댓글',
      subNav: [
        { path: "post", title: "게시글" },
        { path: "comment", title: "댓글" }
      ]
    },
    { path: 'write', title: '관리자 게시글 작성' },
  ],
  advertising: [{ path: 'advertising', title: '배너 관리' }],
  recommendCode: [{ path: 'recommendCode', title: '추천 코드 관리' }],
  customerService: [{ path: 'customerService', title: '고객센터' }],
  systemNotice: [{ path: 'systemNotice', title: '플레이 운영 공지' }],
  savememberlist: [{ path: 'savememberlist', title: '저장된 회원리스트' }],
}