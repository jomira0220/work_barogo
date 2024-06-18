// 전달받은 시간을 한국 시간으로 변경해주는 함수
// TimeKoChange(시간) -> 한국 시간으로 변경된 시간 반환
// 예시) TimeKoChange('2021-08-09T12:00:00.000Z') -> '2021-08-09T21:00:00'
export const TimeKoChange = (date) => {
  const curr = new Date(date)
  const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000)
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000
  const kr_curr = new Date(utc + (KR_TIME_DIFF) + (KR_TIME_DIFF))
  return kr_curr.toISOString().slice(0, 19)
}