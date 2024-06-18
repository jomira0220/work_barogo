// !비밀번호 보이기/숨기기
export const passwordShowHideHandler = (e, setPasswordShow, passwordShow) => {
  let passwordShowArr = { ...passwordShow };
  const target = e.currentTarget.previousSibling;
  target.type === "text" ? target.type = "password" : target.type = "text";
  passwordShowArr[target.id] = passwordShowArr[target.id] === "off" ? "on" : "off";
  setPasswordShow(passwordShowArr);
  // console.log(passwordShowArr)
}