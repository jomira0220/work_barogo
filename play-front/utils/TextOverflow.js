export const TextOverflow = (text, limitCount) => {
  if (text.length > limitCount) {
    return text.substr(0, limitCount) + '...'
  } else {
    return text
  }
}