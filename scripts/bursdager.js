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

const aktiverBursdager = (robot) => {
  new CronJob({
    cronTime: '00 15 13 * * 1-5',
    onTick: () => {
      const rom = bursdager.rom;
      const bursdager = bursdager.bursdager;

      for(let index in bursdager){
        const bursdagsbarn = bursdager[index][0];
        const bursdagsdato = bursdager[index][1];

        if(moment(bursdagsdato,"DDMM").isSame(moment(), 'day')){
          robot.messageRoom(rom, `Hipp Hipp hurra for @${bursdagsbarn} :tada::tada:  Håper du får en knirkefri dag!`);
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
    res.send(`${robot.room} ${bursdagsliste}`);
  });
};
