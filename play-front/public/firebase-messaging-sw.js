
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.14.0/firebase-messaging-compat.js');



firebase.initializeApp({
  apiKey: "AIzaSyC2UpWGQn6oA48KXll6UHnmzwSddfWw5pM",
  authDomain: "weppushtest.firebaseapp.com",
  projectId: "weppushtest",
  storageBucket: "weppushtest.appspot.com",
  messagingSenderId: "724917861668",
  appId: "1:724917861668:web:68236c27aa451c86b1c7b1",
  measurementId: "G-YLMDMPNK3D"
});

const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });