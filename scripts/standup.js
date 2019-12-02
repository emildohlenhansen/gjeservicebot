const CronJob = require("cron").CronJob;

const baseUrl = "https://slack.com/api/";

module.exports = robot => {
  robot.respond(/standup/, msg => {
    robot
      .http(
        `https://slack.com/api/channels.list?token=${process.env.HUBOT_SLACK_TOKEN}&exclude_archived=1`
      )
      .get()((err, res, body) => {
      const channels = JSON.parse(body);

      msg.send(`${channels}`);
    });
  });
};
