// Description:
//  Boten foreslår ispause hvis været er bra!
//
// Commands:
// hubot is - Er det bra nok vær for en ispause?

const romliste = require('../static/is');

const CronJob = require('cron').CronJob;
const xml2json = require('xml2json');

const isvarsler = {};

const YR_OSLO = 'https://www.yr.no/sted/Norge/Oslo/Oslo/Oslo/varsel_time_for_time.xml';

const SYMBOLER_FINT_VAER = [
  { number: '1', name: 'Klarvær' },
  { number: '2', name: 'Lettskyet' }
];

const erDetGodtNokVaerForIspause = robot => (
  new Promise((resolve, reject) => {
    robot.http(YR_OSLO)
    .get()((err, response, body) => {
      if (err) { reject(); }

      const dataJson = xml2json.toJson(body);
      const prognose = JSON.parse(dataJson).weatherdata.forecast.tabular.time[0];
      const erDetMeldtRegn = Number(prognose.precipitation.value) > 0;
      const erDetVarmtNok = Number(prognose.temperature.value) > 25;
      const erDetSol = SYMBOLER_FINT_VAER
        .some(symbol => symbol.number === prognose.symbol.number);

      const resultat = erDetSol && erDetVarmtNok && !erDetMeldtRegn;

      resolve([resultat, prognose.temperature.value, prognose.symbol.name]);
    });
  })
);

const getVarsel = (robot, rom) => (
  new CronJob({
    cronTime: '00 30 13 * * 1-5',
    onTick: () => {
      erDetGodtNokVaerForIspause(robot).then(([resultat, temp, vaer]) => {
        if (resultat) {
          robot.messageRoom(rom, `Det er meldt ${temp} grader og ${
            vaer.toLowerCase()} :mostly_sunny: Ispause kl 14? :icecream:`);
        }
      });
    },
    start: true,
    timeZone: 'Europe/Oslo'
  })
);

const aktiverVarsler = (robot) => {
  romliste.forEach((rom) => {
    isvarsler[rom] = getVarsel(robot, rom);
  });
};

module.exports = (robot) => {
  aktiverVarsler(robot);

  robot.respond(/is/i, (res) => {
    erDetGodtNokVaerForIspause(robot).then(([resultat, temp, vaer]) => {
      res.send(`Det er meldt ${temp} grader og ${vaer.toLowerCase()}, så ${resultat ? 'is høres bra ut! :icecream:' : 'kanskje det ikke blir ispause akkurat nå :pensive:'}`);
    });
  });
};
