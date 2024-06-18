
// 날짜 계산 함수 시간을 제외한 날짜만 반환
export const daySet = (baseDate, minusNum) => {
  // baseDate: 기준 날짜, minusNum: 기준 날짜로부터 뺄 날짜
  const date = baseDate ? new Date(baseDate) : new Date();
  return new Date(date.setDate(date.getDate() - minusNum))
    .toISOString()
    .slice(0, 10);
};

// 월 계산 함수 시간을 제외한 날짜만 반환
export const monthSet = (baseDate, minusNum) => {
  // baseDate: 기준 날짜, minusNum: 기준 날짜로부터 뺄 달
  const date = baseDate ? new Date(baseDate) : new Date();
  return new Date(date.setMonth(date.getMonth() - minusNum))
    .toISOString()
    .slice(0, 10);
};