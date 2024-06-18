// !이메일 양식 체크
export const CheckEmail = (email) => {
  const regExp = /^[a-zA-Z0-9]([-_.0-9a-zA-Z]*)+@[0-9a-zA-Z]+\.[a-z]{2,3}$/;
  if (regExp.test(email)) {
    SetEmailCheck('사용 가능한 이메일입니다.');
  } else if (email === "") {
    SetEmailCheck('');
  } else {
    SetEmailCheck('사용할 수 없는 이메일입니다.');
  }
}