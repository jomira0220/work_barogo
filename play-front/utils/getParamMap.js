// url에서 파라미터를 추출하여 객체로 반환하는 함수
export const getParamMap = (url) => {
  const params = url.split('?')[1]
  if (!params) {
    return {}
  }
  return params.split('&').reduce((acc, cur) => {
    const [key, value] = cur.split('=')
    return { ...acc, [key]: value }
  }, {})
}