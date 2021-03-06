// const CronJob = require("cron").CronJob;

const admin = require('firebase-admin');

const serviceAccount = process.env.STANDUP_PK;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount))
});

const db = admin.firestore();

module.exports = (robot) => {
  robot.respond(/cron/, (_) => {
    robot
      .http(
        `https://slack.com/api/channels.list?token=${process.env.HUBOT_SLACK_TOKEN}&exclude_archived=1`
      )
      .get()((err, res, body) => {
        const channels = JSON.parse(body);
        if (channels.ok) {
          channels.channels
          .filter(c => c.name === 'gjeservicebot-gje-workshop')
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

  robot.respond(/standup (.*) (.*) (.*)/, (res) => {
    const [, yesterday, today, obstacles] = res.match;

    db.collection('users')
      .doc(res.envelope.user.id)
      .collection('standups')
      .add({
        date: Date.now(),
        yesterday,
        today,
        obstacles
      });

    res.reply(
      `Standup registrert!!:white-check-mark:\n :champagne: ${yesterday}\n:rocket: ${today}\n:boom: ${obstacles}\n`
    );
  });
};
