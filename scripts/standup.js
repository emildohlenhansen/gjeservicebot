//const CronJob = require("cron").CronJob;

const baseUrl = "https://slack.com/api/";

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
    console.log();
    //*${}*\n
    /*res.reply(
      `:champagne: ${yesterday}\n:rocket: ${today}\n:boom: ${obstacles}\n`
    );*/
    res.reply(JSON.stringify(res));
  });
};
