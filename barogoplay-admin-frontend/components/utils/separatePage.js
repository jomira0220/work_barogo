// 한 페이지내에 페이징이 여러개인 경우 각 테이블 별로 쿼리 페이지 명을 다르게 해주기 위한 변수
// 아래에 해당하는 카테고리 테이블들은 페이지 이동시 쿼리에서 page=1가 아닌 
// choiceMemberListPage=1 이러한 형태로 쿼리가 들어감
// BasicTable, PaginationBox, FilterDataSet 컴포넌트에서 사용중

export const separatePage = [
  "choiceMemberList", // 선택된 회원리스트
  "giftTemplate", "giftMessageReserved", "giftMessageSendComplete", // 선물 템플릿, 선물 메세지 발송대기, 선물 메세지 발송완료
  "messageSendComplete", "messageSendWait", // 메세지 발송완료, 메세지 발송대기
  "challengeActive", "challengeInActive", // 활성화, 비활성화 챌린지
]