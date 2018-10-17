// Commands
// bursdager eller bursdagsliste - vis alle bursdager
const moment = require('moment');
const CronJob = require('cron').CronJob;

const bursdager = require('../static/bursdager');

const getAlleBursdager = () => {
  const bursdagsListe = bursdager.bursdager.map(([id, dato]) => `\n\t <@${id}> ${moment(dato, 'DDMM').format('Do MMMM')}`);
  return `Bursdagsoversikt Service Team :cake::tada: : ${bursdagsListe}`;
};

const getDagensBursdager = () => (
  bursdager.bursdager
    .filter(([, dato]) => moment(dato, 'DDMM').isSame(moment(), 'day'))
    .map(([id]) => `psssst! <@${id}> har bursdag idag :tada::cake:`)
);

const aktiverBursdager = (robot) => {
  new CronJob({
    cronTime: '00 00 9 * * 1-7',
    onTick: () => {
      const bursdagsListe = getDagensBursdager();

      if (bursdagsListe.length > 0) {
        bursdager.bursdager.filter(([, dato]) => !moment(dato, 'DDMM').isSame(moment(), 'day'))
          .forEach(([id]) => robot.messageRoom(id, `${bursdagsListe}`));
      }
    },
    start: true,
    timeZone: 'Europe/Oslo'
  });
};

module.exports = (robot) => {
  aktiverBursdager(robot);
  robot.respond(/(bursdagsliste|bursdager)$/i, (res) => {
    const dagensBursdager = getAlleBursdager();
    robot.messageRoom(res.envelope.user.id, `${dagensBursdager}`);
  });
};
