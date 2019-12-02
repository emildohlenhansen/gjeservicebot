

module.exports = robot => {
  robot.respond(/timeforing (.*) (.*) (.*)/, res => {
    const dato = res.match[1];
    const kode = res.match[2];
    const timer = res.match[3];

    res.reply([dato, kode, timer].join(', '));
  });
}