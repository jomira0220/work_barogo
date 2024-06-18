

export const FilterSet = (filterName) => {

  const set = [
    {
      hubAddress1: [{
        filterTitle: "허브주소1", filterTitleEn: "hubAddress1", filterType: "일반",
        filterSetItem: [
          { value: "All", title: "전체" },
          { value: "Seoul", title: "서울" },
          { value: "Gyeonggi-do", title: "경기도" },
          { value: "Chungcheongbuk-do", title: "충청북도" },
          { value: "Chungcheongnam-do", title: "충청남도" },
          { value: "Sejong-si", title: "세종" },
          { value: "Daejeon", title: "대전" },
          { value: "Jeollabuk-do", title: "전라북도" },
          { value: "Jeollanam-do", title: "전라남도" },
          { value: "Gyeongsangnam-do", title: "경상남도" },
          { value: "Gyeongsangbuk-do", title: "경상북도" },
          { value: "Jeju", title: "제주" },
          { value: "Gwangju", title: "광주" },
          { value: "Incheon", title: "인천" },
          { value: "Ulsan", title: "울산" },
          { value: "Busan", title: "부산" },
          { value: "Daegu", title: "대구" },
          { value: "Gangwon", title: "강원" }
        ]
      }],
      brandCode: [{
        filterTitle: "브랜드", filterTitleEn: "brandCode", filterType: "일반",
        filterSetItem: [
          { title: "전체", value: "BAROGO,MOALINE,DEALVER" },
          { title: "바로고", value: "BAROGO" },
          { title: "딜버", value: "DEALVER" },
          { title: "모아라인", value: "MOALINE" },
        ]
      }],
      brandRadio: [{
        filterTitle: "브랜드", filterTitleEn: "brandRadio", filterType: "라디오",
        filterSetItem: [
          { title: "바로고", value: "BAROGO" },
          { title: "딜버", value: "DEALVER" },
          { title: "모아라인", value: "MOALINE" },
        ]
      }],
      brandRadio2: [{
        filterTitle: "브랜드", filterTitleEn: "brandRadio2", filterType: "라디오",
        filterSetItem: [
          { title: "바로고", value: "BAROGO" },
          { title: "딜버", value: "DEALVER" },
          { title: "모아라인", value: "MOALINE" },
        ]
      }],
      status: [{ //회원리스트 라이더상태
        filterTitle: "라이더상태", filterTitleEn: "status", filterType: "라디오",
        filterSetItem: [
          { title: "활성", value: "active" },
          { title: "차단", value: "blocked" },
          { title: "탈퇴", value: "deleted" },
        ]
      }],
      joinDate: [{
        filterTitle: "가입날짜", filterTitleEn: "joinDate", filterType: "날짜",
        filterSetItem: { inStartDate: "", inEndDate: "" }
      }],
      lastLogin: [{
        filterTitle: "마지막로그인", filterTitleEn: "lastLogin", filterType: "날짜",
        filterSetItem: { lastLoginStartDate: "", lastLoginEndDate: "" }
      }],
      conditionItem: [{
        filterTitle: "조건항목", filterTitleEn: "conditionItem", filterType: "일반",
        filterSetItem: [
          { title: "전체", value: "전체" },
          { title: "회원수", value: "회원수" },
          { title: "활성사용자수", value: "활성사용자수" },
          { title: "작성게시글수", value: "작성게시글수" },
        ]
      }],
      period: [{
        filterTitle: "기간", filterTitleEn: "period", filterType: "라디오",
        filterSetItem: [
          { title: "7일", value: 7 },
          { title: "6개월", value: 6 },
          { title: "기간선택", value: "기간선택", startDate: "", endDate: "" },
        ]
      }],
      isConfirmed: [{
        filterTitle: "알림 확인여부", filterTitleEn: "isConfirmed", filterType: "라디오",
        filterSetItem: [
          { title: "확인", value: true },
          { title: "미확인", value: false },
        ]
      }],
      boardCode: [{
        filterTitle: "게시판종류", filterTitleEn: "boardCode", filterType: "라디오",
        filterSetItem: [
          { title: "자유", value: "free" },
          { title: "활동인증", value: "activity" },
          { title: "중고거래", value: "junggo" },
          { title: "이벤트", value: "event" },
          { title: "제휴혜택", value: "benefit" },
          { title: "뉴스/공지", value: "news" },
          { title: "FAQ", value: "faq" },
          { title: "시스템공지", value: "system" },
          // { title: "Q&A", value: "qna" },
        ]
      }],
      writeDate: [{
        filterTitle: "작성일", filterTitleEn: "writeDate", filterType: "날짜",
        filterSetItem: { startDate: "", endDate: "" }
      }],
      likeCountUpper: [{
        filterTitle: "좋아요수", filterTitleEn: "likeCountUpper", filterType: "입력",
        filterSetItem: [{ likeCountUpper: 0 }]
      }],
      containFile: [{
        filterTitle: "첨부파일여부", filterTitleEn: "containFile", filterType: "라디오",
        filterSetItem: [
          { title: "전체", value: null },
          { title: "있음", value: true },
          { title: "없음", value: false },
        ]
      }],
      containVote: [{
        filterTitle: "투표여부", filterTitleEn: "containVote", filterType: "라디오",
        filterSetItem: [
          { title: "전체", value: null },
          { title: "있음", value: true },
          { title: "없음", value: false },
        ]
      }],
      hidden: [{
        filterTitle: "숨김상태", filterTitleEn: "hidden", filterType: "라디오",
        filterSetItem: [
          { title: "전체", value: null },
          { title: "숨김", value: true },
          { title: "공개", value: false },
        ]
      }],
      ongoing: [{
        filterTitle: "이벤트상태", filterTitleEn: "ongoing", filterType: "라디오",
        filterSetItem: [
          { title: "전체", value: null },
          { title: "활성", value: true },
          { title: "비활성", value: false },
        ]
      }],
      adminBoardKind: [{ //관리자 게시판 종류
        filterTitle: "게시판종류", filterTitleEn: "adminBoardKind", filterType: "라디오",
        filterSetItem: [
          { title: "이벤트", value: "event" },
          { title: "제휴혜택", value: "benefit" },
          { title: "뉴스/공지", value: "news" },
        ]
      }],
      hiddenDate: [{
        filterTitle: "숨김처리일", filterTitleEn: "hiddenDate", filterType: "날짜",
        filterSetItem: { hiddenStartDate: "", hiddenEndDate: "" }
      }],
      advertisingDate: [{
        filterTitle: "광고기간", filterTitleEn: "advertising", filterType: "날짜",
        filterSetItem: { startDate: "", endDate: "" }
      }],
      isEnabled: [{
        filterTitle: "광고상태", filterTitleEn: "isEnabled", filterType: "라디오",
        filterSetItem: [
          { title: "활성", value: true },
          { title: "비활성", value: false },
        ]
      }],
      pointGetPeriod: [{
        filterTitle: "경험치 획득기간", filterTitleEn: "pointGetPeriod", filterType: "날짜",
        filterSetItem: { startDate: "", endDate: "" }
      }],
      challengePeriod: [{
        filterTitle: "챌린지 기간", filterTitleEn: "challengePeriod", filterType: "날짜",
        filterSetItem: { startDate: "", endDate: "" }
      }],
      baseDate: [{
        filterTitle: "기준일", filterTitleEn: "baseDate", filterType: "기준날짜",
        filterSetItem: { start: "" }
      }],
      containDeleted: [{
        filterTitle: "삭제여부", filterTitleEn: "containDeleted", filterType: "라디오",
        filterSetItem: [
          { title: "미포함", value: false },
          { title: "포함", value: true },
        ]
      }],
      received: [{ // 선물메시지발송내역
        filterTitle: "발송 확인여부", filterTitleEn: "received", filterType: "라디오",
        filterSetItem: [
          { title: "확인", value: true },
          { title: "미확인", value: false },
        ]
      }],
      type: [{ // 배너 관리 배너 타입
        filterTitle: "타입", filterTitleEn: "type", filterType: "라디오",
        filterSetItem: [
          { title: "이미지", value: "image" },
          { title: "텍스트", value: "text" },
        ]
      }],
    }
  ]

  return set[0][filterName]
}



