import Filter from 'badwords-ko';
import { badwordsData } from './badwordsData';

// !비속어 포함 여부 체크
export const badWordCheck = (text) => {
  const badwordsFilter = new Filter();
  badwordsFilter.addWords(...badwordsData) // 비속어 추가
  const badwordsCheck = badwordsFilter.clean(text);
  // text와 badwordsCheck 공백제거 후 비속어가 포함되어 있는지 확인
  console.log(text.replace(/(\s*)/g, ""), badwordsCheck.replace(/(\s*)/g, ""))
  if (text.replace(/(\s*)/g, "") !== badwordsCheck.replace(/(\s*)/g, "")) {
    return false;
  } else {
    return true;
  }
}