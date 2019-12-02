//const CronJob = require("cron").CronJob;

const baseUrl = "https://slack.com/api/";

module.exports = robot => {
  robot.respond(/standup/, msg => {
    robot
      .http(
        `https://slack.com/api/channels.list?token=${process.env.HUBOT_SLACK_TOKEN}&exclude_archived=1`
      )
      .get()((err, res, body) => {
      const channels = JSON.parse(body);
      if (channels.ok) {
        const members = channels.channels
          .filter(c => c.name === "gjeservicebot-gje-workshop")
          .map(c => c.members)[0]
          .forEach(id =>
            robot.messageRoom(
              id,
              "Reminder: Standup! :loudspeaker:\n\n:champagne: Hva endte du med å gjøre i går?\n:rocket: Hva er planen å gjøre i dag?\n:boom: Hvilke hindringer har du for å få gjort det du skal?\n\nKjør tråd."
            )
          );
      }
    });
  });
};
