const moment = require('moment');
const CronJob = require('cron').CronJob;

const statusansvarlige = require('../static/statusansvarlig');

const getAnsvarliglistelisteOversikt = () => {
  const ansvarligliste = statusansvarlige.ansvarlige.map(([id, uke]) => `\n\t Uke: ${uke}: <@${id}>`);
  return `Ansvarlige for overvåkning av våre tjenester: ${ansvarligliste}`;
};

const getAnsvarliglisteliste = () => {
  const ansvarligliste = statusansvarlige.ansvarlige;
  for (let index in ansvarligliste) {
    const forrigeHvem = index > 0 ? ansvarligliste[index - 1][0] : "Ingen";
    const hvem = ansvarligliste[index][0];
    const uke = ansvarligliste[index][1];

    if (moment().week(uke).isSame(moment(), 'week')) {
      return `:bell: Denne uka er <@${hvem}> ansvarlig for overvåkning av våre tjenster :tv:`;
    }
  }
};


aktiverAnsvarligliste = () => {
  new CronJob({
    cronTime: '0 9 * * 1',
    onTick: () => {
      const ansvarligliste = statusansvarlige.ansvarlige;
      const rom = statusansvarlige.rom;
      for (let index in ansvarligliste) {
        const forrigeHvem = index > 0 ? ansvarligliste[index - 1][0] : "Ingen";
        const hvem = ansvarligliste[index][0];
        const uke = ansvarligliste[index][1];

        if (moment().week(uke).isSame(moment(), 'week')) {
          robot.messageRoom(rom, `:bell: Denne uka er <@${hvem}> ansvarlig for overvåkning av våre tjenster :tv:. <@${forrigeHvem}> holder oppsummering om forrige uke på mandagsmøtet :ok_hand:.`);
        }
      }
    },
    start: true,
    timeZone: 'Europe/Oslo'
  });
};

module.exports = (robot) => {
  aktiverAnsvarligliste(robot);
  robot.respond(/(statusansvarligoversikt)$/i, (res) => {
    const ansvarliglisteOversikt = getAnsvarliglistelisteOversikt();
    res.send(`${ansvarliglisteOversikt}`);

    robot.respond(/(statusansvarlig)$/i, (res) => {
      const ansvarligliste = getAnsvarliglisteliste();
      res.send(`${ansvarligliste}`);
    });
  });
};
