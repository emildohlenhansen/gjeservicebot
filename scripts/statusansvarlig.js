const moment = require('moment');
const CronJob = require('cron').CronJob;

const statusansvarlige = require('../static/statusansvarlig');

const getAnsvarliglisteliste = () => {
  const ansvarligliste = Object.keys(statusansvarlige.ansvarlige).map(key => `\n\t${key}: <@${statusansvarlige.ansvarlige[key]}>`);
  return `Ansvarlige for overvåkning av våre tjenester: ${ansvarligliste}`;
};

aktiverAnsvarligliste = () => {
  new CronJob({
    cronTime: '0 9 * * 1',
    onTick: () => {
      const ansvarligliste = statusansvarlige.ansvarlige;
      const rom = statusansvarlige.rom;
      for(let index in ansvarligliste){
        const forrigeHvem = bursdagsListe[index - 1][0];
        const hvem = bursdagsListe[index][0];
        const uke = bursdagsListe[index][1];

        if(moment.week(uke).isSame(moment(), 'week')){
          robot.messageRoom(rom, `:bell: Denne uka er <@${hvem}> ansvarlig for overvåkning av våre tjenster :tv:. <@${forrigeHvem}> holder oppsummering om forrige uke på mandagsmøtet :ok_hand:.`);
        }
      }
    },
    start: true,
    timeZone: 'Europe/Oslo'
  })
};

module.exports = (robot) => {
  aktiverAnsvarligliste(robot);
  robot.respond(/(statusansvarlig)$/i, (res) => {
    const ansvarligliste = getAnsvarliglisteliste();
    res.send(`${ansvarligliste}`);
  });
};
