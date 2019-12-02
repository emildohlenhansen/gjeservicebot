const firebase = require("firebase/app");

require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBtGYqCorflOXwgGhlLUEz1MR1RrgcKURc",
  authDomain: "timeforing-f61c1.firebaseapp.com",
  databaseURL: "https://timeforing-f61c1.firebaseio.com",
  projectId: "timeforing-f61c1",
  storageBucket: "timeforing-f61c1.appspot.com",
  messagingSenderId: "318754178810",
  appId: "1:318754178810:web:1afb31c1e6c1906f7b6b43",
  measurementId: "G-T8FQ0KCYM1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = robot => {
  robot.respond(/timeforing (.*) (.*) (.*)/, res => {
    const dato = res.match[1];
    const kode = res.match[2];
    const timer = res.match[3];

    db.collection("timeforinger")
      .doc(res.envelope.user.id)
      .set({
        months: []
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });

    res.reply([dato, kode, timer].join(", "));
  });

  robot.respond(/timeforing hjelp/, res => {
    res.reply(`Følgende paramter brukes (Dato Kode Timer)`);
    res.reply(`Eks: 2019-10-23 PSP1234 8`);
  });
};
