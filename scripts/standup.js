const CronJob = require("cron").CronJob;

const baseUrl = "https://slack.com/api/";

module.exports = robot => {
  robot.respond(/channels/, res => {
    const channels = robot.http(
      `${baseUrl}channels.list?token=${process.env.HUBOT_SLACK_TOKEN}`
    );
    res.send(channels);
  });
};
