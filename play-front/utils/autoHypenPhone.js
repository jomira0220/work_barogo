export function autoHypenPhone(e) {

  let str = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기

  var tmp = '';
  if (str.length < 4) {
    return e.target.value = str
  } else if (str.length < 7) {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3);
    return e.target.value = tmp
  } else if (str.length < 11) {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3, 3);
    tmp += '-';
    tmp += str.substr(6);
    return e.target.value = tmp
  } else {
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3, 4);
    tmp += '-';
    tmp += str.substr(7);
    return e.target.value = tmp
  }


}

