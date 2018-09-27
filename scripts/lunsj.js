//Commands
// lunsj - vis hele ukens lunsjmeny
// lunsj dag - lunsj meny for gitt dag
// lunsj dag sted - lunsj for gitt dag på gitt sted
// lunsj sted - lunsj for sted hele uken

const menyer = require('../static/lunsj');
const CronJob = require('cron').CronJob;
const lunsjvarsler = {};
const ukedager = [
  'mandag',
  'tirsdag',
  'onsdag',
  'torsdag',
  'fredag'
];

const logRespond = (robot, res) => {
  robot.logger.info(`Respond - user: ${res.message.user.name}, command ${res.match[0]}`);
};

const capitalize = string = (
  string.charAt(0).toUpperCase() + string.slice(1)
);

const ukemeny = (data, sted) => {
  const meny = Object.keys(data).map(key => `\n\t${capitalize(key)}: ${data[key]}`);
  return `Ukensmeny på ${sted}: ${meny}`;
};

const dagsmeny = (data, sted) => `Dagens meny på ${sted}: ${data}`;

const menyMangler = sted => `Ingen meny tilgjengelig på ${sted} :pensive:`;

const getDagsmeny = (sted, ukedag) => (
  menyer[sted] ? ukemeny(menyer[sted], sted) : menyMangler(sted)
);

const getUkemeny = (sted) => (
  menyer[sted] ? ukemeny(menyer[sted], sted) : menyMangler(sted)
);

const getVarsel = (robot, rom) => {
  new CronJob({
    cronTime: '00 30 10 * * 1-5',
    onTick: () => {
      const dag = new Date().getDay() - 1;
      const ukedag = ukedager[dag];

      const menyHuset = getDagsmeny('huset', ukedag);
      const menyGalleriet = getDagsmeny('galleriet', ukedag);

      robot.messageRoom(rom, `Nå er det snart tid for lunsj! :hamburger: \n${menyHuset}\n${menyGalleriet}`);
    },
    start: true,
    timeZone: 'Europe/Oslo'
  })
};

const aktiverVarsel = (robot, rom) => {
  lunsjvarsler[rom] = getVarsel(robot, rom);
};

const aktiverVarsler = (robot) => {
  const romListe = menyer.rom;
  const aktiverteVarsler = Object.keys(lunsjvarsler);

  romListe.filter(rom => aktiverteVarsler.indexOf(rom) === -1)
    .forEach((rom) => {
      aktiverVarsel(robot, rom);
    });
};

module.exports = (robot) => {
  aktiverVarsel(robot);
  robot.respond(/(lunsj|lunch|lønsj) ((?:i ?|man|tirs|ons|tors|fre)dag) ?(galleriet|huset)?(:vårt)?$/i, (res) => {
    logRespond(robot, res);
    const dag = res.match[2] === 'idag' || res.match[2] === 'i dag' ?
      new Date().getDay() - 1 :
      ukedager.indexOf(res.match[2].toLowerCase());
    const ukedag = ukedager[dag];
    if (ukedag) {
      const sted = res.match[3] && res.match[3].replace(/ ?vårt/i, '');
      if (sted) {
        res.send(getDagsmeny(sted, ukedag));
      } else {
        const menyHuset = getDagsmeny('huset', ukedag);
        const menyGalleriet = getDagsmeny('galleriet', ukedag);

        res.send(`${menyHuset}\n${menyGalleriet}`);
      }
    } else {
      res.send('Jeg tror ikke kantinene er åpne i dag :thinking_face:');
    }
  });

  robot.respond(/lunsj (galleriet|huset)/i, (res) => {
    logRespond(robot, res);
    const sted = res.match[1];
    res.send(getUkemeny(sted));
  })
};
