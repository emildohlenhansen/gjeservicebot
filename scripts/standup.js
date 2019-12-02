//const CronJob = require("cron").CronJob;

const firebase = require("firebase/app");

require("firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyBsHrSqz3wyLA0uoD9kz4CBTECcyII-o78",
  authDomain: "servicebot-standup.firebaseapp.com",
  databaseURL: "https://servicebot-standup.firebaseio.com",
  projectId: "servicebot-standup",
  storageBucket: "servicebot-standup.appspot.com",
  messagingSenderId: "71766126845",
  appId: "1:71766126845:web:703cd92be1f5e828118e94"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

module.exports = robot => {
  robot.respond(/cron/, _ => {
    robot
      .http(
        `https://slack.com/api/channels.list?token=${process.env.HUBOT_SLACK_TOKEN}&exclude_archived=1`
      )
      .get()((err, res, body) => {
      const channels = JSON.parse(body);
      if (channels.ok) {
        channels.channels
          .filter(c => c.name === "gjeservicebot-gje-workshop")
          .map(c => c.members)[0]
          .forEach(id =>
            robot.messageRoom(
              id,
              'Reminder: Standup! :loudspeaker:\n\n \n\nFormat: _standup_ "hva du gjorde i går" "hva du skal gjøre i dag" "hvilke hindringer du har"'
            )
          );
      }
    });
  });

  robot.respond(/standup (.*) (.*) (.*)/, res => {
    const [yesterday, today, obstacles] = res.match;

    db.collection("standup")
      .doc(Date.now())
      .set({
        date: Date.now(),
        user: res.envelope.user.id,
        yesterday,
        today,
        obstacles
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });

    res.reply(
      `:champagne: ${yesterday}\n:rocket: ${today}\n:boom: ${obstacles}\n`
    );
  });
};
