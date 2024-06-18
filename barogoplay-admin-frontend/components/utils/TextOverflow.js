// 글자가 너무 길 경우 ... 으로 처리하는 함수
// 사용법: TextOverflow(글자, 제한할글자수)
export const TextOverflow = (text, limitCount) => {
  if (text.length > limitCount) {
    return text.substr(0, limitCount) + '...'
  } else {
    return text
  }
}