// Commands
// bursdager eller bursdagsliste - vis alle bursdager
const moment = require('moment');
const CronJob = require('cron').CronJob;

const bursdager = require('../static/bursdager');

const getAlleBursdager = () => {
  const bursdagsListe = bursdager.bursdager.map(([id, dato]) => `\n\t <@${id}> ${moment(dato, "DDMM").format("Do MMMM")}`);
  return `Bursdagsoversikt Service Team :cake::tada: : ${bursdagsListe}`;
};

const getDagensBursdager = () => (
  bursdager.bursdager
    .filter(([id, dato]) => moment(dato, "DDMM").isSame(moment(), 'day'))
    .map(([id, dato]) => `Hipp Hipp hurra for <@${id}> :tada::cake:  Håper du får en knirkefri dag!`)
);

const aktiverBursdager = (robot) => {
  new CronJob({
    cronTime: '00 00 9 * * 1-5',
    onTick: () => {
      const bursdagsListe = getDagensBursdager();
      const rom = bursdager.rom;
      if(bursdagsListe.length > 0){
        robot.messageRoom(rom, bursdagsListe);
      }
    },
    start: true,
    timeZone: 'Europe/Oslo'
  })
};

module.exports = (robot) => {
  aktiverBursdager(robot);
  robot.respond(/(bursdagsliste|bursdager)$/i, (res) => {
    const dagensBursdager = getAlleBursdager();
    robot.messageRoom('UB9CWUCS1', `${dagensBursdager}`);
  });
};
