// Commands
// bursdager eller bursdagsliste - vis alle bursdager
const bursdager = require('../static/bursdager');

const capitalize = string => (
  string.charAt(0).toUpperCase() + string.slice(1)
);

const getBursdagsliste = () => {
  const bursdagsliste = Object.keys(bursdager.bursdager).map(key => `\n\t${capitalize(key)}: ${bursdager.bursdager[key]}`);
  return `Alle bursdager: ${bursdagsliste}`;
};

module.exports = (robot) => {
  robot.respond(/(bursdagsliste|bursdager)$/i, (res) => {
    const bursdagsliste = getBursdagsliste();
    res.send(`${bursdagsliste}`);
  });
};
