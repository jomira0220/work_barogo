import { initializeApp } from 'firebase/app'
import { getMessaging, onMessage, getToken } from 'firebase/messaging'
import { getAnalytics } from 'firebase/analytics'

export const OnMessageFCM = async (setPushData) => {
  // console.log("OnMessageFCM")
  // 브라우저에 알림 권한을 요청합니다.
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') return

  // 이곳에도 아까 위에서 앱 등록할때 받은 'firebaseConfig' 값을 넣어주세요.
  const firebaseApp = initializeApp({
    apiKey: "AIzaSyC2UpWGQn6oA48KXll6UHnmzwSddfWw5pM",
    authDomain: "weppushtest.firebaseapp.com",
    projectId: "weppushtest",
    storageBucket: "weppushtest.appspot.com",
    messagingSenderId: "724917861668",
    appId: "1:724917861668:web:68236c27aa451c86b1c7b1",
    measurementId: "G-YLMDMPNK3D"
  })

  const analytics = getAnalytics(firebaseApp);
  const messaging = getMessaging(firebaseApp)

  // 이곳 vapidKey 값으로 아까 토큰에서 사용한다고 했던 인증서 키 값을 넣어주세요.
  getToken(messaging, {
    vapidKey: "BEvLKDjZK2cMGw97d2WDLACkZc-e_EVSv4HhyfA8XdeqhdkTSndS4R5_pjysYOYujF5lFROG4hQmAan8Shkkfuw"
  }).then((currentToken) => {
    if (currentToken) {
      // 정상적으로 토큰이 발급되면 콘솔에 출력합니다.
      // console.log(currentToken)
    } else {
      // console.log('No registration token available. Request permission to generate one.')
    }
  }).catch((err) => {
    // console.log('An error occurred while retrieving token. ', err)
  })

  // 메세지가 수신되면 역시 콘솔에 출력합니다.
  onMessage(messaging, (payload) => {
    // console.log('Message received. ', payload)
    setPushData(payload.notification)
  })
}

