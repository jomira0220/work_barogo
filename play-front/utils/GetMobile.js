import { GetBrowser } from './GetBrowser';

export function GetMobile() {
  var user = navigator.userAgent;
  var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (mobile) {
    mobile = user.match(/lg/i) != null ? "lg"
      : user.match(/iphone|ipad|ipod/i) != null ? "ios"
        : user.match(/android/i) != null ? "android"
          : "other mobile";
  } else {
    mobile = GetBrowser();
  }

  console.log(mobile);
  return mobile;
}