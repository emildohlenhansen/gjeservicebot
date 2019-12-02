const firestore = require("@google-cloud/firestore");

const serviceAccount = process.env.TIMEFORING_PK;

const db  = new firestore({
  keyFilename: JSON.parse(serviceAccount),
  projectId: "timeforing-f61c1"
});

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
