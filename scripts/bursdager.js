// Commands
// bursdager eller bursdagsliste - vis alle bursdager
const moment = require('moment');
const CronJob = require('cron').CronJob;

const bursdager = require('../static/bursdager');

const capitalize = string => (
  string.charAt(0).toUpperCase() + string.slice(1)
);

const getBursdagsliste = () => {
  const bursdagsliste = Object.keys(bursdager.bursdager).map(key => `\n\t${capitalize(key)}: ${bursdager.bursdager[key]}`);
  return `Alle bursdager: ${bursdagsliste}`;
};

const getDagensBursdager = () => {
  const bursdagsListe = bursdager.bursdager;
  const rom = bursdager.rom;
  let bursdagsString = "";
  for(let index in bursdagsListe){
    const bursdagsbarn = bursdagsListe[index][0];
    const bursdagsdato = bursdagsListe[index][1];
    if(moment(bursdagsdato,"DDMM").isSame(moment(), 'day')){
      bursdagsString += `Hipp Hipp hurra for <${bursdagsbarn}> :tada::tada:  Håper du får en knirkefri dag! \n`;
    }
  }

  return bursdagsString;
};

const aktiverBursdager = (robot) => {
  new CronJob({
    cronTime: '00 25 13 * * 1-5',
    onTick: () => {
      const bursdagsListe = bursdager.bursdager;
      const rom = bursdager.rom;
      for(let index in bursdagsListe){
        const bursdagsbarn = bursdagsListe[index][0];
        const bursdagsdato = bursdagsListe[index][1];

        if(moment(bursdagsdato,"DDMM").isSame(moment(), 'day')){
          robot.messageRoom('CD1HHGMC0', `Hipp Hipp hurra for <${bursdagsbarn}> :tada::tada:  Håper du får en knirkefri dag!`);
        }
      }
    },
    start: true,
    timeZone: 'Europe/Oslo'
  })
};

module.exports = (robot) => {
  aktiverBursdager(robot);
  robot.respond(/(bursdagsliste|bursdager)$/i, (res) => {
    const bursdagsliste = getBursdagsliste();
    res.send(`${bursdagsliste}`);
  });

  robot.respond(/(bursdageridag)$/i, (res) => {
    const dagensBursdager = getDagensBursdager();
    robot.messageRoom('CD1HHGMC0',`${dagensBursdager}`);
  });
};
