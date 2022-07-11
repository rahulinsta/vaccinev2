importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBM4iMSuQf68kUp4HLruFA1-deyW6Cn8Yc",
    authDomain: "vaccines-proof.firebaseapp.com",
    projectId: "vaccines-proof",
    storageBucket: "vaccines-proof.appspot.com",
    messagingSenderId: "199153932759",
    appId: "1:199153932759:web:47323bf0556fe8857e9392",
    measurementId: "G-Z0JSRQ70RK"
  });
  
  // Retrieve an instance of Firebase Messaging so that it can handle background
  // messages.
  const messaging = firebase.messaging()