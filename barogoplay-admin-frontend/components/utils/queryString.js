export const queryString = (arr) => {
  // arr: 쿼리스트링으로 변환할 객체
  const queryArr = Object.entries(arr).filter(e =>
    // 숫자값이 기본값인 0인 경우 쿼리에서 제외 처리, 브랜드 코드 제외
    e[0] !== "brandCode"
    && e[1] !== 0
    && e[1] !== null
    && e[1] !== ""
  ).map((e) => {
    return e.join('=')
  }).join('&')

  let brandCheck = false;
  Object.keys(arr).forEach((key) => {
    if (key === "brandCode")
      return brandCheck = true
  })

  // 브랜드 코드가 있는 경우 브랜드 코드별로 쿼리스트링 생성
  let brandArr = []
  // 브랜드 코드가 있고 여러개인 경우 - 브랜드 3개인 경우 전체가 기본값이므로 제외 
  if (brandCheck && typeof arr.brandCode === "object" && arr.brandCode.length <= 2) {
    brandArr = arr.brandCode.map(e => `brandCode=${e}`).join('&')
  }

  return brandCheck ? `${brandArr}&${queryArr}` : queryArr

}