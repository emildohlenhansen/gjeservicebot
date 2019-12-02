const admin = require("firebase-admin");

const serviceAccount = process.env.TIMEFORING_PK;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
}, 'timeforing');

const db = admin.firestore();

module.exports = robot => {
  robot.respond(/timeforing (.*) (.*)/, res => {
    const kode = res.match[1];
    const timer = res.match[2];

    db.collection("timeforinger")
      .doc(res.envelope.user.id)
      .set({
        date: new Date().toLocaleDateString('nb-NO'),
        hours: timer,
        code: kode,
      })

    res.reply([dato, kode, timer].join(", "));
  });

  robot.respond(/timeforing hjelp/, res => {
    res.reply(`Følgende paramter brukes (Dato Kode Timer)`);
    res.reply(`Eks: 2019-10-23 PSP1234 8`);
  });
};
