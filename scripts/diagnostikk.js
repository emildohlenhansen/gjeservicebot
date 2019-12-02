// Description:
// Diagnostikk av botens tilstand.
//
// Commands:
// hubot feature [ny feature] - Foreslå en ny feature til boten

module.exports = robot => {
  robot.respond(/hvilket rom er dette/, res => {
    res.send(res.message.room);
  });

  robot.respond(/hvilke rom er du i/, msg => {
    robot
      .http(
        `https://slack.com/api/channels.list?token=${process.env.HUBOT_SLACK_TOKEN}&exclude_archived=1`
      )
      .get()((err, res, body) => {
      const romnavn = JSON.parse(body)
        .channels.filter(channel => channel && channel.id)
        .filter(channel => channel.is_member)
        .map(channel => channel.name);

      msg.send(`Disse åpne kanalene er jeg i: ${romnavn.join()}`);
    });
    robot
      .http(
        `https://slack.com/api/groups.list?token=${process.env.HUBOT_SLACK_TOKEN}&exclude_archived=1`
      )
      .get()((err, res, body) => {
      const grupper = JSON.parse(body)
        .groups.filter(group => group && group.id)
        .map(group => group.name);

      msg.send(`Disse private kanalene er jeg i: ${grupper.join()} :boom:`);
    });
  });

  robot.respond(/feature (.*)/, res => {
    res.send("Takk, jeg skal notere det ned!");
    robot.messageRoom("CD1HHGMC0", `Ny feature request: ${res.match[1]}`);
  });

  robot.respond(/hjelp(?:\s+(.*))?/i, res => {
    const name = robot.alias || robot.name;
    let commands = robot
      .helpCommands()
      .map(command => command.replace(/^hubot/i, name));
    const filter = res.match[1];

    if (filter) {
      commands = commands.filter(command =>
        command.match(new RegExp(filter, "i"))
      );
      if (commands.length === 0) {
        res.send(`Fant ingen kommandoer som matchet ${filter}`);
        return;
      }
    }

    res.reply(commands.join("\n"));
  });
};
