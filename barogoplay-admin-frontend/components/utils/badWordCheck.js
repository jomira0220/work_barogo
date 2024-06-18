import Filter from 'badwords-ko';
import { badwordsData } from './badwordsData';

// !비속어 포함 여부 체크
export const badWordCheck = (text) => {
  const badwordsFilter = new Filter();
  badwordsFilter.addWords(...badwordsData) // 비속어 추가
  const badwordsCheck = badwordsFilter.clean(text); // 비속어가 있으면 비속어를 *로 대체하여 반환

  // text와 badwordsCheck 공백제거 후 비속어가 포함되어 있는지 확인
  const originalText = text.replace(/(\s*)/g, "").replace(/\n/g, "");
  const badwordsText = badwordsCheck.replace(/(\s*)/g, "").replace(/\n/g, "");

  console.log("비속어 포함 여부 : ", originalText !== badwordsText, "originalText", originalText, "badwordsText", badwordsText)

  if (originalText !== badwordsText) {
    return false;
  } else {
    return true;
  }
}